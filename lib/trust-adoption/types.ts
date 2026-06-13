import type { ADOPTION_STAGES, ADOPTION_STATES, RELIABILITY_LEVELS } from "./constants";

export type AdoptionStage = (typeof ADOPTION_STAGES)[number];
export type AdoptionState = (typeof ADOPTION_STATES)[number];
export type ReliabilityLevel = (typeof RELIABILITY_LEVELS)[number];

export type TrustValueMoment = {
  moment_key: string;
  title: string;
  summary: string;
  outcome_type: string;
  time_saved_minutes: number;
  trust_impact: string;
};

export type TrustAdoptionSignal = {
  signal_key: string;
  signal_value: number;
  period: string;
};

export type TrustAdoptionRecommendation = {
  recommendation_key: string;
  message: string;
  status: string;
};

export type TrustAdoptionCenter = {
  adoption_state: AdoptionState | string;
  adoption_stage: AdoptionStage | string;
  companion_reliability_score: number;
  reliability_level: ReliabilityLevel | string;
  trust_trend: string | null;
  value_moments: TrustValueMoment[];
  signals: TrustAdoptionSignal[];
  recommendations: TrustAdoptionRecommendation[];
  widgets: Record<string, unknown> | null;
  recent_audit: Array<{ id: string; event_type: string; summary: string | null; created_at: string }>;
  blueprint: Record<string, unknown> | null;
  can_manage: boolean;
  can_record: boolean;
  privacy_note: string | null;
};
