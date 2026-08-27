import React from 'react';
import { AlertTriangle, Info, CheckCircle, ShieldAlert } from 'lucide-react';

interface AlertBannerProps {
  type?: 'info' | 'warning' | 'error' | 'success';
  title?: string;
  message: string;
  className?: string;
}

export const AlertBanner: React.FC<AlertBannerProps> = ({
  type = 'info',
  title,
  message,
  className = '',
}) => {
  const styles = {
    info: { bg: 'bg-slate-50', border: 'border-slate-300', text: 'text-slate-800', icon: <Info className="w-4 h-4 text-violet-600" /> },
    warning: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-900', icon: <AlertTriangle className="w-4 h-4 text-amber-600" /> },
    error: { bg: 'bg-rose-50', border: 'border-rose-200', text: 'text-rose-900', icon: <ShieldAlert className="w-4 h-4 text-rose-600" /> },
    success: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-900', icon: <CheckCircle className="w-4 h-4 text-emerald-600" /> },
  }[type];

  return (
    <div className={`p-3.5 rounded-lg border ${styles.bg} ${styles.border} ${styles.text} flex items-start space-x-3 shadow-card-subtle ${className}`}>
      <div className="flex-shrink-0 mt-0.5">{styles.icon}</div>
      <div>
        {title && <h4 className="text-xs font-bold mb-0.5 tracking-tight">{title}</h4>}
        <p className="text-xs leading-relaxed opacity-90">{message}</p>
      </div>
    </div>
  );
};

