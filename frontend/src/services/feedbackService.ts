import { fetchApi } from './api';
import { TechnicianFeedback } from '../types';

export const feedbackService = {
  async getFeedback(params?: { skip?: number; limit?: number }): Promise<TechnicianFeedback[]> {
    const query = new URLSearchParams();
    if (params?.skip) query.append('skip', String(params.skip));
    if (params?.limit) query.append('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchApi<TechnicianFeedback[]>(`/feedback${qs}`);
  },

  async submitFeedback(data: {
    diagnostic_session_id: string;
    rating: number;
    feedback_text?: string;
    was_helpful: boolean;
    actual_root_cause?: string;
    technician_id?: string;
  }): Promise<TechnicianFeedback> {
    return fetchApi<TechnicianFeedback>('/feedback', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
