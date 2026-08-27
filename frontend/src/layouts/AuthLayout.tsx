import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-lg mb-3">
          <ShieldCheck className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
          Field-Service Maintenance AI
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Technician Identity & Operational Access Terminal
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200 sm:rounded-xl sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};
