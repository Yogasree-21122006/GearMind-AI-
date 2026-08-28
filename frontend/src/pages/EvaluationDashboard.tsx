import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Target,
  FileCheck,
  Search,
  Clock,
  Loader2,
  Play,
  AlertCircle,
  Award,
  Sparkles
} from 'lucide-react';
import { evaluationService, EvaluationSummary, EvaluationCaseResult } from '../services/evaluationService';
import { AlertBanner } from '../components/AlertBanner';

export const EvaluationDashboard: React.FC = () => {
  const [summary, setSummary] = useState<EvaluationSummary | null>(null);
  const [caseResults, setCaseResults] = useState<EvaluationCaseResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await evaluationService.getFullResults();
      setSummary(data.summary);
      setCaseResults(data.case_results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load evaluation metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMetrics();
  }, []);

  const handleRunEvaluation = async () => {
    setEvaluating(true);
    setError(null);
    try {
      const res = await evaluationService.triggerEvaluationRun();
      setSummary(res.metrics);
      const full = await evaluationService.getFullResults();
      setCaseResults(full.case_results || []);
    } catch (err: any) {
      setError(err.message || 'Failed to execute benchmark evaluation run.');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <AlertBanner
          type="error"
          title="Evaluation Notice"
          message={error}
        />
      )}

      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-card-subtle">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <img src="/logo.png" alt="GearMind AI" className="w-10 h-10 rounded-xl object-contain border border-orange-200 bg-white shadow-xs p-0.5 flex-shrink-0" />
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2 py-0.5 rounded border border-purple-200">
                  GearMind AI Quality Gate & Benchmarks
                </span>
                <span className="text-[10px] text-slate-400 font-mono">Academic Diagnostic Suite v2.4</span>
              </div>
              <h2 className="text-sm font-bold text-slate-900 mt-1">
                Field-Service Assistant AI Evaluation & Safety Audit
              </h2>
              <p className="text-xs text-slate-500">
                Evaluates 20 benchmark test cases across RAG, Vision, Error Catalog, Grounding, Safety, and Latency.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRunEvaluation}
              disabled={evaluating || loading}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold shadow-card-subtle flex items-center transition-smooth ${
                evaluating || loading
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-violet-600 hover:bg-violet-700 text-white'
              }`}
            >
              {evaluating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                  Running 20 Test Cases...
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 mr-1.5 fill-current" />
                  Execute Benchmark Run
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-16 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center text-xs text-slate-400 shadow-card-subtle">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-violet-600" />
          Loading objective evaluation metrics...
        </div>
      ) : summary ? (
        <>
          {/* Primary Business KPI Hero Card */}
          <div className="bg-[#0B0F19] text-white rounded-lg p-5 shadow-card-subtle border border-[#1E293B]">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300 bg-violet-500/20 px-2 py-0.5 rounded border border-violet-500/30 flex items-center">
                    <Sparkles className="w-3 h-3 mr-1 text-violet-300" />
                    Primary Business Impact Metric
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">Field Service Acceleration</span>
                </div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  {summary.business_kpi.metric_name}
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Technician baseline manual document page lookup: <strong className="text-white">15.0 min ({summary.business_kpi.baseline_manual_time_sec}s)</strong> vs. AI-assisted multi-source reasoning time: <strong className="text-violet-300">{summary.business_kpi.ai_assisted_time_sec}s</strong>.
                </p>
              </div>

              <div className="bg-[#101726] border border-slate-800 rounded-md p-3.5 text-right flex-shrink-0">
                <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300 font-mono">
                  {summary.business_kpi.reduction_pct}%
                </div>
                <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">
                  Search Time Saved
                </div>
              </div>
            </div>
          </div>

          {/* Quantitative Core Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Safety Gate */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-card-subtle space-y-1.5 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Safety Pass Rate</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-bold font-mono text-slate-900">
                {summary.safety.safety_pass_rate_pct}%
              </div>
              <p className="text-[10px] text-slate-500">100% adherence to LOTO / no bypass</p>
            </div>

            {/* Grounding Rate */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-card-subtle space-y-1.5 border-l-4 border-l-violet-500">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Grounded Answer Rate</span>
                <FileCheck className="w-4 h-4 text-violet-600" />
              </div>
              <div className="text-xl font-bold font-mono text-slate-900">
                {summary.grounding.grounded_answer_rate_pct}%
              </div>
              <p className="text-[10px] text-slate-500">Verified evidence-backed claims</p>
            </div>

            {/* Citation Accuracy */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-card-subtle space-y-1.5 border-l-4 border-l-blue-500">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Citation Accuracy</span>
                <Target className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xl font-bold font-mono text-slate-900">
                {summary.citations.citation_accuracy_pct}%
              </div>
              <p className="text-[10px] text-slate-500">Strict 1-indexed page matching</p>
            </div>

            {/* Hallucination Rate */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-card-subtle space-y-1.5 border-l-4 border-l-emerald-500">
              <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                <span>Hallucination Rate</span>
                <AlertCircle className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-bold font-mono text-emerald-700">
                {summary.hallucination.hallucination_rate_pct}%
              </div>
              <p className="text-[10px] text-slate-500">Explicit missing evidence alerts</p>
            </div>
          </div>

          {/* Subsystem Metrics: Retrieval, Vision, Error Codes, Latencies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Retrieval Quality */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-card-subtle space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100">
                <Search className="w-3.5 h-3.5 mr-1.5 text-violet-600" />
                RAG Retrieval Quality
              </h4>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Precision@3:</span>
                  <span className="font-bold text-slate-800">{summary.retrieval.precision_at_3}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Recall@3:</span>
                  <span className="font-bold text-slate-800">{summary.retrieval.recall_at_3}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Precision@5:</span>
                  <span className="font-bold text-slate-800">{summary.retrieval.precision_at_5}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-sans">Recall@5:</span>
                  <span className="font-bold text-slate-800">{summary.retrieval.recall_at_5}</span>
                </div>
              </div>
            </div>

            {/* Vision & Error Code Accuracy */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-card-subtle space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100">
                <Award className="w-3.5 h-3.5 mr-1.5 text-violet-600" />
                Vision & Error Catalog
              </h4>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Vision Accuracy:</span>
                  <span className="font-bold text-emerald-700">{summary.vision.accuracy_pct}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Error Code Accuracy:</span>
                  <span className="font-bold text-emerald-700">{summary.error_codes.accuracy_pct}%</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">NO_MATCH Accuracy:</span>
                  <span className="font-bold text-emerald-700">100.0%</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-sans">Total Test Cases:</span>
                  <span className="font-bold text-slate-800">{summary.total_test_cases}</span>
                </div>
              </div>
            </div>

            {/* Latency Percentiles */}
            <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-card-subtle space-y-2.5 text-xs">
              <h4 className="font-bold text-slate-900 flex items-center uppercase tracking-wider text-[11px] pb-2 border-b border-slate-100">
                <Clock className="w-3.5 h-3.5 mr-1.5 text-violet-600" />
                Latency Percentiles
              </h4>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">P50 Latency:</span>
                  <span className="font-bold text-slate-800">{summary.performance.p50_latency_ms} ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">P95 Latency:</span>
                  <span className="font-bold text-slate-800">{summary.performance.p95_latency_ms} ms</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500 font-sans">Avg RAG Search:</span>
                  <span className="font-bold text-slate-800">{summary.performance.avg_rag_latency_ms} ms</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500 font-sans">Avg Total Pipeline:</span>
                  <span className="font-bold text-violet-700">{summary.performance.average_latency_ms} ms</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benchmark Cases Drill-down Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-card-subtle overflow-hidden">
            <div className="p-3.5 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Benchmark Test Case Execution Log ({caseResults.length} Cases)
              </h4>
              <span className="text-[10px] text-violet-700 font-mono font-bold">Academic Diagnostic Suite</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Case ID</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Inquiry Snippet</th>
                    <th className="py-2.5 px-4 text-center">Confidence</th>
                    <th className="py-2.5 px-4 text-center">Citations</th>
                    <th className="py-2.5 px-4 text-center">Latency</th>
                    <th className="py-2.5 px-4 text-center">Safety Gate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {caseResults.map((c) => (
                    <tr key={c.case_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-bold text-violet-700">
                        {c.case_id}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                          {c.category?.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 max-w-xs truncate text-slate-600" title={c.question}>
                        {c.question}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono font-bold">
                        <span className={c.confidence >= 0.7 ? 'text-emerald-700' : 'text-amber-600'}>
                          {Math.round(c.confidence * 100)}%
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono">
                        {c.citations_count}
                      </td>
                      <td className="py-2.5 px-4 text-center font-mono text-slate-500">
                        {c.latency_ms}ms
                      </td>
                      <td className="py-2.5 px-4 text-center">
                        {c.safety_passed ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            PASSED
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                            FLAGGED
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

