export type ExperienceOnboardingStep = {
  id?: string;
  step_key?: string;
  step_title?: string;
  step_category?: string;
  status?: string;
  progress_percent?: number;
  summary?: string;
  [key: string]: unknown;
};

export type ExperienceFirstImpression = {
  id?: string;
  impression_key?: string;
  impression_title?: string;
  impression_type?: string;
  status?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ExperienceGettingStarted = {
  id?: string;
  progress_key?: string;
  progress_title?: string;
  progress_category?: string;
  progress_percent?: number;
  summary?: string;
  [key: string]: unknown;
};

export type ExperienceSuccessMoment = {
  id?: string;
  moment_key?: string;
  moment_title?: string;
  moment_type?: string;
  status?: string;
  celebration_level?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ExperienceCompanionMoment = {
  id?: string;
  moment_key?: string;
  moment_title?: string;
  moment_type?: string;
  status?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ExperienceAdoptionMetric = {
  id?: string;
  metric_key?: string;
  metric_title?: string;
  metric_category?: string;
  adoption_percent?: number;
  summary?: string;
  [key: string]: unknown;
};

export type ExperienceSuccessJourney = {
  id?: string;
  journey_key?: string;
  journey_title?: string;
  journey_stage?: string;
  status?: string;
  progress_percent?: number;
  summary?: string;
  [key: string]: unknown;
};

export type ExperienceRetentionSignal = {
  id?: string;
  signal_key?: string;
  signal_title?: string;
  signal_type?: string;
  risk_level?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ExperienceDelightMoment = {
  id?: string;
  delight_key?: string;
  delight_title?: string;
  delight_type?: string;
  status?: string;
  summary?: string;
  [key: string]: unknown;
};

export type ExperienceIntelligenceSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type ExperienceAdvisorSignal = {
  id?: string;
  signal_type?: string;
  observation?: string;
  impact?: string;
  recommendation?: string;
  effort?: string;
  confidence?: string;
  created_at?: string;
  [key: string]: unknown;
};

export type CustomerExperienceAdoptionDelightCenter = {
  found?: boolean;
  has_access?: boolean;
  philosophy?: string;
  mission?: string;
  abos_principle?: string;
  customer_onboarding_route?: string;
  customer_success_route?: string;
  install_route?: string;
  assistant_route?: string;
  distinction_note?: string;
  privacy_note?: string;
  error?: string;
  overview?: Record<string, unknown>;
  settings?: Record<string, unknown>;
  modules?: Array<{ key?: string; route?: string }>;
  core_languages?: string[];
  loading_experience_principles?: string[];
  empty_state_framework?: Record<string, unknown>;
  trust_framework?: Record<string, unknown>;
  onboarding_steps?: ExperienceOnboardingStep[];
  first_impressions?: ExperienceFirstImpression[];
  getting_started?: ExperienceGettingStarted[];
  success_moments?: ExperienceSuccessMoment[];
  companion_moments?: ExperienceCompanionMoment[];
  adoption_metrics?: ExperienceAdoptionMetric[];
  success_journeys?: ExperienceSuccessJourney[];
  retention_signals?: ExperienceRetentionSignal[];
  delight_moments?: ExperienceDelightMoment[];
  intelligence_signals?: ExperienceIntelligenceSignal[];
  advisor_signals?: ExperienceAdvisorSignal[];
  audit_logs?: Array<Record<string, unknown>>;
  executive_dashboard?: Record<string, unknown>;
  governance?: Record<string, unknown>;
  [key: string]: unknown;
};
