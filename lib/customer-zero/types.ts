import type { PILOT_LEVELS, READINESS_DIMENSIONS, READINESS_STATES } from "./constants";

export type PilotLevel = (typeof PILOT_LEVELS)[number];
export type ReadinessState = (typeof READINESS_STATES)[number];
export type ReadinessDimension = (typeof READINESS_DIMENSIONS)[number];

export type CustomerZeroLearningSource = {
  source_key: string;
  source_label: string;
  source_type: string;
  item_count: number;
  indexed_count: number;
  status: string;
};

export type CustomerZeroReadiness = {
  dimension_key: ReadinessDimension | string;
  score: number;
  state: ReadinessState | string;
  notes: string | null;
};

export type CustomerZeroRecommendation = {
  id: string;
  recommendation_type: string;
  pilot_level: PilotLevel;
  title: string;
  summary: string;
  confidence: string;
  status: string;
  requires_approval: boolean;
};

export type CustomerZeroExpansionGate = {
  pilot_kpis_achieved: boolean;
  stable_governance: boolean;
  positive_admin_feedback: boolean;
  demonstrated_time_savings: boolean;
  proven_operational_value: boolean;
  acceptable_error_rates: boolean;
  external_rollout_approved: boolean;
  gate_status: string;
};

export type CustomerZeroCenter = {
  pilot_level: PilotLevel;
  readiness_state: ReadinessState | string;
  readiness_message: string;
  learning_sources: CustomerZeroLearningSource[];
  readiness: CustomerZeroReadiness[];
  pending_recommendations: CustomerZeroRecommendation[];
  value_metrics: Array<{ metric_key: string; metric_value: number; period: string }>;
  expansion_gate: CustomerZeroExpansionGate | null;
  recent_audit: Array<{ id: string; event_type: string; summary: string | null; created_at: string }>;
  blueprint: Record<string, unknown> | null;
  pilot_overview: Record<string, unknown> | null;
  privacy_note: string | null;
};
