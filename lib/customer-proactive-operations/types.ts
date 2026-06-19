export type ProactiveTab =
  | "overview"
  | "observations"
  | "recommendations"
  | "prepared_actions"
  | "approvals"
  | "insights"
  | "opportunities"
  | "reports";

export type ProactiveObservation = {
  observation_key: string;
  observation_title: string;
  observation_category?: string;
  observation_status?: string;
  source_area?: string;
  summary?: string;
};

export type ProactiveRecommendation = {
  recommendation_key: string;
  recommendation_title: string;
  recommendation_type?: string;
  recommendation_status?: string;
  priority?: string;
  summary?: string;
};

export type ProactiveCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  observations?: ProactiveObservation[];
  opportunities?: Record<string, unknown>[];
  prepared_actions?: Record<string, unknown>[];
  recommendations?: ProactiveRecommendation[];
  watchlists?: Record<string, unknown>[];
  insights?: Record<string, unknown>;
  observation_feed?: Record<string, unknown>;
  approvals?: ProactiveRecommendation[];
  operational_health?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type ProactiveLabels = {
  title: string;
  subtitle: string;
  watchlistsTitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<ProactiveTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  observationStatus: Record<string, string>;
  healthStatus: Record<string, string>;
};
