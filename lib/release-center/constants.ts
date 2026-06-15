export const RELEASE_TYPES = [
  "major",
  "minor",
  "hotfix",
  "security_update",
  "infrastructure_update",
  "experimental",
] as const;

export type ReleaseType = (typeof RELEASE_TYPES)[number];

export const RISK_LEVELS = ["low", "medium", "high", "critical"] as const;

export type RiskLevel = (typeof RISK_LEVELS)[number];

export const CHANGE_LOG_CATEGORIES = [
  "new_feature",
  "improvement",
  "bug_fix",
  "security_update",
  "performance",
  "deprecated",
] as const;

export type ChangeLogCategory = (typeof CHANGE_LOG_CATEGORIES)[number];

export const RELEASE_STATUSES = [
  "planned",
  "in_development",
  "internal_testing",
  "customer_validation",
  "approved",
  "released",
  "rolled_back",
] as const;

export type ReleaseStatus = (typeof RELEASE_STATUSES)[number];

export const AUDIENCES = [
  "all_customers",
  "enterprise",
  "specific_plans",
  "growth_partners",
  "internal_teams",
] as const;

export type Audience = (typeof AUDIENCES)[number];

export const APPROVAL_ROLES = ["super_admin", "product_owner", "technical_lead"] as const;

export type ApprovalRole = (typeof APPROVAL_ROLES)[number];

export const COMMUNICATION_CHANNELS = [
  "customer_portal",
  "announcement_center",
  "email",
  "in_app_notification",
] as const;

export type CommunicationChannel = (typeof COMMUNICATION_CHANNELS)[number];

export const CALENDAR_EVENT_TYPES = [
  "upcoming_release",
  "blackout_period",
  "maintenance_window",
  "enterprise_notice",
] as const;

export type CalendarEventType = (typeof CALENDAR_EVENT_TYPES)[number];

export const TYPE_BADGES: Record<ReleaseType, string> = {
  major: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  minor: "bg-blue-50 text-blue-800 ring-blue-200",
  hotfix: "bg-red-50 text-red-800 ring-red-200",
  security_update: "bg-orange-50 text-orange-900 ring-orange-200",
  infrastructure_update: "bg-gray-100 text-gray-800 ring-gray-200",
  experimental: "bg-violet-50 text-violet-800 ring-violet-200",
};

export const STATUS_BADGES: Record<ReleaseStatus, string> = {
  planned: "bg-gray-100 text-gray-800 ring-gray-200",
  in_development: "bg-sky-50 text-sky-800 ring-sky-200",
  internal_testing: "bg-indigo-50 text-indigo-800 ring-indigo-200",
  customer_validation: "bg-amber-50 text-amber-900 ring-amber-200",
  approved: "bg-teal-50 text-teal-800 ring-teal-200",
  released: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  rolled_back: "bg-red-50 text-red-800 ring-red-200",
};

export const RISK_BADGES: Record<RiskLevel, string> = {
  low: "bg-green-50 text-green-800 ring-green-200",
  medium: "bg-amber-50 text-amber-900 ring-amber-200",
  high: "bg-orange-50 text-orange-900 ring-orange-200",
  critical: "bg-red-50 text-red-800 ring-red-200",
};
