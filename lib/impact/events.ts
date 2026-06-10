import {
  METRIC_EVENT_CATEGORIES,
  METRIC_EVENT_TYPES,
  METRIC_RISK_LEVELS,
  type MetricEventCategory,
  type MetricEventType,
  type MetricRiskLevel,
} from "./types";

export function isMetricEventType(value: string): value is MetricEventType {
  return (METRIC_EVENT_TYPES as readonly string[]).includes(value);
}

export function isMetricEventCategory(value: string): value is MetricEventCategory {
  return (METRIC_EVENT_CATEGORIES as readonly string[]).includes(value);
}

export function isMetricRiskLevel(value: string): value is MetricRiskLevel {
  return (METRIC_RISK_LEVELS as readonly string[]).includes(value);
}

/** Map event types to default categories for validation hints. */
export const DEFAULT_EVENT_CATEGORY: Partial<Record<MetricEventType, MetricEventCategory>> = {
  support_cases_resolved: "support",
  support_cases_escalated: "support",
  response_time_improvement: "support",
  resolution_time_improvement: "support",
  automated_actions_completed: "automation",
  failed_actions_prevented: "automation",
  self_healing_runs_completed: "health",
  integration_issues_detected: "integration",
  integration_issues_repaired: "integration",
  emails_drafted: "support",
  recommendations_generated: "recommendations",
  recommendations_approved: "recommendations",
  recommendations_rejected: "recommendations",
  time_saved_estimate: "automation",
  customer_satisfaction_score: "satisfaction",
  system_health_event: "health",
  update_success: "updates",
  install_health_score: "install",
};
