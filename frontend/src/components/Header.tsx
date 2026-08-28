import React from 'react';
import { Bell, Search, Database } from 'lucide-react';

interface HeaderProps {
  currentTitle: string;
  subtitle?: string;
  onOpenQuickAction?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTitle }) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Title & Breadcrumb */}
      <div className="flex items-center space-x-3">
        <img src="/logo.png" alt="GearMind AI Logo" className="w-8 h-8 rounded-lg object-contain border border-orange-200 bg-white shadow-xs p-0.5" />
        <div>
          <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-400">
            <span className="text-slate-700 font-bold">GearMind AI</span>
            <span>/</span>
            <span className="text-orange-600 font-bold">{currentTitle}</span>
          </div>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">{currentTitle}</h2>
        </div>
      </div>

      {/* Global Status & Quick Controls */}
      <div className="flex items-center space-x-3.5">
        {/* Search Input */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search assets, fault codes, OEM manuals..."
            className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 focus:bg-white transition-all text-slate-800 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* AI Engine Status Pill */}
        <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] font-bold text-emerald-700">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>AI Systems Online</span>
        </div>

        {/* Database Pill */}
        <div className="hidden lg:flex items-center space-x-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-lg text-[11px] font-bold text-amber-800">
          <Database className="w-3 h-3 text-amber-600" />
          <span>pgvector 768d</span>
        </div>

        {/* Notification Bell */}
        <button
          title="System Notifications"
          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors relative border border-slate-200"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
        </button>
      </div>
    </header>
  );
};

