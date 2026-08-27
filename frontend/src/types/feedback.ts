export interface TechnicianFeedback {
  id: string;
  diagnostic_session_id: string;
  technician_id?: string;
  rating: number;
  feedback_text?: string;
  was_helpful: boolean;
  is_helpful?: boolean;
  actual_root_cause?: string;
  created_at: string;
}
