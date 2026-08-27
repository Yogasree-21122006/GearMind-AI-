export interface Manual {
  id: string;
  title: string;
  document_title?: string;
  manufacturer: string;
  equipment_type: string;
  model?: string;
  model_series?: string;
  document_type: string;
  storage_path: string;
  file_name: string;
  processing_status: 'pending' | 'processing' | 'indexed' | 'failed';
  page_count: number;
  uploaded_by?: string;
  created_at: string;
  updated_at?: string;
}

export interface ManualChunk {
  id: string;
  manual_id: string;
  chunk_index: number;
  content: string;
  page_number?: number;
  metadata?: Record<string, any>;
  similarity?: number;
}
