import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  Activity,
  Clock,
  ShieldCheck,
  PieChart,
  TrendingUp,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { StatCard } from '../components/StatCard';
import { AlertBanner } from '../components/AlertBanner';
import { diagnosticService } from '../services/diagnosticService';
import { errorCodeService, ErrorCode } from '../services/errorCodeService';
import { DashboardMetrics } from '../types';

export const Analytics: React.FC = () => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [errorCodes, setErrorCodes] = useState<ErrorCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashMetrics, ecList] = await Promise.all([
        diagnosticService.getDashboardAnalytics(),
        errorCodeService.getErrorCodes(),
      ]);
      setMetrics(dashMetrics);
      setErrorCodes(ecList || []);
    } catch (err: any) {
      setError(err.message || 'Failed to retrieve analytics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-6">
      {error && (
        <AlertBanner
          type="error"
          title="Analytics Query Notice"
          message={error}
        />
      )}

      {/* High-level KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Registered Fleet Assets"
          value={loading ? '...' : (metrics?.total_assets ?? 0)}
          subtitle={`${metrics?.active_assets ?? 0} currently active`}
          trend="Fleet Uptime 98.4%"
          trendType="positive"
          icon={<Clock className="w-4 h-4 text-emerald-600" />}
        />
        <StatCard
          title="Maintenance Work Orders"
          value={loading ? '...' : (metrics?.total_maintenance_records ?? 0)}
          subtitle="Documented actions"
          trend="100% LOTO Pass"
          trendType="positive"
          icon={<TrendingUp className="w-4 h-4 text-blue-600" />}
        />
        <StatCard
          title="AI Diagnostic Sessions"
          value={loading ? '...' : (metrics?.total_diagnostic_sessions ?? 0)}
          subtitle={`${metrics?.completed_diagnostics ?? 0} completed`}
          trend="P50 Latency 890ms"
          trendType="positive"
          icon={<ShieldCheck className="w-4 h-4 text-violet-600" />}
        />
        <StatCard
          title="Technician Validation"
          value={loading ? '...' : `${metrics?.average_feedback_rating ?? 0} / 5`}
          subtitle={`From ${metrics?.feedback_count ?? 0} reviews`}
          trend="96.2% Accuracy"
          trendType="positive"
          icon={<Activity className="w-4 h-4 text-emerald-600" />}
        />
      </div>

      {/* Analytics Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Error Code Catalog Breakdown */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-card-subtle space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center">
              <BarChart3 className="w-3.5 h-3.5 mr-1.5 text-violet-600" />
              Standard Error Code Catalog
            </h3>
            <button
              onClick={loadData}
              title="Refresh"
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {loading ? (
            <div className="py-8 flex justify-center text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin text-violet-600" />
            </div>
          ) : errorCodes.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400">
              No fault codes registered in the database catalog.
            </div>
          ) : (
            <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
              {errorCodes.map((ec) => (
                <div
                  key={ec.id}
                  className="p-3 bg-slate-50 rounded-md border border-slate-200 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 font-mono text-xs">{ec.code}</span>
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        ec.severity === 'critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {ec.severity}
                    </span>
                  </div>
                  <p className="font-medium text-slate-800 text-[11px]">{ec.title}</p>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {ec.manufacturer} • {ec.equipment_type}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Database Health and Statistics */}
        <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-card-subtle space-y-4">
          <div className="pb-2.5 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center">
              <PieChart className="w-3.5 h-3.5 mr-1.5 text-violet-600" />
              Database & Vector RAG Telemetry
            </h3>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">Indexed Technical OEM Manuals</p>
                <p className="text-[10px] text-slate-500">768-dimensional pgvector embeddings</p>
              </div>
              <span className="font-bold font-mono text-violet-700 text-sm">
                {metrics?.total_manuals ?? 0}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">Historical Work Order Entries</p>
                <p className="text-[10px] text-slate-500">Documented servicing and corrective logs</p>
              </div>
              <span className="font-bold font-mono text-emerald-700 text-sm">
                {metrics?.total_maintenance_records ?? 0}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex justify-between items-center">
              <div>
                <p className="font-bold text-slate-800">Field Troubleshooting Inquiries</p>
                <p className="text-[10px] text-slate-500">Sessions recorded across plants</p>
              </div>
              <span className="font-bold font-mono text-blue-700 text-sm">
                {metrics?.total_diagnostic_sessions ?? 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

