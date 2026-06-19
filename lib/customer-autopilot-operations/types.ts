export type AutopilotTab =
  | "overview"
  | "policies"
  | "automation_rules"
  | "approval_chains"
  | "prepared_actions"
  | "execution_queue"
  | "insights"
  | "reports";

export type AutopilotQueueItem = {
  queue_key: string;
  queue_title: string;
  queue_status?: string;
  workflow_key?: string;
  action_key?: string;
  summary?: string;
};

export type AutopilotCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  settings?: Record<string, unknown>;
  overview?: Record<string, string | number | undefined>;
  policies?: Record<string, unknown>[];
  automation_rules?: Record<string, unknown>[];
  approval_chains?: Record<string, unknown>[];
  prepared_actions?: Record<string, unknown>[];
  execution_queue?: AutopilotQueueItem[];
  workflows?: Record<string, unknown>[];
  schedules?: Record<string, unknown>[];
  watchtower?: Record<string, unknown>[];
  boundaries?: Record<string, unknown>[];
  insights?: Record<string, unknown>;
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type AutopilotLabels = {
  title: string;
  subtitle: string;
  workflowsTitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<AutopilotTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  profiles: Record<string, string>;
  policyCategories: Record<string, string>;
  confidenceLevels: Record<string, string>;
};
