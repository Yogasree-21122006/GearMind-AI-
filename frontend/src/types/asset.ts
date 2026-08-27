export type AssetStatus = 'operational' | 'degraded' | 'critical' | 'under_maintenance' | 'decommissioned';

export interface AssetImage {
  id: string;
  asset_id: string;
  technician_id?: string;
  storage_path: string;
  file_name: string;
  content_type: string;
  image_type: 'nameplate' | 'overall' | 'component' | 'damage' | 'thermal' | 'inspection';
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
}

export interface Asset {
  id: string;
  asset_code: string;
  asset_tag?: string; // alias for backwards compatibility
  name: string;
  equipment_type: string;
  category?: string; // alias for backwards compatibility
  manufacturer: string;
  model: string;
  model_number?: string; // alias
  serial_number: string;
  location: string;
  location_facility?: string; // alias
  operational_status: AssetStatus;
  status?: AssetStatus; // alias
  installation_date?: string;
  last_maintenance_date?: string;
  created_at: string;
  updated_at: string;
  images?: AssetImage[];
}

export interface AssetCreateInput {
  asset_code: string;
  name: string;
  equipment_type: string;
  manufacturer: string;
  model: string;
  serial_number: string;
  location: string;
  operational_status?: AssetStatus;
  installation_date?: string;
  last_maintenance_date?: string;
}
