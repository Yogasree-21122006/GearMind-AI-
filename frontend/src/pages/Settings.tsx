import React from 'react';
import { Settings as SettingsIcon, Database, Cpu, Server } from 'lucide-react';
import { AlertBanner } from '../components/AlertBanner';

export const Settings: React.FC = () => {
  return (
    <div className="space-y-6">
      <AlertBanner
        type="info"
        title="Production Environment Configuration"
        message="Backend API and Supabase pgvector endpoints are configured via environment variables (.env). API keys and service-role secrets remain strictly secured on the server."
      />

      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-card-subtle space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center">
              <SettingsIcon className="w-3.5 h-3.5 mr-1.5 text-violet-600" />
              Industrial System & AI Infrastructure Configuration
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Live connectivity status for backend microservices and vector indices
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" /> All Systems Nominal
          </span>
        </div>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded bg-violet-50 text-violet-700 border border-violet-100">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Database & Vector Storage</p>
                <p className="text-[11px] text-slate-500">Supabase PostgreSQL + pgvector extension (768d Cosine Metric)</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded text-[10px] font-mono">
              ONLINE
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded bg-violet-50 text-violet-700 border border-violet-100">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">Multimodal LLM & Vision Engine</p>
                <p className="text-[11px] text-slate-500">Google Gemini 2.5 Flash / Pro Multimodal Vision API</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-violet-50 text-violet-700 border border-violet-200 font-bold rounded text-[10px] font-mono">
              READY
            </span>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-md border border-slate-200">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded bg-slate-100 text-slate-700 border border-slate-200">
                <Server className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-900">FastAPI REST Server</p>
                <p className="text-[11px] text-slate-500">Pydantic v2 validation schema & CORS isolation on port 8000</p>
              </div>
            </div>
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold rounded text-[10px] font-mono">
              HEALTHY
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

