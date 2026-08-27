import { fetchApi } from './api';
import { Manual } from '../types';

export const manualService = {
  async getManuals(params?: { skip?: number; limit?: number }): Promise<Manual[]> {
    const query = new URLSearchParams();
    if (params?.skip) query.append('skip', String(params.skip));
    if (params?.limit) query.append('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchApi<Manual[]>(`/manuals${qs}`);
  },

  async getManualById(id: string): Promise<Manual> {
    return fetchApi<Manual>(`/manuals/${id}`);
  },

  async uploadManual(formData: FormData): Promise<Manual> {
    return fetchApi<Manual>('/manuals/upload', {
      method: 'POST',
      body: formData,
    });
  },

  async deleteManual(id: string): Promise<{ message: string }> {
    return fetchApi<{ message: string }>(`/manuals/${id}`, {
      method: 'DELETE',
    });
  }
};
