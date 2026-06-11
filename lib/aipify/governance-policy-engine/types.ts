export type PolicyCategory =
  | "ai_autonomy"
  | "approval"
  | "support"
  | "access"
  | "knowledge_publishing"
  | "integration"
  | "retention";

export type PolicyStatus = "draft" | "active" | "archived";

export type AiAutonomyLevel =
  | "advisory_only"
  | "approval_required"
  | "limited_automation"
  | "organization_defined";

export type ViolationSeverity = "informational" | "moderate" | "high" | "critical";
export type ViolationStatus = "open" | "acknowledged" | "resolved" | "dismissed";
export type ReviewStatus = "scheduled" | "completed" | "overdue" | "cancelled";

export type OrganizationPolicy = {
  id: string;
  policy_key: string;
  policy_name: string;
  description?: string | null;
  category: PolicyCategory;
  status: PolicyStatus;
  configuration: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
};

export type PolicyViolation = {
  id: string;
  policy_id: string;
  policy_name?: string;
  policy_key?: string;
  violation_type: string;
  severity: ViolationSeverity;
  description: string;
  status: ViolationStatus;
  detected_at?: string;
  acknowledged_at?: string | null;
};

export type PolicyReview = {
  id: string;
  policy_id: string;
  policy_name?: string;
  scheduled_at: string;
  owner_user_id?: string | null;
  status: ReviewStatus;
};

export type ApprovalRequirements = {
  requires_approval?: boolean;
  ai_prohibited?: boolean;
  required_approvers?: string;
  escalation_path?: string;
  autonomy_level?: AiAutonomyLevel;
  pending_approvals?: number;
};

export type GovernanceRecommendation = {
  key: string;
  title: string;
  priority?: number;
  reason?: string;
};

export type GovernancePolicyEngineCard = {
  has_organization: boolean;
  active_policies?: number;
  open_violations?: number;
  pending_approvals?: number;
  upcoming_reviews?: number;
  philosophy?: string;
};

export type GovernancePolicyEngineDashboard = {
  has_organization: boolean;
  philosophy?: string;
  safety_note?: string;
  principles?: string[];
  settings?: {
    ai_autonomy_level?: AiAutonomyLevel;
    retention_defaults?: Record<string, number>;
    review_cadence_days?: number;
  };
  active_policies: OrganizationPolicy[];
  policy_violations: PolicyViolation[];
  upcoming_reviews: PolicyReview[];
  pending_approvals: Array<{
    id: string;
    action_key: string;
    risk_level: string;
    status: string;
    created_at?: string;
  }>;
  pending_approval_count?: number;
  approval_requirements?: {
    low?: ApprovalRequirements;
    medium?: ApprovalRequirements;
    high?: ApprovalRequirements;
  };
  governance_recommendations?: GovernanceRecommendation[];
  policy_categories?: PolicyCategory[];
  autonomy_levels?: AiAutonomyLevel[];
  integrates_with?: string[];
};
