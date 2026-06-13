import type { ADOPTION_STAGES, JOURNEY_STEPS } from "./constants";

export type JourneyStep = (typeof JOURNEY_STEPS)[number];
export type AdoptionStage = (typeof ADOPTION_STAGES)[number];

export type FirstDayJourneyStep = {
  step_key: string;
  step_number: number;
  status: string;
};

export type FirstDayValueMoment = {
  moment_key: string;
  title: string;
  summary: string;
  insight_type: string;
  confidence: string;
  delivered: boolean;
};

export type FirstDayRecommendation = {
  key: string;
  message: string;
};

export type FirstDayConfidenceMessage = {
  area: string;
  message: string;
  level: string;
};

export type FirstDayCenter = {
  current_step: JourneyStep;
  adoption_stage: AdoptionStage | string;
  journey_status: string;
  welcome_message: string;
  trust_score: number;
  first_value_delivered: boolean;
  first_task_completed: boolean;
  journey_steps: FirstDayJourneyStep[];
  value_moments: FirstDayValueMoment[];
  recommendations: FirstDayRecommendation[];
  confidence_messages: FirstDayConfidenceMessage[];
  discovery_summary: Record<string, unknown> | null;
  readiness_report: Record<string, unknown> | null;
  personalization: Record<string, unknown> | null;
  widgets: Record<string, unknown> | null;
  recent_audit: Array<{ id: string; event_type: string; summary: string | null; created_at: string }>;
  blueprint: Record<string, unknown> | null;
  can_manage: boolean;
  can_complete: boolean;
  privacy_note: string | null;
};
