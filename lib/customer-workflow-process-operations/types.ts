export type WorkflowProcessTab =
  | "overview"
  | "workflows"
  | "templates"
  | "automation"
  | "approvals"
  | "monitoring"
  | "analytics"
  | "reports";

export type WorkflowProcessCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  workflows?: Record<string, unknown>[];
  templates?: Record<string, unknown>[];
  automations?: Record<string, unknown>[];
  approvals?: Record<string, unknown>[];
  components?: Record<string, unknown>[];
  process_steps?: Record<string, unknown>[];
  bottlenecks?: Record<string, unknown>[];
  business_packs?: Record<string, unknown>[];
  cross_department?: Record<string, unknown>[];
  workflow_analytics?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  recommendations?: Record<string, unknown>[];
  companion?: Record<string, unknown>;
  monitoring?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  error?: string;
};

export type WorkflowProcessLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<WorkflowProcessTab, string>;
  overview: Record<string, string>;
  sections: Record<string, string>;
  actions: Record<string, string>;
  healthStatus: Record<string, string>;
  workflowStatus: Record<string, string>;
  automationLevel: Record<string, string>;
};
