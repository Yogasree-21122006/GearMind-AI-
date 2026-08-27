import { fetchApi } from './api';

export interface MaintenanceRecord {
  id: string;
  asset_id: string;
  technician_id?: string;
  maintenance_type: 'preventive' | 'corrective' | 'emergency' | 'inspection' | 'calibration';
  issue_description?: string;
  diagnosis?: string;
  action_taken: string;
  parts_replaced?: Array<Record<string, any>>;
  downtime_minutes: number;
  maintenance_date?: string;
  notes?: string;
  created_at: string;
  asset?: { name: string; asset_code: string; model: string };
  technician?: { full_name: string };
}

export const maintenanceService = {
  async getAllRecords(params?: { skip?: number; limit?: number }): Promise<MaintenanceRecord[]> {
    const query = new URLSearchParams();
    if (params?.skip) query.append('skip', String(params.skip));
    if (params?.limit) query.append('limit', String(params.limit));
    const qs = query.toString() ? `?${query.toString()}` : '';
    return fetchApi<MaintenanceRecord[]>(`/maintenance-records${qs}`);
  },

  async getAssetRecords(assetId: string): Promise<MaintenanceRecord[]> {
    return fetchApi<MaintenanceRecord[]>(`/assets/${assetId}/maintenance`);
  },

  async logRecord(assetId: string, data: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> {
    return fetchApi<MaintenanceRecord>(`/assets/${assetId}/maintenance`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
