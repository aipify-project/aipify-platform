export type ExecutionOutcomeTab =
  | "overview"
  | "initiatives"
  | "actions"
  | "owners"
  | "deadlines"
  | "dependencies"
  | "outcomes"
  | "reports";

export type ExecutionOutcomeCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  initiatives?: Record<string, unknown>[];
  actions?: Record<string, unknown>[];
  accountability?: Record<string, unknown>[];
  dependencies?: Record<string, unknown>[];
  blockers?: Record<string, unknown>[];
  outcomes?: Record<string, unknown>[];
  meetings?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  execution_scorecard?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  recommendations?: Record<string, unknown>[];
  companion?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type ExecutionOutcomeLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<ExecutionOutcomeTab, string>;
  overview: Record<string, string>;
  sections: Record<string, string>;
  actions: Record<string, string>;
  healthStatus: Record<string, string>;
  actionStatus: Record<string, string>;
  priority: Record<string, string>;
};
