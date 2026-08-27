import React, { useState, useEffect } from 'react';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { AlertBanner } from '../components/AlertBanner';
import {
  Cpu,
  Plus,
  Search,
  MapPin,
  Trash2,
  Loader2,
  RefreshCw,
  LayoutGrid,
  List,
  Thermometer,
  Activity,
  Gauge,
  TrendingUp
} from 'lucide-react';
import { assetService } from '../services/assetService';
import { Asset, AssetCreateInput } from '../types';

export const Assets: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [filterType, setFilterType] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [newAsset, setNewAsset] = useState<AssetCreateInput>({
    asset_code: '',
    name: '',
    equipment_type: 'Chiller',
    manufacturer: '',
    model: '',
    serial_number: '',
    location: '',
    operational_status: 'operational',
  });

  const loadAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await assetService.getAssets({
        equipment_type: filterType || undefined,
      });
      setAssets(data || []);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve assets.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssets();
  }, [filterType]);

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await assetService.createAsset(newAsset);
      setIsModalOpen(false);
      // Reset form
      setNewAsset({
        asset_code: '',
        name: '',
        equipment_type: 'Chiller',
        manufacturer: '',
        model: '',
        serial_number: '',
        location: '',
        operational_status: 'operational',
      });
      loadAssets();
    } catch (err: any) {
      alert(`Error registering asset: ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAsset = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete asset "${name}"?`)) return;
    try {
      await assetService.deleteAsset(id);
      loadAssets();
    } catch (err: any) {
      alert(`Error deleting asset: ${err.message}`);
    }
  };

  const filteredAssets = assets.filter((a) => {
    const matchesSearch =
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.asset_code || a.asset_tag || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.location || a.location_facility || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      !filterStatus || (a.operational_status || a.status || '').toLowerCase() === filterStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Helper telemetry mock for each asset to simulate industrial sensors
  const getAssetTelemetry = (asset: Asset) => {
    const isCritical = (asset.operational_status || asset.status || '').toLowerCase() === 'critical';
    const isWarning = ['warning', 'degraded'].includes((asset.operational_status || asset.status || '').toLowerCase());
    return {
      temp: isCritical ? '82.4°C' : isWarning ? '74.1°C' : '68.0°C',
      vibration: isCritical ? '5.2 mm/s' : isWarning ? '3.8 mm/s' : '2.1 mm/s',
      pressure: isCritical ? '8.4 bar' : isWarning ? '6.1 bar' : '4.8 bar',
      uptime: isCritical ? '92.1%' : isWarning ? '95.6%' : '98.8%',
    };
  };

  return (
    <div className="space-y-5">
      {error && (
        <AlertBanner
          type="error"
          title="Asset Query Notice"
          message={error}
        />
      )}

      {/* Action & Filter Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200 shadow-card-subtle">
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search code, name, OEM, location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-60 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white transition-smooth font-medium"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
          >
            <option value="">All Equipment Types</option>
            <option value="Chiller">Chillers & HVAC</option>
            <option value="Pump">Pumps & Hydraulics</option>
            <option value="Generator">Diesel Generators</option>
            <option value="Motor">Electric Motors</option>
            <option value="Compressor">Compressors</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 text-slate-700 focus:outline-none focus:ring-1 focus:ring-orange-500 font-medium"
          >
            <option value="">All Operational States</option>
            <option value="operational">Operational</option>
            <option value="degraded">Degraded / Warning</option>
            <option value="critical">Critical Fault</option>
            <option value="under_maintenance">In Repair</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              title="Grid View"
              className={`p-1.5 rounded-md text-xs transition-smooth ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              title="Table View"
              className={`p-1.5 rounded-md text-xs transition-smooth ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={loadAssets}
            title="Refresh assets"
            className="p-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 shadow-card-subtle transition-smooth"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-smooth shadow-orange-glow"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Register Asset
          </button>
        </div>
      </div>

      {/* Asset Display */}
      {loading ? (
        <div className="py-16 bg-white border border-slate-200 rounded-xl flex flex-col items-center justify-center text-xs text-slate-400 shadow-card-subtle">
          <Loader2 className="w-6 h-6 animate-spin mb-2 text-orange-500" />
          Loading industrial assets & telemetry...
        </div>
      ) : filteredAssets.length === 0 ? (
        <EmptyState
          title="No equipment assets found"
          description="Try clearing your filters or register a new industrial machine to monitor."
          actionText="Register Equipment"
          onAction={() => setIsModalOpen(true)}
          icon={<Cpu className="w-6 h-6" />}
        />
      ) : viewMode === 'grid' ? (
        /* Industrial Cards Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAssets.map((asset) => {
            const telemetry = getAssetTelemetry(asset);
            return (
              <div
                key={asset.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-card-subtle hover:border-orange-300 hover:shadow-card-hover transition-smooth flex flex-col justify-between space-y-3.5"
              >
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-snug">{asset.name}</h3>
                      <p className="text-[10px] font-mono text-slate-500 mt-0.5">
                        {asset.asset_code || asset.asset_tag} • {asset.equipment_type || asset.category}
                      </p>
                    </div>
                    <StatusBadge status={asset.operational_status || asset.status || 'operational'} />
                  </div>

                  <div className="mt-2 flex items-center text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 mr-1 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{asset.location || asset.location_facility || 'Main Facility'}</span>
                  </div>
                </div>

                {/* Telemetry Sensor Badges */}
                <div className="grid grid-cols-4 gap-1.5 p-2 bg-slate-50/80 rounded-md border border-slate-100 text-center">
                  <div>
                    <div className="flex items-center justify-center text-[9px] text-slate-400 uppercase font-semibold">
                      <Thermometer className="w-2.5 h-2.5 mr-0.5 text-rose-500" /> Temp
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 mt-0.5">{telemetry.temp}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center text-[9px] text-slate-400 uppercase font-semibold">
                      <Activity className="w-2.5 h-2.5 mr-0.5 text-amber-500" /> Vib
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 mt-0.5">{telemetry.vibration}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center text-[9px] text-slate-400 uppercase font-semibold">
                      <Gauge className="w-2.5 h-2.5 mr-0.5 text-blue-500" /> Press
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 mt-0.5">{telemetry.pressure}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-center text-[9px] text-slate-400 uppercase font-semibold">
                      <TrendingUp className="w-2.5 h-2.5 mr-0.5 text-emerald-500" /> Uptime
                    </div>
                    <p className="text-[11px] font-bold text-slate-800 mt-0.5">{telemetry.uptime}</p>
                  </div>
                </div>

                {/* Footer Metadata & Actions */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <div className="text-[10px] text-slate-400 font-mono">
                    OEM: {asset.manufacturer} {asset.model || asset.model_number}
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handleDeleteAsset(asset.id, asset.name)}
                      title="Delete asset"
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Industrial Table View */
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-card-subtle">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Asset Code & Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">OEM / Model</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Telemetry</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAssets.map((asset) => {
                  const telemetry = getAssetTelemetry(asset);
                  return (
                    <tr key={asset.id} className="hover:bg-slate-50/70 transition-smooth">
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-900">{asset.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {asset.asset_code || asset.asset_tag}
                        </div>
                      </td>
                      <td className="px-4 py-3">{asset.equipment_type || asset.category}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-800 font-medium">{asset.manufacturer} - {asset.model || asset.model_number}</div>
                        <div className="text-[10px] text-slate-400 font-mono">SN: {asset.serial_number}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-slate-700">
                          <MapPin className="w-3 h-3 mr-1 text-slate-400" />
                          {asset.location || asset.location_facility}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-[10px] font-mono text-slate-700 space-x-1.5">
                          <span>{telemetry.temp}</span>
                          <span>•</span>
                          <span>{telemetry.vibration}</span>
                          <span>•</span>
                          <span>{telemetry.uptime}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={asset.operational_status || asset.status || 'operational'} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteAsset(asset.id, asset.name)}
                          title="Delete asset"
                          className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Asset Creation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Register Industrial Machinery"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleCreateAsset} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Asset Code (Unique ID)</label>
              <input
                required
                type="text"
                value={newAsset.asset_code}
                onChange={(e) => setNewAsset({ ...newAsset, asset_code: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-orange-500 focus:outline-none bg-slate-50 text-slate-800 font-medium"
                placeholder="e.g. CNC-PUMP-204"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Equipment Name</label>
              <input
                required
                type="text"
                value={newAsset.name}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-orange-500 focus:outline-none bg-slate-50 text-slate-800 font-medium"
                placeholder="e.g. Centrifugal Slurry Pump"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Equipment Type</label>
              <select
                value={newAsset.equipment_type}
                onChange={(e) => setNewAsset({ ...newAsset, equipment_type: e.target.value })}
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
              <label className="block font-semibold text-slate-700 mb-1">Manufacturer (OEM)</label>
              <input
                required
                type="text"
                value={newAsset.manufacturer}
                onChange={(e) => setNewAsset({ ...newAsset, manufacturer: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-orange-500 focus:outline-none bg-slate-50 text-slate-800 font-medium"
                placeholder="e.g. FlowServe, Siemens, Haas"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Model Number</label>
              <input
                required
                type="text"
                value={newAsset.model}
                onChange={(e) => setNewAsset({ ...newAsset, model: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-orange-500 focus:outline-none bg-slate-50 text-slate-800 font-medium"
                placeholder="e.g. Mark 3 ANSI"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Serial Number</label>
              <input
                required
                type="text"
                value={newAsset.serial_number}
                onChange={(e) => setNewAsset({ ...newAsset, serial_number: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-orange-500 focus:outline-none bg-slate-50 text-slate-800 font-medium"
                placeholder="e.g. SN-8840291"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Facility Location</label>
            <input
              required
              type="text"
              value={newAsset.location}
              onChange={(e) => setNewAsset({ ...newAsset, location: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2 focus:ring-1 focus:ring-orange-500 focus:outline-none bg-slate-50 text-slate-800 font-medium"
              placeholder="e.g. Plant 2 - Bay 04"
            />
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
              disabled={submitting}
              className="px-4 py-1.5 bg-orange-500 text-white rounded-lg hover:bg-orange-600 font-bold flex items-center shadow-orange-glow"
            >
              {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />}
              Save Asset
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

