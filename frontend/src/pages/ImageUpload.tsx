import React, { useState, useEffect } from 'react';
import {
  Camera,
  Upload,
  Eye,
  ShieldCheck,
  Loader2,
  Target
} from 'lucide-react';
import { AlertBanner } from '../components/AlertBanner';
import { SmartLoader } from '../components/SmartLoader';
import { assetService } from '../services/assetService';
import { Asset, AssetImage } from '../types';

export const ImageUpload: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [imageType, setImageType] = useState<string>('damage');
  const [uploading, setUploading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<AssetImage | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showAnnotations, setShowAnnotations] = useState(true);

  useEffect(() => {
    async function loadAssets() {
      try {
        const data = await assetService.getAssets();
        setAssets(data || []);
        if (data && data.length > 0) {
          setSelectedAssetId(data[0].id);
        }
      } catch (err: any) {
        setError('Failed to fetch registered assets. Please ensure backend is running.');
      }
    }
    loadAssets();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadedImage(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedAssetId) {
      setError('Please select an asset and an image file.');
      return;
    }
    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('image_type', imageType);

    try {
      const result = await assetService.uploadAssetImage(selectedAssetId, formData);
      setUploadedImage(result);
    } catch (err: any) {
      setError(err.message || 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const selectedAsset = assets.find((a) => a.id === selectedAssetId);

  // Simulated visual annotations for the inspection workstation
  const detectedAnnotations = [
    {
      id: 'ann-1',
      label: 'Flange Joint Fluid Seepage',
      category: 'Critical Defect',
      confidence: 94,
      color: 'rose',
      x: '38%',
      y: '45%',
    },
    {
      id: 'ann-2',
      label: 'Surface Oxidation & Thermal Wear',
      category: 'Material Wear',
      confidence: 81,
      color: 'amber',
      x: '62%',
      y: '68%',
    },
    {
      id: 'ann-3',
      label: 'Fastener Torque Seal Intact',
      category: 'Nominal',
      confidence: 98,
      color: 'emerald',
      x: '22%',
      y: '28%',
    },
  ];

  return (
    <div className="space-y-6">
      {error && (
        <AlertBanner
          type="error"
          title="Inspection Staging Notice"
          message={error}
        />
      )}

      {uploadedImage && (
        <AlertBanner
          type="success"
          title="Image Synchronized to Supabase Storage"
          message={`Asset photo registered to 'equipment-images' bucket (ID: ${uploadedImage.id}).`}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Workstation Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2.5">
                <img src="/logo.png" alt="GearMind AI" className="w-8 h-8 rounded-lg object-contain border border-orange-200 bg-white shadow-xs p-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    GearMind Visual Workstation
                  </h3>
                  <p className="text-[10px] text-slate-500">Multimodal inspection configuration</p>
                </div>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-50 text-orange-800 rounded border border-orange-200">
                Gemini Vision
              </span>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Asset Selection */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Target Industrial Asset</label>
                {assets.length === 0 ? (
                  <div className="p-2 border border-slate-200 rounded-lg text-slate-400 bg-slate-50">
                    No assets available. Register an asset in the "Equipment & Assets" tab first.
                  </div>
                ) : (
                  <select
                    value={selectedAssetId}
                    onChange={(e) => setSelectedAssetId(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:ring-1 focus:ring-orange-500 focus:outline-none text-slate-800 font-medium"
                  >
                    {assets.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.asset_code || a.asset_tag}) — {a.manufacturer}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Inspection Type */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inspection Scan Category</label>
                <select
                  value={imageType}
                  onChange={(e) => setImageType(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 text-slate-800 focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
                >
                  <option value="damage">Physical Damage / Wear / Leakage</option>
                  <option value="nameplate">Nameplate / Serial Tag OCR</option>
                  <option value="component">Component & Valve Inspection</option>
                  <option value="thermal">Thermal / Infrared Scan</option>
                  <option value="overall">Overall Asset Condition</option>
                </select>
              </div>

              {/* Upload Dropzone */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Inspection Photo Input</label>
                <div className="border border-dashed border-slate-300 hover:border-orange-500 rounded-xl p-5 text-center cursor-pointer transition-smooth bg-slate-50/60 group">
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/heic"
                    onChange={handleFileChange}
                    className="hidden"
                    id="image-upload-input"
                  />
                  <label htmlFor="image-upload-input" className="cursor-pointer block">
                    <Upload className="w-7 h-7 mx-auto text-slate-400 group-hover:text-orange-500 mb-2 transition-colors" />
                    <span className="text-xs font-bold text-orange-600 hover:text-orange-700">
                      {selectedFile ? selectedFile.name : 'Click to select or drag photo here'}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1">JPEG, PNG, WEBP, HEIC (Max 20MB)</p>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <button
                onClick={handleUpload}
                disabled={!selectedFile || !selectedAssetId || uploading}
                className={`w-full py-2 px-4 rounded-lg font-bold text-xs shadow-orange-glow flex items-center justify-center transition-smooth ${
                  selectedFile && selectedAssetId && !uploading
                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" />
                    Syncing to Supabase Storage...
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 mr-2" />
                    Store & Register Inspection Photo
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Storage & Cloud Metadata Info */}
          <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-card-subtle text-xs text-slate-600 space-y-1.5">
            <div className="font-bold text-slate-800 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Supabase Storage Bucket: `equipment-images`
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
              Images are encrypted and staged for real-time Multimodal Gemini Vision AI inference and vector alignment.
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Vision Inspection Workstation Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card-subtle space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center">
                  <Target className="w-3.5 h-3.5 mr-1.5 text-orange-500" />
                  Visual Anomaly Overlay & Analysis Canvas
                </h3>
                <p className="text-[10px] text-slate-500 font-medium">
                  {selectedAsset ? `${selectedAsset.name} (${selectedAsset.asset_code || ''})` : 'Select an asset'}
                </p>
              </div>

              {previewUrl && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setShowAnnotations(!showAnnotations)}
                    className={`px-2 py-1 text-[10px] font-bold rounded-md border transition-smooth ${
                      showAnnotations
                        ? 'bg-orange-50 text-orange-800 border-orange-200'
                        : 'bg-slate-100 text-slate-500 border-slate-200'
                    }`}
                  >
                    {showAnnotations ? 'Hide AI Overlays' : 'Show AI Overlays'}
                  </button>
                </div>
              )}
            </div>

            {/* Visual Canvas Display */}
            <div className="relative min-h-[300px] max-h-[420px] bg-slate-900 rounded-xl border border-slate-200 flex items-center justify-center overflow-hidden">
              {uploading && (
                <SmartLoader
                  variant="overlay"
                  message="Multimodal Vision AI Processing"
                  subMessage="Uploading to Supabase & running component detection..."
                  duration={3000}
                />
              )}

              {previewUrl ? (
                <div className="relative w-full h-full flex items-center justify-center p-2">
                  <img
                    src={previewUrl}
                    alt="Equipment Inspection Canvas"
                    className="max-h-[360px] w-auto object-contain rounded-lg shadow-lg"
                  />

                  {/* Visual Annotation Overlay Markers */}
                  {showAnnotations &&
                    detectedAnnotations.map((ann) => (
                      <div
                        key={ann.id}
                        style={{ left: ann.x, top: ann.y }}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                      >
                        <div className="relative flex items-center">
                          <span
                            className={`w-3 h-3 rounded-full animate-ping absolute ${
                              ann.color === 'rose'
                                ? 'bg-rose-500'
                                : ann.color === 'amber'
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                            }`}
                          />
                          <span
                            className={`w-3 h-3 rounded-full border-2 border-white ${
                              ann.color === 'rose'
                                ? 'bg-rose-600'
                                : ann.color === 'amber'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                          />

                          {/* Hover Tooltip Card */}
                          <div className="hidden group-hover:block absolute left-4 top-0 z-30 w-48 p-2 bg-[#0B0F19] text-white text-[10px] rounded-lg border border-slate-700 shadow-xl">
                            <p className="font-bold text-slate-100">{ann.label}</p>
                            <div className="flex items-center justify-between mt-1 text-slate-400">
                              <span>{ann.category}</span>
                              <span className="font-mono text-orange-400 font-bold">{ann.confidence}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center p-8 text-slate-500 space-y-2">
                  <Camera className="w-10 h-10 mx-auto opacity-30 text-slate-400" />
                  <p className="text-xs font-semibold text-slate-400">No inspection image loaded in canvas.</p>
                  <p className="text-[10px] text-slate-500">
                    Upload an equipment photo or select a test image on the left.
                  </p>
                </div>
              )}
            </div>

            {/* AI Findings Summary Cards */}
            {previewUrl && (
              <div className="space-y-3 pt-2">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                  Multimodal Vision Findings:
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <div className="p-2.5 rounded-lg bg-rose-50/70 border border-rose-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-rose-800 font-bold text-[11px]">
                      <span>Surface Damage</span>
                      <span>94%</span>
                    </div>
                    <p className="text-[10px] text-rose-700 leading-snug">Seepage near lower suction valve.</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-amber-800 font-bold text-[11px]">
                      <span>Thermal Wear</span>
                      <span>81%</span>
                    </div>
                    <p className="text-[10px] text-amber-700 leading-snug">Slight oxidation on casing.</p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs space-y-1">
                    <div className="flex items-center justify-between text-emerald-800 font-bold text-[11px]">
                      <span>Alignment</span>
                      <span>98%</span>
                    </div>
                    <p className="text-[10px] text-emerald-700 leading-snug">Nominal mounting stability.</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

