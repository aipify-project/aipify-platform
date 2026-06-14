export type FutureScenario = {
  scenario_key: string;
  domain: string;
  scenario_type: string;
  title: string;
  summary: string;
  status: string;
};

export type FutureSignal = {
  signal_key: string;
  domain: string;
  signal_type: string;
  title: string;
  summary: string;
  signal_tone: string;
};

export type ReadinessItem = {
  readiness_key: string;
  dimension: string;
  title: string;
  summary: string;
  readiness_level: string;
};

export type FuturesReview = {
  review_key: string;
  review_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type FuturesTimelineEvent = {
  timeline_key: string;
  event_type: string;
  domain: string;
  label: string;
  summary: string;
  recorded_at: string | null;
};

export type ArchivedScenario = {
  archive_key: string;
  domain: string;
  title: string;
  summary: string;
  archived_at: string | null;
};

export type ForesightSnapshot = {
  snapshot_key: string;
  period_label: string;
  readiness_score: number;
  summary: string;
  captured_at: string | null;
};

export type FuturesInsight = {
  insight_key: string;
  message: string;
  priority: string;
};

export type FuturesRecommendation = {
  recommendation_key: string;
  message: string;
  priority: string;
};

export type FuturesSession = {
  session_key: string;
  session_type: string;
  prompt: string;
  status: string;
  completed_at: string | null;
};

export type OrganizationalFuturesCenter = {
  dashboard: {
    readiness_score: number;
    readiness_label: string;
    scenarios_explored: number;
    scenarios_total: number;
    signals_identified: number;
    preparedness_initiatives: number;
    review_participation_pct: number;
    capabilities_readiness_pct: number;
    governance_readiness_pct: number;
    technology_readiness_pct: number;
    leadership_readiness_pct: number;
    strategic_flexibility_pct: number;
    executive_confidence: number;
    reviews_completed: number;
  } | null;
  scenarios: FutureScenario[];
  future_signals: FutureSignal[];
  readiness_items: ReadinessItem[];
  futures_reviews: FuturesReview[];
  timeline: FuturesTimelineEvent[];
  archived_scenarios: ArchivedScenario[];
  snapshots: ForesightSnapshot[];
  insights: FuturesInsight[];
  recommendations: FuturesRecommendation[];
  futures_sessions: FuturesSession[];
  executive_view: {
    scenario_readiness: string;
    strategic_resilience: string;
    emerging_signals: string;
    long_term_opportunities: string;
  } | null;
  links: Record<string, string> | null;
  can_manage: boolean;
  can_contribute: boolean;
  privacy_note: string | null;
};
