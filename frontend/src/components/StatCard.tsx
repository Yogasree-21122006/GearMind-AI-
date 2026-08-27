import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendType = 'neutral',
  badge,
}) => {
  const trendColor =
    trendType === 'positive'
      ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
      : trendType === 'negative'
      ? 'text-rose-700 bg-rose-50 border-rose-200'
      : 'text-slate-600 bg-slate-100 border-slate-200';

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-card-subtle hover:shadow-card-hover transition-smooth">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{title}</span>
        {icon && <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-md text-slate-700">{icon}</div>}
      </div>
      <div className="mt-2.5 flex items-baseline justify-between">
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
        {trend && (
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${trendColor}`}>
            {trend}
          </span>
        )}
        {badge && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-600">
            {badge}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1 text-[11px] text-slate-500">{subtitle}</p>}
    </div>
  );
};

