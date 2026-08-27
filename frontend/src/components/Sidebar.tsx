import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Camera,
  BookOpen,
  Wrench,
  History,
  MessageSquareHeart,
  BarChart3,
  Settings,
  Sparkles,
  Award,
  LogOut
} from 'lucide-react';
import { UserProfile } from '../context/AuthContext';

export type TabKey =
  | 'dashboard'
  | 'assets'
  | 'image_upload'
  | 'manuals'
  | 'diagnostic'
  | 'history'
  | 'feedback'
  | 'analytics'
  | 'evaluation'
  | 'settings';

interface SidebarProps {
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  profile?: UserProfile | null;
  onLogout?: () => void;
}

interface NavGroup {
  title: string;
  items: { key: TabKey; label: string; icon: React.ReactNode; badge?: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange, profile, onLogout }) => {
  const navGroups: NavGroup[] = [
    {
      title: 'COMMAND CENTER',
      items: [
        { key: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
        { key: 'assets', label: 'Equipment & Assets', icon: <Cpu className="w-4 h-4" /> },
        { key: 'image_upload', label: 'Visual Inspection', icon: <Camera className="w-4 h-4" />, badge: 'AI' },
        { key: 'diagnostic', label: 'Diagnostic Copilot', icon: <Wrench className="w-4 h-4" />, badge: 'Live' },
      ],
    },
    {
      title: 'KNOWLEDGE & AUDIT',
      items: [
        { key: 'manuals', label: 'Manual Library', icon: <BookOpen className="w-4 h-4" /> },
        { key: 'history', label: 'Maintenance History', icon: <History className="w-4 h-4" /> },
        { key: 'feedback', label: 'Technician Feedback', icon: <MessageSquareHeart className="w-4 h-4" /> },
      ],
    },
    {
      title: 'INTELLIGENCE & INSIGHTS',
      items: [
        { key: 'analytics', label: 'Analytics & KPIs', icon: <BarChart3 className="w-4 h-4" /> },
        { key: 'evaluation', label: 'AI Evaluation & Gates', icon: <Award className="w-4 h-4 text-purple-400" /> },
        { key: 'settings', label: 'System Architecture', icon: <Settings className="w-4 h-4" /> },
      ],
    },
  ];

  const displayName = profile?.full_name || 'Technician Lead';
  const displayRole = profile?.role || 'Field Service Specialist';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || 'TL';

  return (
    <aside className="w-64 bg-white text-slate-700 flex flex-col flex-shrink-0 border-r border-slate-200 select-none shadow-sm">
      {/* Brand & Command Center Header */}
      <div className="h-16 flex items-center px-5 border-b border-slate-100 space-x-3 bg-gradient-to-r from-orange-50/50 to-amber-50/30">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-amber-500 via-orange-500 to-orange-600 flex items-center justify-center text-white shadow-orange-glow border border-orange-300 flex-shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center space-x-1.5">
            <h1 className="text-xs font-bold text-slate-900 tracking-wider">MAINTENANCE</h1>
            <span className="text-[10px] font-bold px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded border border-orange-200">
              AI COPILOT
            </span>
          </div>
          <p className="text-[9px] uppercase tracking-widest text-slate-500 font-semibold truncate">
            Autonomous Field Assistant
          </p>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 px-3 py-4 space-y-6 overflow-y-auto">
        {navGroups.map((group) => (
          <div key={group.title} className="space-y-1">
            <div className="px-3 pb-1.5 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              {group.title}
            </div>
            {group.items.map((item) => {
              const isActive = activeTab === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => onTabChange(item.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-smooth ${
                    isActive
                      ? 'bg-orange-50 text-orange-700 border border-orange-200 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <span className={isActive ? 'text-orange-600' : 'text-slate-400'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-orange-500 text-white shadow-xs'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Technician Profile Card & Logout */}
      <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-orange-100 flex-shrink-0 flex items-center justify-center text-xs font-bold text-orange-700 border border-orange-200 shadow-xs">
            {initials}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-slate-900 truncate" title={displayName}>
              {displayName}
            </p>
            <div className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <p className="text-[10px] text-slate-500 truncate font-medium" title={displayRole}>
                {displayRole}
              </p>
            </div>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            title="Sign Out"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors flex-shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </aside>
  );
};

