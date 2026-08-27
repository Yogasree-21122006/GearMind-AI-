export * from './asset';
export * from './manual';
export * from './diagnostic';
export * from './feedback';

export interface DashboardMetrics {
  total_assets: number;
  active_assets?: number;
  critical_assets?: number;
  total_maintenance_records?: number;
  total_diagnostic_sessions?: number;
  completed_diagnostics?: number;
  failed_diagnostics?: number;
  total_manuals?: number;
  feedback_count?: number;
  average_feedback_rating?: number;
  feedback_satisfaction_rate?: number;
  active_diagnostics?: number;
  system_status: string;
}
