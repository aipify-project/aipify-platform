export type MemoryGraphTab =
  | "overview"
  | "relationships"
  | "entities"
  | "connections"
  | "knowledge"
  | "decisions"
  | "projects"
  | "reports";

export type MemoryGraphCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  entities?: Record<string, unknown>[];
  relationships?: Record<string, unknown>[];
  connections?: Record<string, unknown>[];
  knowledge?: Record<string, unknown>[];
  decisions?: Record<string, unknown>[];
  projects?: Record<string, unknown>[];
  customer_intelligence?: Record<string, unknown>[];
  dependencies?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  executive_dashboard?: Record<string, unknown>;
  recommendations?: Record<string, unknown>[];
  companion?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type MemoryGraphLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<MemoryGraphTab, string>;
  overview: Record<string, string>;
  sections: Record<string, string>;
  actions: Record<string, string>;
  relationshipStrength: Record<string, string>;
  dependencyRisk: Record<string, string>;
};
