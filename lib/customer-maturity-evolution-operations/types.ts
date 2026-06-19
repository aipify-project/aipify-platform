export type MaturityEvolutionTab =
  | "overview"
  | "capabilities"
  | "assessments"
  | "benchmarks"
  | "roadmaps"
  | "recommendations"
  | "reports";

export type MaturityEvolutionCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  capabilities?: Record<string, unknown>[];
  assessments?: Record<string, unknown>[];
  readiness?: Record<string, unknown>[];
  roadmaps?: Record<string, unknown>[];
  benchmarks?: Record<string, unknown>[];
  gaps?: Record<string, unknown>[];
  evolution?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  evolution_score?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  maturity_model?: Record<string, unknown>;
  recommendations?: Record<string, unknown>[];
  companion?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type MaturityEvolutionLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<MaturityEvolutionTab, string>;
  overview: Record<string, string>;
  sections: Record<string, string>;
  actions: Record<string, string>;
  evolutionStatus: Record<string, string>;
  maturityLevel: Record<string, string>;
  readinessStatus: Record<string, string>;
};
