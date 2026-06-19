export type OrganizationalLearningTab =
  | "overview"
  | "lessons"
  | "reviews"
  | "projects"
  | "improvements"
  | "successes"
  | "recommendations"
  | "reports";

export type OrganizationalLearningCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  lessons?: Record<string, unknown>[];
  improvements?: Record<string, unknown>[];
  successes?: Record<string, unknown>[];
  reviews?: Record<string, unknown>[];
  patterns?: Record<string, unknown>[];
  library?: Record<string, unknown>[];
  opportunities?: Record<string, unknown>[];
  department_scores?: Record<string, unknown>[];
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

export type OrganizationalLearningLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<OrganizationalLearningTab, string>;
  overview: Record<string, string>;
  sections: Record<string, string>;
  actions: Record<string, string>;
  learningStatus: Record<string, string>;
  pipelineStage: Record<string, string>;
};
