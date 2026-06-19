export type ExecutiveCopilotTab =
  | "overview"
  | "briefings"
  | "decisions"
  | "approvals"
  | "recommendations"
  | "execution"
  | "reports"
  | "strategy";

export type ExecutiveApproval = {
  approval_key: string;
  approval_title: string;
  approval_status?: string;
  priority?: string;
  financial_impact?: string;
  risk_impact?: string;
  decision_key?: string;
  summary?: string;
};

export type ExecutiveCopilotCenter = {
  found: boolean;
  principle?: string;
  philosophy?: string;
  section?: string;
  organization?: { id: string; name: string };
  overview?: Record<string, string | number | undefined>;
  briefings?: Record<string, unknown>[];
  executive_briefings?: Record<string, unknown>[];
  decisions?: Record<string, unknown>[];
  approvals?: ExecutiveApproval[];
  recommendations?: Record<string, unknown>[];
  execution?: Record<string, unknown>[];
  board_reports?: Record<string, unknown>[];
  reports?: Record<string, unknown>;
  strategy?: Record<string, unknown>;
  scenarios?: Record<string, unknown>[];
  monitoring?: Record<string, unknown>[];
  executive_monitoring?: Record<string, unknown>[];
  natural_language_commands?: Record<string, unknown>[];
  executive_dashboard?: Record<string, unknown>;
  integrations?: Record<string, unknown>;
  audit_recent?: { event_type: string; audit_category?: string; summary: string; created_at?: string }[];
  mobile_access?: Record<string, unknown>;
  routes?: Record<string, string>;
  notifications?: Record<string, unknown>;
  error?: string;
};

export type ExecutiveCopilotLabels = {
  title: string;
  subtitle: string;
  decisionsTitle: string;
  boardReportsTitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  tabs: Record<ExecutiveCopilotTab, string>;
  overview: Record<string, string>;
  actions: Record<string, string>;
  sections: Record<string, string>;
  confidenceLevels: Record<string, string>;
  healthStatus: Record<string, string>;
};
