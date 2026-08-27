import React, { useState, useEffect } from 'react';
import {
  History,
  Calendar,
  Clock,
  Plus,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { AlertBanner } from '../components/AlertBanner';
import { maintenanceService, MaintenanceRecord } from '../services/maintenanceService';
import { assetService } from '../services/assetService';
import { Asset } from '../types';

export const MaintenanceHistory: React.FC = () => {
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [maintType, setMaintType] = useState<'preventive' | 'corrective' | 'emergency' | 'inspection' | 'calibration'>('preventive');
  const [issue, setIssue] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [downtime, setDowntime] = useState(0);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recList, assetList] = await Promise.all([
        maintenanceService.getAllRecords(),
        assetService.getAssets(),
      ]);
      setRecords(recList || []);
      setAssets(assetList || []);
      if (assetList && assetList.length > 0 && !selectedAssetId) {
        setSelectedAssetId(assetList[0].id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve maintenance history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetId || !actionTaken) {
      alert('Please select an asset and specify the action taken.');
      return;
    }

    setSubmitting(true);
    try {
      await maintenanceService.logRecord(selectedAssetId, {
        maintenance_type: maintType,
        issue_description: issue,
        diagnosis: diagnosis,
        action_taken: actionTaken,
        downtime_minutes: Number(downtime) || 0,
        maintenance_date: new Date().toISOString(),
      });
      setIsModalOpen(false);
      setIssue('');
      setDiagnosis('');
      setActionTaken('');
      setDowntime(0);
      loadData();
    } catch (err: any) {
      alert(`Error creating maintenance record: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {error && (
        <AlertBanner
          type="error"
          title="Maintenance Log Notice"
          message={error}
        />
      )}

      {/* Header Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-card-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center">
            <History className="w-3.5 h-3.5 mr-1.5 text-violet-600" />
            Field Maintenance Work Orders & Service Trail
          </h2>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Documented corrective, preventive, and emergency servicing activities across machinery fleet
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadData}
            title="Refresh history"
            className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-600 shadow-card-subtle transition-smooth"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-violet-600 hover:bg-violet-700 text-white rounded-md text-xs font-bold shadow-card-subtle flex items-center transition-smooth"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Log Work Order
          </button>
        </div>
      </div>

      {loading ? (
        <div className="py-16 bg-white border border-slate-200 rounded-lg flex flex-col items-center justify-center text-xs text-slate-400 shadow-card-subtle">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-violet-600" />
          Loading maintenance records...
        </div>
      ) : records.length === 0 ? (
        <EmptyState
          title="No maintenance records found"
          description="Document service events, corrective repairs, and component replacements to maintain a reliable audit history."
          icon={<History className="w-6 h-6" />}
          actionText="Log Service Action"
          onAction={() => setIsModalOpen(true)}
        />
      ) : (
        <div className="space-y-3">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="bg-white border border-slate-200 rounded-lg p-4 shadow-card-subtle hover:shadow-card-hover transition-smooth space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-slate-100 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                    WO-{rec.id.slice(0, 8).toUpperCase()}
                  </span>
                  <h3 className="text-xs font-bold text-slate-900">
                    {rec.asset ? `${rec.asset.name} (${rec.asset.asset_code})` : `Asset ${rec.asset_id.slice(0, 8)}`}
                  </h3>
                </div>
                <div className="flex items-center space-x-3 text-[11px]">
                  <span className="text-slate-500 flex items-center">
                    <Calendar className="w-3 h-3 mr-1 text-slate-400" />
                    {rec.maintenance_date ? new Date(rec.maintenance_date).toLocaleDateString() : 'N/A'}
                  </span>
                  <span className="text-slate-500 flex items-center">
                    <Clock className="w-3 h-3 mr-1 text-slate-400" />
                    {rec.downtime_minutes} mins downtime
                  </span>
                  <StatusBadge status={rec.maintenance_type} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Observed Symptoms & Fault:
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">
                    {rec.issue_description || 'Routine scheduled inspection / calibration.'}
                  </p>
                  {rec.diagnosis && (
                    <p className="text-slate-800 text-[11px] font-medium pt-1">
                      <strong>Diagnosis:</strong> {rec.diagnosis}
                    </p>
                  )}
                </div>

                <div className="bg-slate-50 p-3 rounded-md border border-slate-200 space-y-1">
                  <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Corrective Actions Taken:
                  </p>
                  <p className="text-slate-600 text-[11px] leading-relaxed">{rec.action_taken}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Maintenance Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Log Maintenance Work Order"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateRecord} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Target Machinery Asset</label>
            {assets.length === 0 ? (
              <p className="text-rose-600">Please register an asset first.</p>
            ) : (
              <select
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                className="w-full border border-slate-300 rounded-md p-2 bg-slate-50 focus:ring-1 focus:ring-violet-600 text-xs font-medium text-slate-800"
              >
                {assets.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} ({a.asset_code || a.asset_tag}) — {a.manufacturer}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Maintenance Classification</label>
              <select
                value={maintType}
                onChange={(e: any) => setMaintType(e.target.value)}
                className="w-full border border-slate-300 rounded-md p-2 bg-slate-50 focus:ring-1 focus:ring-violet-600 text-xs text-slate-800"
              >
                <option value="preventive">Preventive</option>
                <option value="corrective">Corrective</option>
                <option value="emergency">Emergency Breakdown</option>
                <option value="inspection">Inspection</option>
                <option value="calibration">Calibration</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Downtime (Minutes)</label>
              <input
                type="number"
                min="0"
                value={downtime}
                onChange={(e) => setDowntime(Number(e.target.value))}
                className="w-full border border-slate-300 rounded-md p-2 bg-slate-50 focus:ring-1 focus:ring-violet-600 text-xs text-slate-800 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Observed Symptoms / Trigger</label>
            <textarea
              rows={2}
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="e.g. High temperature alarm and vibration spikes during shift 2"
              className="w-full border border-slate-300 rounded-md p-2 bg-slate-50 focus:ring-1 focus:ring-violet-600 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Diagnosis & Root Cause</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="e.g. Clogged suction strainer & impeller scale build-up"
              className="w-full border border-slate-300 rounded-md p-2 bg-slate-50 focus:ring-1 focus:ring-violet-600 text-xs text-slate-800"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Corrective Action Taken *</label>
            <textarea
              required
              rows={2}
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              placeholder="e.g. Performed LOTO, dismounted suction housing, cleaned strainer mesh, tested at 6.0 bar"
              className="w-full border border-slate-300 rounded-md p-2 bg-slate-50 focus:ring-1 focus:ring-violet-600 text-xs text-slate-800"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-3.5 py-1.5 border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-1.5 bg-violet-600 text-white rounded-md hover:bg-violet-700 font-bold flex items-center shadow-card-subtle"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Save Work Order
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

