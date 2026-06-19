export type CompanionGovernanceTab =
  | "overview"
  | "permissions"
  | "capabilities"
  | "actions"
  | "oversight"
  | "approvals"
  | "policies"
  | "reports"
  | "executive"
  | "audit";

export type GovernanceAction = {
  action_key: string;
  action_title: string;
  action_type?: string;
  sensitivity_level?: string;
  requires_human_approval?: boolean;
  approval_status?: string;
  summary?: string;
  recorded_at?: string;
};

export type CompanionGovernanceCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  capabilities?: Record<string, unknown>[];
  permissions?: Record<string, unknown>;
  actions?: GovernanceAction[];
  oversight?: Record<string, unknown>;
  approvals?: Record<string, unknown>;
  policies?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  executive_dashboard?: Record<string, unknown>;
  trust_score?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type CompanionGovernanceLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<CompanionGovernanceTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  confidenceLevels: Record<string, string>;
  trustLabels: Record<string, string>;
};
