export interface DiagnosticSession {
  id: string;
  asset_id?: string;
  technician_id?: string;
  user_question: string;
  image_id?: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  completed_at?: string;
  asset?: {
    id: string;
    name: string;
    asset_code?: string;
    model?: string;
  };
  technician?: {
    full_name: string;
  };
  results?: DiagnosticResult[];
}

export interface DiagnosticResult {
  id: string;
  diagnostic_session_id: string;
  issue_summary: string;
  identified_error_code?: string;
  confidence?: number;
  probable_causes: Array<{ cause: string; probability?: number }>;
  recommended_steps: Array<{ step: number; action: string; safety_note?: string }>;
  required_tools: string[];
  safety_warnings: string[];
  citations: Array<{ document_title: string; page_number: number; chunk_id?: string }>;
  model_name?: string;
  response_time_ms?: number;
  created_at: string;
}
