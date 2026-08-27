import { fetchApi } from './api';

export interface EvaluationSummary {
  evaluation_id: string;
  timestamp: string;
  total_test_cases: number;
  retrieval: {
    precision_at_3: number;
    recall_at_3: number;
    precision_at_5: number;
    recall_at_5: number;
  };
  vision: {
    accuracy_pct: number;
    cases_evaluated: number;
  };
  error_codes: {
    accuracy_pct: number;
    cases_evaluated: number;
  };
  grounding: {
    grounded_answer_rate_pct: number;
  };
  hallucination: {
    hallucination_rate_pct: number;
  };
  citations: {
    citation_accuracy_pct: number;
  };
  safety: {
    safety_pass_rate_pct: number;
  };
  performance: {
    p50_latency_ms: number;
    p95_latency_ms: number;
    average_latency_ms: number;
    avg_rag_latency_ms: number;
    avg_vision_latency_ms: number;
    avg_llm_latency_ms: number;
  };
  business_kpi: {
    metric_name: string;
    reduction_pct: number;
    baseline_manual_time_sec: number;
    ai_assisted_time_sec: number;
  };
}

export interface EvaluationCaseResult {
  case_id: string;
  category: string;
  question: string;
  confidence: number;
  citations_count: number;
  latency_ms: number;
  safety_passed: boolean;
}

export interface FullEvaluationResponse {
  summary: EvaluationSummary;
  case_results: EvaluationCaseResult[];
}

export const evaluationService = {
  async getSummary(): Promise<EvaluationSummary> {
    return fetchApi<EvaluationSummary>('/evaluation/summary');
  },

  async getFullResults(): Promise<FullEvaluationResponse> {
    return fetchApi<FullEvaluationResponse>('/evaluation/results');
  },

  async triggerEvaluationRun(): Promise<{ status: string; message: string; metrics: EvaluationSummary }> {
    return fetchApi<{ status: string; message: string; metrics: EvaluationSummary }>('/evaluation/run', {
      method: 'POST',
    });
  }
};
