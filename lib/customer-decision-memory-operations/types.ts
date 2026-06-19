export type DecisionMemoryTab =
  | "overview"
  | "decisions"
  | "approvals"
  | "outcomes"
  | "lessons"
  | "reviews"
  | "reports";

export type DecisionMemoryCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  decisions?: Record<string, unknown>[];
  decision_registry?: Record<string, unknown>[];
  approvals?: Record<string, unknown>[];
  outcomes?: Record<string, unknown>[];
  lessons?: Record<string, unknown>[];
  reviews?: Record<string, unknown>[];
  patterns?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  decision_health?: Record<string, unknown>;
  knowledge_base?: Record<string, unknown>;
  executive_briefings?: Record<string, unknown>;
  companion?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type DecisionMemoryLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<DecisionMemoryTab, string>;
  overview: Record<string, string>;
  sections: Record<string, string>;
  actions: Record<string, string>;
  healthStatus: Record<string, string>;
  successLevel: Record<string, string>;
  reviewStatus: Record<string, string>;
};
