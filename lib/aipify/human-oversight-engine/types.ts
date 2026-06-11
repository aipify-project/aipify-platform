export type OversightLevel =
  | "advisory_only"
  | "approval_required"
  | "limited_automation"
  | "organization_defined";

export type OversightRiskLevel = "low" | "medium" | "high" | "critical";

export type OversightApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "expired"
  | "overridden";

export type HumanOversightEngineCard = {
  has_organization: boolean;
  pending_approvals?: number;
  high_risk_pending?: number;
  philosophy?: string;
  [key: string]: unknown;
};

export type HumanOversightApproval = {
  id: string;
  action_type: string;
  risk_level: OversightRiskLevel;
  approval_status: OversightApprovalStatus;
  explanation?: Record<string, unknown>;
  confidence?: number;
  ai_initiated?: boolean;
  approval_reason?: string;
  created_at?: string;
  resolved_at?: string;
};

export type HumanOversightEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  settings?: {
    default_oversight_level?: OversightLevel;
    require_approvals_for?: unknown;
    critical_ai_prohibited?: boolean;
  };
  summary?: Record<string, unknown>;
  accountability_metrics?: Record<string, unknown>;
  pending_approvals?: HumanOversightApproval[];
  rejected_recommendations?: HumanOversightApproval[];
  high_risk_actions?: HumanOversightApproval[];
  override_trends?: Record<string, unknown>[];
  risk_distribution?: { risk_level: string; count: number }[];
  integration_links?: Record<string, string>;
  [key: string]: unknown;
};
