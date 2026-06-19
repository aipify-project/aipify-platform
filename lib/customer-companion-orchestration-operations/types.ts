export type CompanionOrchestrationTab =
  | "overview"
  | "specialists"
  | "assignments"
  | "coordination"
  | "workloads"
  | "approvals"
  | "reports"
  | "executive";

export type SpecialistRow = {
  specialist_key: string;
  specialist_name: string;
  specialist_type?: string;
  specialist_status?: string;
  description?: string;
  linked_skills?: unknown;
  business_packs?: unknown;
  workload_pct?: number;
  response_quality_score?: number;
  usage_count?: number;
};

export type CompanionOrchestrationCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  specialists?: SpecialistRow[];
  assignments?: Record<string, unknown>[];
  coordination?: Record<string, unknown>;
  workloads?: Record<string, unknown>[];
  approvals?: Record<string, unknown>;
  teams?: Record<string, unknown>[];
  meeting_council?: Record<string, unknown>[];
  decision_collaborations?: Record<string, unknown>[];
  integrations?: Record<string, unknown>;
  performance?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  audit_recent?: { event_type: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type CompanionOrchestrationLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<CompanionOrchestrationTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  specialistStatuses: Record<string, string>;
};
