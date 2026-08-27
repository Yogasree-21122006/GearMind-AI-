import { fetchApi } from './api';

export interface ErrorCode {
  id: string;
  equipment_type: string;
  manufacturer: string;
  code: string;
  title: string;
  description: string;
  possible_causes: string[];
  recommended_checks: string[];
  safety_warnings: string[];
  severity: 'info' | 'warning' | 'critical' | 'fatal';
  created_at: string;
}

export const errorCodeService = {
  async getErrorCodes(params?: {
    equipment_type?: string;
    manufacturer?: string;
    severity?: string;
    skip?: number;
    limit?: number;
  }): Promise<ErrorCode[]> {
    const query = new URLSearchParams();
    if (params?.equipment_type) query.append('equipment_type', params.equipment_type);
    if (params?.manufacturer) query.append('manufacturer', params.manufacturer);
    if (params?.severity) query.append('severity', params.severity);
    if (params?.skip) query.append('skip', String(params.skip));
    if (params?.limit) query.append('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchApi<ErrorCode[]>(`/error-codes${qs}`);
  },

  async getErrorCodeByCode(code: string): Promise<ErrorCode> {
    return fetchApi<ErrorCode>(`/error-codes/${code}`);
  },

  async createErrorCode(data: Partial<ErrorCode>): Promise<ErrorCode> {
    return fetchApi<ErrorCode>('/error-codes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
