import React, { useState, useEffect } from 'react';
import loadingImg from '../assets/loading-page.png';

interface SmartLoaderProps {
  message?: string;
  subMessage?: string;
  duration?: number; // duration in ms to simulate 0 -> 100%, default 3000ms (3s)
  variant?: 'overlay' | 'card' | 'fullscreen' | 'compact';
  onComplete?: () => void;
}

export const SmartLoader: React.FC<SmartLoaderProps> = ({
  message = 'Processing AI Diagnostics...',
  subMessage = 'Analyzing Frames • Detecting Objects • Ensuring Safety',
  duration = 3000,
  variant = 'card',
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const rawPct = Math.min(100, (elapsed / duration) * 100);

      // Smooth ease-out simulation
      setProgress(Math.floor(rawPct));

      if (elapsed >= duration) {
        clearInterval(interval);
        if (onComplete) onComplete();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  // Status subtitle stages based on progress
  const getStageText = () => {
    if (progress < 30) return 'Initializing vision models & sensor stream...';
    if (progress < 70) return 'Analyzing telemetry & detecting components...';
    if (progress < 99) return 'Evaluating safety parameters & generating insights...';
    return 'Finalizing AI recommendations...';
  };

  const content = (
    <div className="bg-white border border-orange-100/80 rounded-2xl shadow-xl shadow-orange-500/5 p-5 sm:p-6 text-center max-w-sm sm:max-w-md w-full mx-auto relative overflow-hidden animate-in fade-in zoom-in-95 duration-300">
      {/* Decorative top accent glow */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-orange-400 via-amber-500 to-orange-600"></div>

      {/* Scaled & Minimized Loading Graphic */}
      <div className="relative mb-4 rounded-xl overflow-hidden bg-gradient-to-b from-orange-50/40 to-white border border-orange-100/50 p-2 shadow-inner group">
        <img
          src={loadingImg}
          alt="AI Loading"
          className="w-full h-32 sm:h-40 object-contain rounded-lg transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Title & Stage message */}
      <div className="mb-3">
        <h4 className="text-sm sm:text-base font-bold text-slate-800 tracking-tight flex items-center justify-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-ping" />
          {message}
        </h4>
        <p className="text-xs text-slate-500 mt-1 font-medium min-h-[18px] transition-all duration-300">
          {getStageText()}
        </p>
      </div>

      {/* Progress Bar and Live Counter */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-semibold px-0.5">
          <span className="text-orange-600 uppercase tracking-wider text-[11px] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            Loading
          </span>
          <span className="text-orange-600 font-mono text-sm font-bold bg-orange-50 px-2 py-0.5 rounded-md border border-orange-200/60">
            {progress}%
          </span>
        </div>

        {/* Custom Glowing Gradient Progress Track */}
        <div className="w-full bg-slate-100 rounded-full h-3 sm:h-3.5 p-0.5 overflow-hidden border border-slate-200/80 shadow-inner">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-400 transition-all duration-100 ease-out relative overflow-hidden shadow-sm shadow-orange-500/50"
            style={{ width: `${progress}%` }}
          >
            {/* Animated shimmer sweep inside the progress bar */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
          </div>
        </div>
      </div>

      {/* Features bullet badges footer */}
      {subMessage && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] sm:text-[11px] text-slate-400 font-medium flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Analyzing Frames
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Detecting Objects
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400"></span>
            Ensuring Safety
          </span>
        </div>
      )}
    </div>
  );

  if (variant === 'overlay') {
    return (
      <div className="absolute inset-0 bg-white/85 backdrop-blur-[2px] z-30 flex items-center justify-center p-4 rounded-xl">
        {content}
      </div>
    );
  }

  if (variant === 'fullscreen') {
    return (
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        {content}
      </div>
    );
  }

  // Default 'card' / embedded inline
  return (
    <div className="w-full py-6 flex items-center justify-center">
      {content}
    </div>
  );
};
