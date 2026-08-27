import React from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="text-center py-10 px-4 border border-dashed border-slate-300 rounded-lg bg-slate-50/70">
      {icon && (
        <div className="mx-auto flex items-center justify-center h-10 w-10 rounded-lg bg-white border border-slate-200 text-slate-500 mb-3 shadow-xs">
          {icon}
        </div>
      )}
      <h3 className="text-xs font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="mt-1 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">{description}</p>
      {actionText && onAction && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center px-3.5 py-1.5 border border-slate-300 shadow-xs text-xs font-semibold rounded-md text-slate-800 bg-white hover:bg-slate-50 hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-violet-600 transition-smooth"
          >
            {actionText}
          </button>
        </div>
      )}
    </div>
  );
};

