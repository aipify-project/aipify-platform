export const POLICY_CATEGORIES = [
  "security",
  "privacy",
  "data_handling",
  "billing",
  "customer_communications",
  "ai_governance",
  "operational_standards",
] as const;

export type PolicyCategory = (typeof POLICY_CATEGORIES)[number];

export const POLICY_STATUSES = ["draft", "active", "under_review", "archived"] as const;

export type PolicyStatus = (typeof POLICY_STATUSES)[number];

export const RISK_LEVELS = ["low", "medium", "high", "critical"] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];

export const APPROVAL_PRIORITIES = ["low", "medium", "high", "critical"] as const;

export type ApprovalPriority = (typeof APPROVAL_PRIORITIES)[number];

export const APPROVAL_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "changes_requested",
  "escalated",
] as const;

export type ApprovalStatus = (typeof APPROVAL_STATUSES)[number];

export const RETENTION_DATA_TYPES = [
  "support_data",
  "audit_logs",
  "feedback_records",
  "customer_activity_logs",
  "knowledge_articles",
] as const;

export type RetentionDataType = (typeof RETENTION_DATA_TYPES)[number];

export const ACCESS_RECORD_TYPES = [
  "role_assignment",
  "privileged_user",
  "super_admin_access",
  "permission_exception",
] as const;

export type AccessRecordType = (typeof ACCESS_RECORD_TYPES)[number];

export const ALERT_TYPES = [
  "overdue_policy_review",
  "expired_approval",
  "excessive_privilege",
  "high_risk_action",
  "governance_violation",
] as const;

export type AlertType = (typeof ALERT_TYPES)[number];

export const GOVERNANCE_MODULES = [
  "policy_management",
  "approval_workflows",
  "data_retention_controls",
  "access_governance",
  "security_governance",
  "compliance_reporting",
] as const;

export type GovernanceModule = (typeof GOVERNANCE_MODULES)[number];

export const STATUS_BADGES: Record<PolicyStatus, string> = {
  draft: "bg-gray-100 text-gray-800 ring-gray-200",
  active: "bg-green-50 text-green-800 ring-green-200",
  under_review: "bg-amber-50 text-amber-900 ring-amber-200",
  archived: "bg-slate-100 text-slate-700 ring-slate-200",
};

export const RISK_BADGES: Record<RiskLevel, string> = {
  low: "bg-sky-50 text-sky-800 ring-sky-200",
  medium: "bg-amber-50 text-amber-900 ring-amber-200",
  high: "bg-orange-50 text-orange-900 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};
