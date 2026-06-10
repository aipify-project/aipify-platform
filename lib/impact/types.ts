/** Phase 21 — Anonymised impact metrics (counts only, no private content). */

export const IMPACT_PLATFORM_ROUTE = "/platform/impact";
export const IMPACT_METRIC_API_PREFIX = "/api/install/metric-event";
export const MARKETING_PROOF_API_PREFIX = "/api/platform/impact/marketing-proof";

export const MINIMUM_MARKETING_GROUP_SIZE = 5;

export const METRIC_EVENT_TYPES = [
  "support_cases_resolved",
  "support_cases_escalated",
  "response_time_improvement",
  "resolution_time_improvement",
  "automated_actions_completed",
  "failed_actions_prevented",
  "self_healing_runs_completed",
  "integration_issues_detected",
  "integration_issues_repaired",
  "emails_drafted",
  "recommendations_generated",
  "recommendations_approved",
  "recommendations_rejected",
  "time_saved_estimate",
  "customer_satisfaction_score",
  "system_health_event",
  "update_success",
  "install_health_score",
] as const;

export type MetricEventType = (typeof METRIC_EVENT_TYPES)[number];

export const METRIC_EVENT_CATEGORIES = [
  "support",
  "automation",
  "integration",
  "recommendations",
  "health",
  "updates",
  "install",
  "satisfaction",
] as const;

export type MetricEventCategory = (typeof METRIC_EVENT_CATEGORIES)[number];

export const METRIC_RISK_LEVELS = ["low", "medium", "high", "critical"] as const;

export type MetricRiskLevel = (typeof METRIC_RISK_LEVELS)[number];

export const IMPACT_AUDIT_EVENT_TYPES = [
  "metric_event_created",
  "metric_aggregation_completed",
  "marketing_export_generated",
  "report_downloaded",
  "public_metric_approved",
] as const;

export type ImpactAuditEventType = (typeof IMPACT_AUDIT_EVENT_TYPES)[number];

export type PlatformImpactDashboard = {
  support_cases_resolved: number;
  automated_actions_completed: number;
  recommendations_generated: number;
  self_healing_runs_completed: number;
  response_time_improvement_minutes: number;
  time_saved_minutes: number;
  year_to_date_tenants: number;
  minimum_group_size: number;
  public_marketing_allowed: boolean;
  monthly_trend: Array<{
    year: number;
    month: number;
    total_events: number;
    support_resolved: number;
    actions_completed: number;
  }>;
  principle?: string;
};

export type MarketingProofResult = {
  year: number;
  tenant_count: number;
  minimum_group_size: number;
  public_marketing_allowed: boolean;
  usage: "public_marketing" | "internal_only";
  statements: string[];
};
