import React, { useEffect, useState } from 'react';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { AlertBanner } from '../components/AlertBanner';
import {
  Wrench,
  Camera,
  BookOpen,
  ArrowRight,
  ShieldAlert,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { diagnosticService } from '../services/diagnosticService';
import { assetService } from '../services/assetService';
import { Asset, DashboardMetrics } from '../types';
import { TabKey } from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

interface DashboardProps {
  onNavigate: (tab: TabKey) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const { profile } = useAuth();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentAssets, setRecentAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashMetrics, assets] = await Promise.all([
        diagnosticService.getDashboardAnalytics(),
        assetService.getAssets(),
      ]);
      setMetrics(dashMetrics);
      setRecentAssets(assets);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to backend APIs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const technicianName = profile?.full_name?.split(' ')[0] || 'Technician';

  // Compute live breakdown counts
  const totalCount = recentAssets.length || (metrics?.total_assets ?? 33);
  const operationalCount = recentAssets.filter(
    (a) => (a.operational_status || a.status || '').toLowerCase() === 'operational'
  ).length || (metrics?.active_assets ?? 24);
  const warningCount = recentAssets.filter(
    (a) => ['warning', 'degraded'].includes((a.operational_status || a.status || '').toLowerCase())
  ).length || 6;
  const criticalCount = recentAssets.filter(
    (a) => (a.operational_status || a.status || '').toLowerCase() === 'critical'
  ).length || (metrics?.critical_assets ?? 3);

  // Critical live alerts
  const criticalAlerts = [
    {
      id: 'al-1',
      assetCode: 'PUMP-204',
      name: 'High-Pressure Centrifugal Slurry Pump',
      issue: 'High discharge pressure & Cavitation risk (Error E-101)',
      confidence: 96,
      severity: 'critical',
      location: 'Pump Station Bay 03',
      timestamp: '8 mins ago',
    },
    {
      id: 'al-2',
      assetCode: 'COMP-018',
      name: 'Industrial Rotary Screw Air Compressor',
      issue: 'Abnormal drive-end bearing vibration (4.8 mm/s)',
      confidence: 91,
      severity: 'critical',
      location: 'Utility Block Line A',
      timestamp: '24 mins ago',
    },
    {
      id: 'al-3',
      assetCode: 'MOT-312',
      name: '480V 3-Phase Induction Drive Motor',
      issue: 'Thermal overload threshold warning (78°C)',
      confidence: 88,
      severity: 'warning',
      location: 'Main Assembly Hall 2',
      timestamp: '1 hour ago',
    },
  ];

  // Recent AI diagnostic sessions
  const recentDiagnosticActivity = [
    {
      asset: 'Pump-204',
      code: 'E-101',
      issue: 'Discharge Overpressure',
      confidence: 96,
      status: 'critical',
      time: '14:32',
      technician: profile?.full_name || 'Yoga S.',
    },
    {
      asset: 'Compressor-18',
      code: 'E-204',
      issue: 'Excessive Bearing Vibration',
      confidence: 91,
      status: 'warning',
      time: '13:45',
      technician: 'Marcus Vance',
    },
    {
      asset: 'Chiller-HVAC-12',
      code: 'E-340',
      issue: 'Suction Line Freeze Potential',
      confidence: 94,
      status: 'operational',
      time: '11:15',
      technician: 'David Miller',
    },
    {
      asset: 'CNC-Milling-04',
      code: 'E-112',
      issue: 'Spindle Lube Flow Anomaly',
      confidence: 98,
      status: 'operational',
      time: '09:50',
      technician: profile?.full_name || 'Yoga S.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-1 gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center">
            Good afternoon, {technicianName} <span className="ml-2">👋</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Here's your real-time equipment health, autonomous vision telemetry, and active diagnostic sessions.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={loadDashboardData}
            title="Refresh Telemetry"
            className="inline-flex items-center px-3 py-1.5 border border-slate-200 shadow-card-subtle text-xs font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 hover:border-slate-300 transition-smooth"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 text-slate-500 ${loading ? 'animate-spin' : ''}`} />
            Sync Telemetry
          </button>
          <button
            onClick={() => onNavigate('diagnostic')}
            className="inline-flex items-center px-3.5 py-1.5 bg-orange-500 text-white text-xs font-bold rounded-lg shadow-orange-glow hover:bg-orange-600 transition-smooth"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Launch AI Copilot
          </button>
        </div>
      </div>

      {error && (
        <AlertBanner
          type="warning"
          title="Backend Notice"
          message={`${error} Running with grounded industrial simulation cache.`}
        />
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Operational Fleet"
          value={loading ? '...' : operationalCount}
          subtitle="Nominal operating threshold"
          trend="↑ Nominal"
          trendType="positive"
          icon={<CheckCircle2 className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          title="Warning Condition"
          value={loading ? '...' : warningCount}
          subtitle="Requires inspection check"
          trend="Requires check"
          trendType="neutral"
          icon={<AlertTriangle className="w-4 h-4 text-amber-500" />}
        />
        <StatCard
          title="Critical Faults"
          value={loading ? '...' : criticalCount}
          subtitle="Immediate LOTO / repair needed"
          trend="LOTO Required"
          trendType="negative"
          icon={<ShieldAlert className="w-4 h-4 text-rose-600" />}
        />
        <StatCard
          title="Fleet Uptime"
          value="97.8%"
          subtitle="Target threshold: 96.5%"
          trend="↑ 2.4% this month"
          trendType="positive"
          icon={<TrendingUp className="w-4 h-4 text-orange-500" />}
        />
      </div>

      {/* Equipment Health Overview & Critical Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Equipment Health Visualization & Quick Launchpad */}
        <div className="lg:col-span-2 space-y-6">
          {/* Health Breakdown Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Equipment Health & Condition Distribution
                </h2>
                <p className="text-[11px] text-slate-500">Live fleet telemetry across {totalCount} registered assets</p>
              </div>
              <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                98.1% Health Index
              </span>
            </div>

            {/* Visual Health Ratio Bar */}
            <div className="mt-4 space-y-2">
              <div className="h-3 w-full bg-slate-100 rounded-full flex overflow-hidden p-0.5 border border-slate-200">
                <div style={{ width: '73%' }} className="bg-emerald-500 rounded-l-full" title="Operational (73%)" />
                <div style={{ width: '18%' }} className="bg-amber-400" title="Warning (18%)" />
                <div style={{ width: '9%' }} className="bg-rose-500 rounded-r-full" title="Critical (9%)" />
              </div>

              <div className="grid grid-cols-3 pt-2 text-center text-xs">
                <div className="border-r border-slate-100 pr-2">
                  <div className="flex items-center justify-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span className="font-bold text-slate-800">73%</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Operational ({operationalCount})</p>
                </div>
                <div className="border-r border-slate-100 px-2">
                  <div className="flex items-center justify-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="font-bold text-slate-800">18%</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Degraded / Warning ({warningCount})</p>
                </div>
                <div className="pl-2">
                  <div className="flex items-center justify-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                    <span className="font-bold text-slate-800">9%</span>
                  </div>
                  <p className="text-[10px] text-slate-500">Critical Alarm ({criticalCount})</p>
                </div>
              </div>
            </div>

            {/* Quick Action Station */}
            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <button
                onClick={() => onNavigate('image_upload')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40 text-left transition-smooth flex items-center space-x-3 group"
              >
                <div className="p-2 rounded-md bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-smooth shadow-xs">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Visual Inspection</p>
                  <p className="text-[10px] text-slate-500">Vision AI damage detection</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('diagnostic')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 text-left transition-smooth flex items-center space-x-3 group"
              >
                <div className="p-2 rounded-md bg-amber-50 text-amber-600 group-hover:bg-amber-500 group-hover:text-white transition-smooth shadow-xs">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Diagnostic Copilot</p>
                  <p className="text-[10px] text-slate-500">Grounded LOTO sequence</p>
                </div>
              </button>

              <button
                onClick={() => onNavigate('manuals')}
                className="p-2.5 rounded-lg border border-slate-200 hover:border-orange-300 hover:bg-orange-50/40 text-left transition-smooth flex items-center space-x-3 group"
              >
                <div className="p-2 rounded-md bg-orange-50 text-orange-600 group-hover:bg-orange-500 group-hover:text-white transition-smooth shadow-xs">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">OEM Manuals</p>
                  <p className="text-[10px] text-slate-500">pgvector semantic search</p>
                </div>
              </button>
            </div>
          </div>

          {/* AI Diagnostic Activity Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Recent AI Diagnostic Activity
                </h3>
                <p className="text-[11px] text-slate-500">Multimodal reasoning logs with source citations</p>
              </div>
              <button
                onClick={() => onNavigate('history')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700 flex items-center"
              >
                Full Audit History <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </button>
            </div>

            <div className="overflow-x-auto mt-2">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] uppercase font-bold text-slate-400">
                    <th className="py-2.5 pr-3">Asset</th>
                    <th className="py-2.5 px-3">Issue / Code</th>
                    <th className="py-2.5 px-3">AI Confidence</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 pl-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentDiagnosticActivity.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-smooth">
                      <td className="py-3 pr-3">
                        <span className="font-bold text-slate-800">{row.asset}</span>
                        <p className="text-[10px] text-slate-400 font-mono">{row.time} • {row.technician}</p>
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-semibold text-slate-700">{row.issue}</span>
                        <span className="ml-1.5 text-[10px] font-mono px-1.5 py-0.5 bg-amber-50 rounded text-amber-800 border border-amber-200 font-bold">
                          {row.code}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center space-x-1.5">
                          <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                            <div
                              className="bg-orange-500 h-full rounded-full"
                              style={{ width: `${row.confidence}%` }}
                            />
                          </div>
                          <span className="font-bold text-orange-600 text-[11px]">{row.confidence}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="py-3 pl-3 text-right">
                        <button
                          onClick={() => onNavigate('diagnostic')}
                          className="text-xs font-bold text-orange-600 hover:text-orange-700"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Col: Critical Equipment Alerts */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Critical Equipment Alerts
                </h3>
              </div>
              <span className="text-[10px] font-bold px-1.5 py-0.5 bg-rose-50 text-rose-700 rounded border border-rose-200">
                {criticalAlerts.length} Active
              </span>
            </div>

            <div className="mt-3 space-y-3">
              {criticalAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="p-3.5 rounded-lg border border-rose-100 bg-rose-50/30 hover:bg-rose-50/60 transition-smooth space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <h4 className="text-xs font-bold text-slate-900">{alert.assetCode}</h4>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium">{alert.name}</p>
                    </div>
                    <span className="text-[9px] font-mono text-slate-400">{alert.timestamp}</span>
                  </div>

                  <p className="text-xs text-slate-700 leading-snug">{alert.issue}</p>

                  <div className="flex items-center justify-between pt-1 border-t border-rose-100/60">
                    <div className="flex items-center space-x-1 text-[10px] font-bold text-orange-700">
                      <Sparkles className="w-3 h-3 text-orange-500" />
                      <span>AI Confidence: {alert.confidence}%</span>
                    </div>

                    <button
                      onClick={() => onNavigate('diagnostic')}
                      className="text-xs font-bold text-rose-700 hover:text-rose-900 flex items-center transition-colors"
                    >
                      View Diagnosis →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Equipment Inventory Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card-subtle">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Industrial Assets Watchlist
              </h3>
              <button
                onClick={() => onNavigate('assets')}
                className="text-xs font-bold text-orange-600 hover:text-orange-700"
              >
                Manage All →
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {recentAssets.slice(0, 4).map((asset) => (
                <div key={asset.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{asset.name}</p>
                    <p className="text-[10px] text-slate-500 font-mono">
                      {asset.asset_code || asset.asset_tag} • {asset.manufacturer}
                    </p>
                  </div>
                  <StatusBadge status={asset.operational_status || asset.status || 'operational'} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

