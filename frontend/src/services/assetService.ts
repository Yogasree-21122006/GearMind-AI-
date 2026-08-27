import { fetchApi } from './api';
import { Asset, AssetCreateInput, AssetImage } from '../types';

export const assetService = {
  async getAssets(params?: {
    equipment_type?: string;
    manufacturer?: string;
    operational_status?: string;
    location?: string;
  }): Promise<Asset[]> {
    const query = new URLSearchParams();
    if (params?.equipment_type) query.append('equipment_type', params.equipment_type);
    if (params?.manufacturer) query.append('manufacturer', params.manufacturer);
    if (params?.operational_status) query.append('operational_status', params.operational_status);
    if (params?.location) query.append('location', params.location);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchApi<Asset[]>(`/assets${queryString}`);
  },

  async getAssetById(id: string): Promise<Asset> {
    return fetchApi<Asset>(`/assets/${id}`);
  },

  async createAsset(data: AssetCreateInput): Promise<Asset> {
    return fetchApi<Asset>('/assets', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateAsset(id: string, data: Partial<AssetCreateInput>): Promise<Asset> {
    return fetchApi<Asset>(`/assets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteAsset(id: string): Promise<{ message: string }> {
    return fetchApi<{ message: string }>(`/assets/${id}`, {
      method: 'DELETE',
    });
  },

  async uploadAssetImage(assetId: string, formData: FormData): Promise<AssetImage> {
    return fetchApi<AssetImage>(`/assets/${assetId}/images`, {
      method: 'POST',
      body: formData,
    });
  },

  async getAssetImages(assetId: string): Promise<AssetImage[]> {
    return fetchApi<AssetImage[]>(`/assets/${assetId}/images`);
  },

  async getAssetMaintenance(assetId: string): Promise<any[]> {
    return fetchApi<any[]>(`/assets/${assetId}/maintenance`);
  },

  async logAssetMaintenance(assetId: string, data: any): Promise<any> {
    return fetchApi<any>(`/assets/${assetId}/maintenance`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
};
