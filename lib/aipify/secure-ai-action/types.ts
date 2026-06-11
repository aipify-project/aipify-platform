export type AiActionCatalogItem = {
  action_key: string;
  category: string;
  risk_level: string;
  title: string;
  enabled: boolean;
  requires_approval: boolean;
  rollback_supported?: boolean;
};

export type AiActionRequest = {
  id: string;
  action_key: string;
  risk_level: string;
  status: string;
  recommendation?: Record<string, unknown>;
  created_at?: string;
  executed_at?: string | null;
  execution_result?: Record<string, unknown> | null;
};

export type RiskDistribution = {
  risk_level: string;
  count: number;
};

export type ApprovalStatistics = {
  approved: number;
  rejected: number;
  pending: number;
  failed: number;
};

export type SecureAiActionCard = {
  has_organization: boolean;
  pending_approvals?: number;
  philosophy?: string;
};

export type SecureAiActionDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  pending_approvals?: number;
  failed_executions?: number;
  executed_count?: number;
  approval_statistics?: ApprovalStatistics;
  risk_distribution: RiskDistribution[];
  action_catalog: AiActionCatalogItem[];
  recent_requests: AiActionRequest[];
  categories?: string[];
};
