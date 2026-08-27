export const ASSET_CATEGORIES = [
  'HVAC & Chiller Systems',
  'Centrifugal & Hydraulic Pumps',
  'Electric Motors & Drives',
  'Diesel Generators',
  'Air Compressors',
  'Conveyor & Material Handling',
  'Turbines & Power Plant Units',
  'Robotic Automation Arms',
];

export const STATUS_COLORS = {
  operational: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  degraded: { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' },
  critical: { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  under_maintenance: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
  decommissioned: { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-300' },
};
