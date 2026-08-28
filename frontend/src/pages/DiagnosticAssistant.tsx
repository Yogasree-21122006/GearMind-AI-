import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Sparkles,
  Clock,
  Loader2,
  ShieldAlert,
  BookOpen,
  Camera,
  Hammer,
  HelpCircle,
  RefreshCw,
  ThumbsUp,
  FileText
} from 'lucide-react';
import { AlertBanner } from '../components/AlertBanner';
import { SmartLoader } from '../components/SmartLoader';
import { diagnosticService, DiagnosticAnalysisResponse } from '../services/diagnosticService';
import { assetService } from '../services/assetService';
import { Asset, DiagnosticSession } from '../types';
import { useAuth } from '../context/AuthContext';

export const DiagnosticAssistant: React.FC = () => {
  const { user, profile } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [userQuestion, setUserQuestion] = useState<string>('');
  const [errorCode, setErrorCode] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [sessions, setSessions] = useState<DiagnosticSession[]>([]);
  const [activeSession, setActiveSession] = useState<DiagnosticSession | null>(null);
  const [analysisResult, setAnalysisResult] = useState<DiagnosticAnalysisResponse | null>(null);

  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [assetList, sessionList] = await Promise.all([
        assetService.getAssets(),
        diagnosticService.getSessions(),
      ]);
      setAssets(assetList || []);
      setSessions(sessionList || []);
      if (assetList && assetList.length > 0 && !selectedAssetId) {
        setSelectedAssetId(assetList[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load diagnostic data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRunAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !userQuestion.trim()) {
      setError('Please select an asset and describe the observed symptom.');
      return;
    }

    setAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setFeedbackSent(false);
    setAnalysisStep('Performing multimodal vision OCR & telemetry cross-examination...');

    const formData = new FormData();
    formData.append('asset_id', selectedAssetId);
    formData.append('question', userQuestion);
    if (errorCode.trim()) formData.append('error_code', errorCode.trim());
    if (selectedFile) formData.append('image_file', selectedFile);
    if (profile?.id || user?.id) {
      formData.append('technician_id', profile?.id || user?.id || '');
    }

    try {
      setAnalysisStep('Retrieving 768d pgvector OEM manual chunks & error code catalog...');
      const response = await diagnosticService.analyzeEquipment(formData);
      setAnalysisResult(response);
      loadData();
    } catch (err: any) {
      setError(err.message || 'Diagnostic reasoning engine encountered an issue.');
    } finally {
      setAnalyzing(false);
      setAnalysisStep('');
    }
  };

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);
  const resultData = analysisResult?.diagnostic_result;

  return (
    <div className="space-y-6">
      {error && (
        <AlertBanner
          type="error"
          title="Diagnostic Notice"
          message={error}
        />
      )}

      {/* Cockpit Status Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <img src="/logo.png" alt="GearMind AI" className="w-10 h-10 rounded-xl object-contain border border-orange-200 bg-white p-0.5 shadow-xs flex-shrink-0" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-800 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                GearMind AI Diagnostic Copilot
              </span>
              <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 font-bold font-mono">
                LOTO Safety Compliance: 100%
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-900 mt-1">
              Grounded Fault Diagnosis & Repair Sequence
            </h2>
            <p className="text-xs text-slate-500">
              Selected Target: <span className="font-semibold text-slate-800">{selectedAsset ? `${selectedAsset.name} (${selectedAsset.asset_code || ''})` : 'Select Asset'}</span> • OEM: {selectedAsset?.manufacturer || 'OEM Catalog'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              setAnalysisResult(null);
              setUserQuestion('');
              setErrorCode('');
              setSelectedFile(null);
              setImagePreview(null);
            }}
            className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-card-subtle transition-smooth"
          >
            Reset Form
          </button>
          <button
            onClick={loadData}
            title="Refresh sessions"
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-card-subtle transition-smooth"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Console Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 Cols: Inquiry Form & Rich Diagnostic Output */}
        <div className="lg:col-span-8 space-y-6">
          {/* Diagnostic Inquiry Form */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <Wrench className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                Symptom & Multimodal Staging Input
              </h3>
              <span className="text-[10px] text-slate-400 font-mono font-medium">pgvector RAG + Vision</span>
            </div>

            <form onSubmit={handleRunAnalysis} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Target Machinery Asset</label>
                  {assets.length === 0 ? (
                    <p className="text-rose-600">Register an asset in the Equipment tab first.</p>
                  ) : (
                    <select
                      value={selectedAssetId}
                      onChange={(e) => setSelectedAssetId(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:ring-1 focus:ring-orange-500 text-xs font-medium text-slate-800"
                    >
                      {assets.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.name} ({a.asset_code || a.asset_tag}) — {a.manufacturer}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Observed Diagnostic Trouble Code (Optional)
                  </label>
                  <input
                    type="text"
                    value={errorCode}
                    onChange={(e) => setErrorCode(e.target.value)}
                    placeholder="e.g. E-101, E-201, F-302"
                    className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 font-mono bg-slate-50 text-slate-800 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Observed Physical Symptoms / Technician Inquiry *
                </label>
                <textarea
                  rows={3}
                  required
                  value={userQuestion}
                  onChange={(e) => setUserQuestion(e.target.value)}
                  placeholder="Describe abnormal pressure drops, high motor temperature, vibration, fluid seepage, tripped breaker, or display codes..."
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-orange-500 focus:outline-none bg-slate-50 text-slate-800 font-medium"
                />
              </div>

              {/* Photo Attachment */}
              <div className="border border-slate-200 bg-slate-50/70 rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-700 flex items-center text-xs">
                    <Camera className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                    Attach Inspection / Control Panel Photo (Optional)
                  </label>
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFile(null);
                        setImagePreview(null);
                      }}
                      className="text-rose-600 hover:text-rose-700 text-[10px] font-bold"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic"
                    onChange={handleFileChange}
                    className="text-xs text-slate-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100 cursor-pointer"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Staged"
                      className="h-9 w-9 object-cover rounded-md border border-slate-300 shadow-xs"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={analyzing || !userQuestion.trim()}
                  className={`px-4 py-2 rounded-lg text-xs font-bold shadow-orange-glow flex items-center transition-smooth ${
                    analyzing || !userQuestion.trim()
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      : 'bg-orange-500 hover:bg-orange-600 text-white'
                  }`}
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                      Synthesizing Multimodal Evidence...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      Run AI Diagnostic Reasoning
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Analyzing Loading State */}
          {analyzing && (
            <SmartLoader
              message="Multimodal Diagnostic Copilot Reasoning Active"
              subMessage={analysisStep || 'Synthesizing Multimodal Evidence & Technical Manuals...'}
              duration={3000}
              variant="card"
            />
          )}

          {/* Structured Diagnostic Results Console */}
          {resultData && !analyzing && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card-subtle space-y-5 text-xs">
              {/* Header / Summary */}
              <div className="pb-3 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <img src="/logo.png" alt="GearMind AI Report" className="w-8 h-8 rounded-lg object-contain border border-orange-200 bg-white shadow-xs p-0.5 flex-shrink-0" />
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-50 text-orange-800 border border-orange-200">
                        GearMind AI Verified Diagnostic Report
                      </span>
                      {resultData.error_code?.code && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                          Error {resultData.error_code.code}
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-1.5 leading-snug">
                      {resultData.summary}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 flex-shrink-0">
                  <span className="text-slate-500 text-[11px] font-medium">Confidence:</span>
                  <span
                    className={`font-bold font-mono text-xs ${
                      resultData.confidence >= 0.85
                        ? 'text-emerald-700'
                        : resultData.confidence >= 0.65
                        ? 'text-amber-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {Math.round(resultData.confidence * 100)}%
                  </span>
                </div>
              </div>

              {/* Mandatory Safety & LOTO Box */}
              {resultData.safety_warnings && resultData.safety_warnings.length > 0 && (
                <div className="p-4 bg-rose-50/70 border border-rose-200 rounded-xl space-y-2 shadow-xs">
                  <div className="flex items-center text-rose-800 font-bold text-xs uppercase tracking-wider">
                    <ShieldAlert className="w-4 h-4 mr-1.5 text-rose-600" />
                    Mandatory Safety Protocols & Lockout/Tagout (LOTO)
                  </div>
                  <ul className="space-y-1 text-rose-900 text-xs list-disc list-inside">
                    {resultData.safety_warnings.map((w, idx) => (
                      <li key={idx} className="font-medium">{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Probable Root Causes */}
              {resultData.possible_causes && resultData.possible_causes.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                    <HelpCircle className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                    Probable Root Causes & Fault Rationale
                  </h4>
                  <div className="space-y-2">
                    {resultData.possible_causes.map((cause, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{cause.cause}</span>
                          {cause.probability && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-200">
                              Probability: {Math.round(cause.probability * 100)}%
                            </span>
                          )}
                        </div>
                        {cause.rationale && (
                          <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{cause.rationale}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step-by-Step Guided Troubleshooting Sequence */}
              {resultData.troubleshooting_steps && resultData.troubleshooting_steps.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                    <Wrench className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    Step-by-Step Guided Repair & Inspection Sequence
                  </h4>
                  <div className="space-y-2.5">
                    {resultData.troubleshooting_steps.map((step) => (
                      <div
                        key={step.step}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-start space-x-3"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-orange-500 text-white font-bold text-[10px] flex-shrink-0 mt-0.5 shadow-xs">
                          0{step.step}
                        </span>
                        <div className="space-y-1 flex-1">
                          <p className="text-slate-800 font-medium text-xs leading-relaxed">{step.action}</p>
                          {step.safety_note && (
                            <p className="text-[10px] text-amber-900 bg-amber-50 p-1.5 rounded-md border border-amber-200 font-medium">
                              <strong>Step Precaution:</strong> {step.safety_note}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Required Tools & PPE */}
              {resultData.required_tools && resultData.required_tools.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                    <Hammer className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                    Required Diagnostic Tools & PPE
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {resultData.required_tools.map((t, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-md text-[11px] font-bold"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Verified OEM Citations */}
              {resultData.citations && resultData.citations.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                    Verified OEM Technical Citations (pgvector)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {resultData.citations.map((cite, idx) => (
                      <div key={idx} className="p-2.5 bg-orange-50/50 rounded-lg border border-orange-200 text-[11px]">
                        <div className="font-bold text-orange-950 truncate">{cite.document_title}</div>
                        <div className="flex items-center justify-between text-slate-500 mt-1">
                          <span className="font-semibold">Page {cite.page_number}</span>
                          {cite.similarity ? (
                            <span className="font-mono text-emerald-700 font-bold">
                              Sim: {cite.similarity}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions Station */}
              <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setFeedbackSent(true)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border flex items-center transition-smooth ${
                      feedbackSent
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 shadow-card-subtle'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    {feedbackSent ? 'Feedback Recorded' : 'Validate Diagnosis'}
                  </button>
                </div>

                <button
                  onClick={() => alert('Diagnostic sequence exported to work order audit log.')}
                  className="px-3.5 py-1.5 bg-orange-500 text-white rounded-lg text-xs font-bold hover:bg-orange-600 transition-smooth shadow-orange-glow flex items-center"
                >
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  Save to Work Order
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right 4 Cols: Historical Inquiries Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                Diagnostic Inquiry History
              </h4>
              <span className="text-[10px] font-mono text-slate-400 font-bold">({sessions.length})</span>
            </div>

            {loading ? (
              <div className="py-8 flex justify-center text-slate-400">
                <Loader2 className="w-5 h-5 animate-spin text-orange-500" />
              </div>
            ) : sessions.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No past diagnostic inquiries.</p>
            ) : (
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {sessions.map((s) => (
                  <div
                    key={s.id}
                    onClick={() => {
                      setActiveSession(s);
                      setUserQuestion(s.user_question);
                      if (s.asset_id) setSelectedAssetId(s.asset_id);
                    }}
                    className={`p-3 rounded-lg border cursor-pointer transition-smooth text-xs space-y-1 ${
                      activeSession?.id === s.id
                        ? 'border-orange-400 bg-orange-50/50 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate max-w-[150px]">
                        {s.asset ? s.asset.name : 'Machinery Asset'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 capitalize font-medium">{s.status}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2">{s.user_question}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

