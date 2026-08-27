import { fetchApi } from './api';
import { DiagnosticSession, DashboardMetrics } from '../types';

export interface DiagnosticAnalysisResponse {
  session_id: string;
  status: string;
  response_time_ms: number;
  diagnostic_result: {
    summary: string;
    observations: string[];
    possible_causes: Array<{ cause: string; probability?: number; rationale?: string }>;
    error_code?: { code?: string; meaning?: string; confidence?: number };
    troubleshooting_steps: Array<{ step: number; action: string; safety_note?: string }>;
    required_tools: string[];
    safety_warnings: string[];
    citations: Array<{ manual_id?: string; document_title: string; page_number: number; similarity?: number }>;
    confidence: number;
    limitations: string[];
  };
  context_summary: {
    rag_chunks_found: number;
    error_code_matched: boolean;
    maintenance_records_used: number;
    vision_analyzed: boolean;
  };
}

export const diagnosticService = {
  async getSessions(params?: { skip?: number; limit?: number }): Promise<DiagnosticSession[]> {
    const query = new URLSearchParams();
    if (params?.skip) query.append('skip', String(params.skip));
    if (params?.limit) query.append('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchApi<DiagnosticSession[]>(`/diagnostics/sessions${qs}`);
  },

  async getSessionById(id: string): Promise<DiagnosticSession> {
    return fetchApi<DiagnosticSession>(`/diagnostics/sessions/${id}`);
  },

  async createSession(data: {
    user_question: string;
    asset_id?: string;
    technician_id?: string;
    image_id?: string;
    status?: string;
  }): Promise<DiagnosticSession> {
    return fetchApi<DiagnosticSession>('/diagnostics/sessions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async analyzeEquipment(formData: FormData): Promise<DiagnosticAnalysisResponse> {
    return fetchApi<DiagnosticAnalysisResponse>('/diagnostics/analyze', {
      method: 'POST',
      body: formData,
    });
  },

  async getDashboardAnalytics(): Promise<DashboardMetrics> {
    return fetchApi<DashboardMetrics>('/analytics/overview');
  }
};
