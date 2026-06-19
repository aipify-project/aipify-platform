export type FutureReadinessTab =
  | "overview"
  | "planning"
  | "scenarios"
  | "roadmaps"
  | "initiatives"
  | "opportunities"
  | "threats"
  | "reports";

export type StrategicInitiative = {
  initiative_key: string;
  initiative_name: string;
  owner_name?: string;
  initiative_status?: string;
  priority?: string;
  budget_estimate?: number;
  expected_outcome?: string;
  dependencies?: unknown[];
  strategic_horizon?: string;
  summary?: string;
};

export type FutureReadinessCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  planning?: Record<string, unknown>[];
  strategic_planning?: Record<string, unknown>[];
  initiatives?: StrategicInitiative[];
  scenarios?: Record<string, unknown>[];
  roadmaps?: Record<string, unknown>[];
  opportunities?: Record<string, unknown>[];
  threats?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  readiness_scores?: Record<string, unknown>[];
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type FutureReadinessLabels = {
  title: string;
  subtitle: string;
  planningTitle: string;
  roadmapsTitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<FutureReadinessTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  readinessLabels: Record<string, string>;
  threatLevels: Record<string, string>;
};
