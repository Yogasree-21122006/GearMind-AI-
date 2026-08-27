import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileText,
  Clock,
  Search,
  Trash2,
  Loader2,
  Plus,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Database
} from 'lucide-react';
import { manualService } from '../services/manualService';
import { Manual } from '../types';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { AlertBanner } from '../components/AlertBanner';

export const ManualLibrary: React.FC = () => {
  const [manuals, setManuals] = useState<Manual[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Form State
  const [docTitle, setDocTitle] = useState('');
  const [docMfg, setDocMfg] = useState('');
  const [docType, setDocType] = useState('oem_manual');
  const [equipmentType, setEquipmentType] = useState('Chiller');
  const [model, setModel] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const loadManuals = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await manualService.getManuals();
      setManuals(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to load manuals from database.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadManuals();
  }, []);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Please select a PDF or DOCX file.');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('title', docTitle);
    formData.append('manufacturer', docMfg);
    formData.append('equipment_type', equipmentType);
    if (model) formData.append('model', model);
    formData.append('document_type', docType);

    try {
      await manualService.uploadManual(formData);
      setIsModalOpen(false);
      // Reset form
      setDocTitle('');
      setDocMfg('');
      setModel('');
      setSelectedFile(null);
      loadManuals();
    } catch (err: any) {
      alert(`Error uploading document: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string, title?: string) => {
    const displayTitle = title || 'this manual';
    if (!confirm(`Delete manual "${displayTitle}" and purge its vector embeddings?`)) return;
    try {
      await manualService.deleteManual(id);
      loadManuals();
    } catch (err: any) {
      alert(`Error deleting manual: ${err.message}`);
    }
  };

  const renderStatusBadge = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'completed' || s === 'indexed') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
          768d Vector Indexed
        </span>
      );
    }
    if (s === 'processing') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          <Loader2 className="w-3 h-3 mr-1 animate-spin text-amber-600" />
          Embedding Chunks...
        </span>
      );
    }
    if (s === 'failed') {
      return (
        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertTriangle className="w-3 h-3 mr-1 text-rose-600" />
          Ingestion Failed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
        <Clock className="w-3 h-3 mr-1 text-slate-500" />
        Uploaded
      </span>
    );
  };

  const filteredManuals = manuals.filter(
    (m) =>
      (m.title || m.document_title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.equipment_type || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {error && (
        <AlertBanner
          type="error"
          title="Knowledge Hub Query Notice"
          message={error}
        />
      )}

      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-card-subtle">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search manuals, SOPs, OEM schematics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-72 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-smooth font-medium"
            />
          </div>

          <div className="hidden md:flex items-center space-x-1.5 text-[11px] text-slate-600 font-bold font-mono">
            <Database className="w-3.5 h-3.5 text-orange-500" />
            <span>Supabase pgvector Knowledge Base</span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={loadManuals}
            title="Refresh manuals and RAG indexing statuses"
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-card-subtle transition-smooth"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-smooth shadow-orange-glow"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Upload Document
          </button>
        </div>
      </div>

      {/* Manuals List */}
      {loading ? (
        <div className="py-16 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-xs text-slate-400 shadow-card-subtle">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-orange-500" />
          Loading technical documents from database...
        </div>
      ) : filteredManuals.length === 0 ? (
        <EmptyState
          title="No technical manuals uploaded yet"
          description="Upload OEM manuals, electrical schematics, and SOPs to enable 768d vector retrieval."
          icon={<BookOpen className="w-6 h-6" />}
          actionText="Upload Document"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredManuals.map((manual) => (
            <div
              key={manual.id}
              className="bg-white border border-slate-200 rounded-xl p-4 shadow-card-subtle hover:border-orange-300 hover:shadow-card-hover transition-smooth flex flex-col justify-between space-y-3.5"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="p-1.5 bg-orange-50 text-orange-600 rounded-lg border border-orange-200">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                      {manual.document_type.replace('_', ' ')}
                    </span>
                    <button
                      onClick={() => handleDelete(manual.id, manual.title || manual.document_title)}
                      className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                      title="Delete manual"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                  {manual.title || manual.document_title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 font-medium">
                  {manual.manufacturer}{' '}
                  {manual.model || manual.model_series ? `• ${manual.model || manual.model_series}` : ''}
                </p>

                <div className="mt-3 flex items-center space-x-2 text-[11px]">
                  {renderStatusBadge(manual.processing_status)}
                  {manual.page_count > 0 && (
                    <span className="text-slate-500 font-mono text-[10px] font-medium">
                      • {manual.page_count} pages
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span className="truncate max-w-[170px]">{manual.file_name}</span>
                <span>{new Date(manual.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Manual Upload Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Upload OEM Technical Document"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleUpload} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Document Title</label>
            <input
              required
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:ring-1 focus:ring-orange-500 focus:outline-none text-slate-800 font-medium"
              placeholder="e.g. FlowServe Mark 3 Operation & Maintenance Manual"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Manufacturer (OEM)</label>
              <input
                required
                type="text"
                value={docMfg}
                onChange={(e) => setDocMfg(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:ring-1 focus:ring-orange-500 focus:outline-none text-slate-800 font-medium"
                placeholder="e.g. FlowServe, Siemens"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Model / Series (Optional)</label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 focus:ring-1 focus:ring-orange-500 focus:outline-none text-slate-800 font-medium"
                placeholder="e.g. Mark 3 ANSI"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Equipment Category</label>
              <select
                value={equipmentType}
                onChange={(e) => setEquipmentType(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 text-slate-800 focus:ring-1 focus:ring-orange-500 focus:outline-none font-medium"
              >
                <option value="Chiller">Chiller / HVAC</option>
                <option value="Pump">Hydraulic / Centrifugal Pump</option>
                <option value="Generator">Diesel Generator</option>
                <option value="Motor">Electric Motor</option>
                <option value="Compressor">Air Compressor</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Document Classification</label>
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-2 bg-slate-50 text-slate-800 focus:ring-1 focus:ring-orange-500 focus:outline-none font-medium"
              >
                <option value="oem_manual">OEM Service Manual</option>
                <option value="schematic">Electrical & Wiring Schematic</option>
                <option value="sop">Standard Operating Procedure (SOP)</option>
                <option value="troubleshooting_guide">Troubleshooting Guide</option>
              </select>
            </div>
          </div>

          {/* File input dropzone */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Upload PDF / DOCX File</label>
            <div className="border border-dashed border-slate-300 hover:border-orange-500 rounded-xl p-4 text-center cursor-pointer transition-smooth bg-slate-50/70">
              <input
                required
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setSelectedFile(e.target.files[0]);
                  }
                }}
                className="hidden"
                id="modal-doc-file-input"
              />
              <label htmlFor="modal-doc-file-input" className="cursor-pointer block">
                <Upload className="w-6 h-6 mx-auto text-slate-400 mb-1" />
                <span className="font-bold text-orange-600 hover:text-orange-700">
                  {selectedFile ? selectedFile.name : 'Select file from computer'}
                </span>
                <p className="text-[10px] text-slate-400 mt-0.5">PDF / DOCX up to 50MB</p>
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-1.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold flex items-center shadow-orange-glow"
            >
              {uploading && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Upload & Ingest Chunks
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
