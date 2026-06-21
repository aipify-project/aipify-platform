/**
 * Semantic status presentation — five explicit systems.
 * Always pass `type` + `value`; never infer semantics from raw strings alone.
 */

export type SemanticBadgeType =
  | "lifecycle"
  | "severity"
  | "workflow"
  | "health"
  | "access"
  | "opportunity"
  | "report";

export type OpportunityStatus =
  | "identified"
  | "recommended"
  | "review_required"
  | "qualified"
  | "in_progress"
  | "won"
  | "declined"
  | "expired";

export type ReportState =
  | "generated"
  | "generating"
  | "draft"
  | "template"
  | "failed"
  | "outdated";

export type LifecycleStatus =
  | "active"
  | "inactive"
  | "enabled"
  | "disabled"
  | "paused"
  | "archived";

export type SeverityLevel = "critical" | "high" | "medium" | "low" | "info";

export type WorkflowState =
  | "open"
  | "pending"
  | "in_progress"
  | "awaiting_approval"
  | "completed"
  | "cancelled"
  | "blocked"
  | "overdue";

export type HealthState =
  | "healthy"
  | "good"
  | "moderate"
  | "poor"
  | "critical_health"
  | "unknown";

export type AccessState = "verified" | "restricted" | "not_allowed";

export type SemanticPresentation = {
  value: string;
  labelKey: string;
  icon: string;
  badgeClassName: string;
  borderClassName: string;
  backgroundClassName: string;
  textClassName: string;
  a11yLabelKey: string;
  sortPriority: number;
};

const BLUE_BADGE = "text-violet-900 bg-violet-50 ring-violet-200";
const BLUE_BORDER = "border-l-violet-400";
const BLUE_BG = "bg-violet-50/30";
const BLUE_TEXT = "text-violet-900";

const GREEN_BADGE = "text-emerald-800 bg-emerald-50 ring-emerald-200";
const GREEN_BORDER = "border-l-emerald-400";
const GREEN_BG = "bg-emerald-50/30";
const GREEN_TEXT = "text-emerald-900";

const AMBER_BADGE = "text-amber-900 bg-amber-50 ring-amber-200";
const AMBER_BORDER = "border-l-amber-400";
const AMBER_BG = "bg-amber-50/30";
const AMBER_TEXT = "text-amber-900";

const ORANGE_BADGE = "text-orange-900 bg-orange-50 ring-orange-200";
const ORANGE_BORDER = "border-l-orange-400";
const ORANGE_BG = "bg-orange-50/20";
const ORANGE_TEXT = "text-orange-900";

const RED_BADGE = "text-red-800 bg-red-50 ring-red-200";
const RED_BORDER = "border-l-red-400";
const RED_BG = "bg-red-50/20";
const RED_TEXT = "text-red-900";

const GREY_BADGE = "text-aipify-text-secondary bg-aipify-surface-muted ring-aipify-border";
const GREY_BORDER = "border-l-aipify-border";
const GREY_BG = "bg-aipify-surface-muted/40";
const GREY_TEXT = "text-aipify-text-secondary";

const SLATE_WORKFLOW_BADGE = "text-slate-700 bg-slate-100 ring-slate-200";

function basePresentation(
  value: string,
  labelKey: string,
  icon: string,
  badgeClassName: string,
  borderClassName: string,
  backgroundClassName: string,
  textClassName: string,
  a11yLabelKey: string,
  sortPriority: number
): SemanticPresentation {
  return {
    value,
    labelKey,
    icon,
    badgeClassName,
    borderClassName,
    backgroundClassName,
    textClassName,
    a11yLabelKey,
    sortPriority,
  };
}

function normalizeSemanticValue(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/-/g, "_")
    .replace(/\s+/g, "_");
}

const LIFECYCLE_PRESENTATIONS: Record<LifecycleStatus, SemanticPresentation> = {
  active: basePresentation(
    "active",
    "common.status.semantic.lifecycle.active",
    "●",
    BLUE_BADGE,
    BLUE_BORDER,
    BLUE_BG,
    BLUE_TEXT,
    "common.status.semantic.a11y.lifecycle",
    10
  ),
  inactive: basePresentation(
    "inactive",
    "common.status.semantic.lifecycle.inactive",
    "○",
    GREY_BADGE,
    GREY_BORDER,
    GREY_BG,
    GREY_TEXT,
    "common.status.semantic.a11y.lifecycle",
    80
  ),
  enabled: basePresentation(
    "enabled",
    "common.status.semantic.lifecycle.enabled",
    "●",
    BLUE_BADGE,
    BLUE_BORDER,
    BLUE_BG,
    BLUE_TEXT,
    "common.status.semantic.a11y.lifecycle",
    15
  ),
  disabled: basePresentation(
    "disabled",
    "common.status.semantic.lifecycle.disabled",
    "○",
    GREY_BADGE,
    GREY_BORDER,
    GREY_BG,
    GREY_TEXT,
    "common.status.semantic.a11y.lifecycle",
    85
  ),
  paused: basePresentation(
    "paused",
    "common.status.semantic.lifecycle.paused",
    "⏸",
    GREY_BADGE,
    GREY_BORDER,
    GREY_BG,
    GREY_TEXT,
    "common.status.semantic.a11y.lifecycle",
    70
  ),
  archived: basePresentation(
    "archived",
    "common.status.semantic.lifecycle.archived",
    "📦",
    GREY_BADGE,
    GREY_BORDER,
    GREY_BG,
    GREY_TEXT,
    "common.status.semantic.a11y.lifecycle",
    90
  ),
};

const SEVERITY_PRESENTATIONS: Record<SeverityLevel, SemanticPresentation> = {
  critical: basePresentation(
    "critical",
    "common.status.semantic.severity.critical",
    "❌",
    RED_BADGE,
    RED_BORDER,
    RED_BG,
    RED_TEXT,
    "common.status.semantic.a11y.severity",
    1
  ),
  high: basePresentation(
    "high",
    "common.status.semantic.severity.high",
    "⚠️",
    ORANGE_BADGE,
    ORANGE_BORDER,
    ORANGE_BG,
    ORANGE_TEXT,
    "common.status.semantic.a11y.severity",
    2
  ),
  medium: basePresentation(
    "medium",
    "common.status.semantic.severity.medium",
    "⚠️",
    AMBER_BADGE,
    AMBER_BORDER,
    AMBER_BG,
    AMBER_TEXT,
    "common.status.semantic.a11y.severity",
    3
  ),
  low: basePresentation(
    "low",
    "common.status.semantic.severity.low",
    "ℹ️",
    BLUE_BADGE,
    BLUE_BORDER,
    BLUE_BG,
    BLUE_TEXT,
    "common.status.semantic.a11y.severity",
    4
  ),
  info: basePresentation(
    "info",
    "common.status.semantic.severity.info",
    "ℹ️",
    BLUE_BADGE,
    BLUE_BORDER,
    BLUE_BG,
    BLUE_TEXT,
    "common.status.semantic.a11y.severity",
    5
  ),
};

const WORKFLOW_PRESENTATIONS: Record<WorkflowState, SemanticPresentation> = {
  open: basePresentation(
    "open",
    "common.status.semantic.workflow.open",
    "●",
    BLUE_BADGE,
    BLUE_BORDER,
    BLUE_BG,
    BLUE_TEXT,
    "common.status.semantic.a11y.workflow",
    20
  ),
  pending: basePresentation(
    "pending",
    "common.status.semantic.workflow.pending",
    "⏳",
    SLATE_WORKFLOW_BADGE,
    "border-l-slate-400",
    "bg-slate-50/40",
    "text-slate-700",
    "common.status.semantic.a11y.workflow",
    30
  ),
  in_progress: basePresentation(
    "in_progress",
    "common.status.semantic.workflow.inProgress",
    "●",
    BLUE_BADGE,
    BLUE_BORDER,
    BLUE_BG,
    BLUE_TEXT,
    "common.status.semantic.a11y.workflow",
    25
  ),
  awaiting_approval: basePresentation(
    "awaiting_approval",
    "common.status.semantic.workflow.awaitingApproval",
    "⏳",
    SLATE_WORKFLOW_BADGE,
    "border-l-violet-300",
    "bg-violet-50/20",
    "text-violet-900",
    "common.status.semantic.a11y.workflow",
    35
  ),
  completed: basePresentation(
    "completed",
    "common.status.semantic.workflow.completed",
    "✅",
    GREEN_BADGE,
    GREEN_BORDER,
    GREEN_BG,
    GREEN_TEXT,
    "common.status.semantic.a11y.workflow",
    60
  ),
  cancelled: basePresentation(
    "cancelled",
    "common.status.semantic.workflow.cancelled",
    "○",
    GREY_BADGE,
    GREY_BORDER,
    GREY_BG,
    GREY_TEXT,
    "common.status.semantic.a11y.workflow",
    75
  ),
  blocked: basePresentation(
    "blocked",
    "common.status.semantic.workflow.blocked",
    "❌",
    RED_BADGE,
    RED_BORDER,
    RED_BG,
    RED_TEXT,
    "common.status.semantic.a11y.workflow",
    5
  ),
  overdue: basePresentation(
    "overdue",
    "common.status.semantic.workflow.overdue",
    "⚠️",
    AMBER_BADGE,
    AMBER_BORDER,
    AMBER_BG,
    AMBER_TEXT,
    "common.status.semantic.a11y.workflow",
    15
  ),
};

const HEALTH_PRESENTATIONS: Record<HealthState, SemanticPresentation> = {
  healthy: basePresentation(
    "healthy",
    "common.status.semantic.health.healthy",
    "✅",
    GREEN_BADGE,
    GREEN_BORDER,
    GREEN_BG,
    GREEN_TEXT,
    "common.status.semantic.a11y.health",
    10
  ),
  good: basePresentation(
    "good",
    "common.status.semantic.health.good",
    "✅",
    GREEN_BADGE,
    GREEN_BORDER,
    GREEN_BG,
    GREEN_TEXT,
    "common.status.semantic.a11y.health",
    15
  ),
  moderate: basePresentation(
    "moderate",
    "common.status.semantic.health.moderate",
    "●",
    AMBER_BADGE,
    AMBER_BORDER,
    AMBER_BG,
    AMBER_TEXT,
    "common.status.semantic.a11y.organizationalHealth",
    40
  ),
  poor: basePresentation(
    "poor",
    "common.status.semantic.health.poor",
    "⚠️",
    ORANGE_BADGE,
    ORANGE_BORDER,
    ORANGE_BG,
    ORANGE_TEXT,
    "common.status.semantic.a11y.health",
    60
  ),
  critical_health: basePresentation(
    "critical_health",
    "common.status.semantic.health.criticalHealth",
    "❌",
    RED_BADGE,
    RED_BORDER,
    RED_BG,
    RED_TEXT,
    "common.status.semantic.a11y.health",
    80
  ),
  unknown: basePresentation(
    "unknown",
    "common.status.semantic.health.unknown",
    "○",
    GREY_BADGE,
    GREY_BORDER,
    GREY_BG,
    GREY_TEXT,
    "common.status.semantic.a11y.health",
    90
  ),
};

const ACCESS_PRESENTATIONS: Record<AccessState, SemanticPresentation> = {
  verified: basePresentation(
    "verified",
    "common.status.semantic.access.verified",
    "🛡️",
    GREEN_BADGE,
    GREEN_BORDER,
    GREEN_BG,
    GREEN_TEXT,
    "common.status.semantic.a11y.access",
    10
  ),
  restricted: basePresentation(
    "restricted",
    "common.status.semantic.access.restricted",
    "🔒",
    "text-violet-900 bg-violet-50 ring-violet-200",
    "border-l-violet-400",
    "bg-violet-50/30",
    "text-violet-900",
    "common.status.semantic.a11y.access",
    50
  ),
  not_allowed: basePresentation(
    "not_allowed",
    "common.status.semantic.access.notAllowed",
    "❌",
    RED_BADGE,
    RED_BORDER,
    RED_BG,
    RED_TEXT,
    "common.status.semantic.a11y.access",
    90
  ),
};

const LIFECYCLE_ALIASES: Record<string, LifecycleStatus> = {
  active: "active",
  inactive: "inactive",
  enabled: "enabled",
  disabled: "disabled",
  paused: "paused",
  archived: "archived",
  operational: "active",
};

const SEVERITY_ALIASES: Record<string, SeverityLevel> = {
  critical: "critical",
  high: "high",
  medium: "medium",
  low: "low",
  info: "info",
  information: "info",
  urgent: "high",
  attention: "medium",
  attention_required: "medium",
  needs_attention: "medium",
};

const WORKFLOW_ALIASES: Record<string, WorkflowState> = {
  open: "open",
  pending: "pending",
  in_progress: "in_progress",
  awaiting_approval: "awaiting_approval",
  completed: "completed",
  cancelled: "cancelled",
  blocked: "blocked",
  overdue: "overdue",
  waiting: "pending",
  scheduled: "pending",
  draft: "open",
};

const HEALTH_ALIASES: Record<string, HealthState> = {
  healthy: "healthy",
  good: "good",
  moderate: "moderate",
  poor: "poor",
  critical_health: "critical_health",
  critical: "critical_health",
  unknown: "unknown",
  needs_attention: "poor",
  at_risk: "poor",
  degraded: "moderate",
};

const ACCESS_ALIASES: Record<string, AccessState> = {
  verified: "verified",
  restricted: "restricted",
  not_allowed: "not_allowed",
  denied: "not_allowed",
  access_denied: "not_allowed",
};

export function getLifecycleStatusPresentation(status: unknown): SemanticPresentation {
  const key = normalizeSemanticValue(status);
  const canonical = LIFECYCLE_ALIASES[key] ?? "inactive";
  return LIFECYCLE_PRESENTATIONS[canonical];
}

export function getSeverityPresentation(severity: unknown): SemanticPresentation {
  const key = normalizeSemanticValue(severity);
  const canonical = SEVERITY_ALIASES[key] ?? "info";
  return SEVERITY_PRESENTATIONS[canonical];
}

export function getWorkflowStatePresentation(state: unknown): SemanticPresentation {
  const key = normalizeSemanticValue(state);
  const canonical = WORKFLOW_ALIASES[key] ?? "open";
  return WORKFLOW_PRESENTATIONS[canonical];
}

export function getHealthPresentation(health: unknown): SemanticPresentation {
  const key = normalizeSemanticValue(health);
  const canonical = HEALTH_ALIASES[key] ?? "unknown";
  return HEALTH_PRESENTATIONS[canonical];
}

export function getAccessPresentation(access: unknown): SemanticPresentation {
  const key = normalizeSemanticValue(access);
  const canonical = ACCESS_ALIASES[key] ?? "restricted";
  return ACCESS_PRESENTATIONS[canonical];
}

const OPPORTUNITY_PRESENTATIONS: Record<OpportunityStatus, SemanticPresentation> = {
  identified: basePresentation(
    "identified",
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.identified",
    "💡",
    BLUE_BADGE,
    BLUE_BORDER,
    BLUE_BG,
    BLUE_TEXT,
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.a11y",
    20
  ),
  recommended: basePresentation(
    "recommended",
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.recommended",
    "✨",
    "text-violet-900 bg-violet-50 ring-violet-200",
    "border-l-violet-400",
    "bg-violet-50/30",
    "text-violet-900",
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.a11y",
    15
  ),
  review_required: basePresentation(
    "review_required",
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.reviewRequired",
    "👀",
    SLATE_WORKFLOW_BADGE,
    "border-l-slate-400",
    "bg-slate-50/40",
    "text-slate-700",
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.a11y",
    30
  ),
  qualified: basePresentation(
    "qualified",
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.qualified",
    "✅",
    GREEN_BADGE,
    GREEN_BORDER,
    GREEN_BG,
    GREEN_TEXT,
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.a11y",
    10
  ),
  in_progress: basePresentation(
    "in_progress",
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.inProgress",
    "🔄",
    BLUE_BADGE,
    BLUE_BORDER,
    BLUE_BG,
    BLUE_TEXT,
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.a11y",
    25
  ),
  won: basePresentation(
    "won",
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.won",
    "🏆",
    GREEN_BADGE,
    GREEN_BORDER,
    GREEN_BG,
    GREEN_TEXT,
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.a11y",
    5
  ),
  declined: basePresentation(
    "declined",
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.declined",
    "○",
    GREY_BADGE,
    GREY_BORDER,
    GREY_BG,
    GREY_TEXT,
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.a11y",
    70
  ),
  expired: basePresentation(
    "expired",
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.expired",
    "⏱",
    GREY_BADGE,
    GREY_BORDER,
    GREY_BG,
    GREY_TEXT,
    "customerApp.executiveCommandCenter.tabs.opportunityStatus.a11y",
    80
  ),
};

const REPORT_PRESENTATIONS: Record<ReportState, SemanticPresentation> = {
  generated: basePresentation(
    "generated",
    "customerApp.executiveCommandCenter.tabs.reportState.generated",
    "✅",
    GREEN_BADGE,
    GREEN_BORDER,
    GREEN_BG,
    GREEN_TEXT,
    "customerApp.executiveCommandCenter.tabs.reportState.a11y",
    10
  ),
  generating: basePresentation(
    "generating",
    "customerApp.executiveCommandCenter.tabs.reportState.generating",
    "🔄",
    BLUE_BADGE,
    BLUE_BORDER,
    BLUE_BG,
    BLUE_TEXT,
    "customerApp.executiveCommandCenter.tabs.reportState.a11y",
    20
  ),
  draft: basePresentation(
    "draft",
    "customerApp.executiveCommandCenter.tabs.reportState.draft",
    "📝",
    SLATE_WORKFLOW_BADGE,
    "border-l-slate-400",
    "bg-slate-50/40",
    "text-slate-700",
    "customerApp.executiveCommandCenter.tabs.reportState.a11y",
    30
  ),
  template: basePresentation(
    "template",
    "customerApp.executiveCommandCenter.tabs.reportState.template",
    "📋",
    GREY_BADGE,
    GREY_BORDER,
    GREY_BG,
    GREY_TEXT,
    "customerApp.executiveCommandCenter.tabs.reportState.a11y",
    40
  ),
  failed: basePresentation(
    "failed",
    "customerApp.executiveCommandCenter.tabs.reportState.failed",
    "❌",
    RED_BADGE,
    RED_BORDER,
    RED_BG,
    RED_TEXT,
    "customerApp.executiveCommandCenter.tabs.reportState.a11y",
    5
  ),
  outdated: basePresentation(
    "outdated",
    "customerApp.executiveCommandCenter.tabs.reportState.outdated",
    "⏳",
    SLATE_WORKFLOW_BADGE,
    "border-l-amber-300",
    "bg-amber-50/20",
    "text-amber-900",
    "customerApp.executiveCommandCenter.tabs.reportState.a11y",
    50
  ),
};

const OPPORTUNITY_ALIASES: Record<string, OpportunityStatus> = {
  identified: "identified",
  recommended: "recommended",
  review_required: "review_required",
  qualified: "qualified",
  in_progress: "in_progress",
  won: "won",
  declined: "declined",
  expired: "expired",
  open: "identified",
  active: "in_progress",
  available: "recommended",
  attention: "review_required",
  information: "identified",
};

const REPORT_ALIASES: Record<string, ReportState> = {
  generated: "generated",
  generating: "generating",
  draft: "draft",
  template: "template",
  failed: "failed",
  outdated: "outdated",
  available: "generated",
  ready: "generated",
  published: "generated",
};

export function getOpportunityStatusPresentation(status: unknown): SemanticPresentation {
  const key = normalizeSemanticValue(status);
  const canonical = OPPORTUNITY_ALIASES[key] ?? "identified";
  return OPPORTUNITY_PRESENTATIONS[canonical];
}

export function getReportStatePresentation(state: unknown): SemanticPresentation {
  const key = normalizeSemanticValue(state);
  const canonical = REPORT_ALIASES[key] ?? "draft";
  return REPORT_PRESENTATIONS[canonical];
}

export function getSemanticPresentation(type: SemanticBadgeType, value: unknown): SemanticPresentation {
  switch (type) {
    case "lifecycle":
      return getLifecycleStatusPresentation(value);
    case "severity":
      return getSeverityPresentation(value);
    case "workflow":
      return getWorkflowStatePresentation(value);
    case "health":
      return getHealthPresentation(value);
    case "access":
      return getAccessPresentation(value);
    case "opportunity":
      return getOpportunityStatusPresentation(value);
    case "report":
      return getReportStatePresentation(value);
    default:
      return getSeverityPresentation("info");
  }
}

/** Map executive priority strings to severity levels (never workflow). */
export function mapExecutivePriorityToSeverity(priority: unknown): SeverityLevel {
  const key = normalizeSemanticValue(priority);
  return SEVERITY_ALIASES[key] ?? "medium";
}

/** Map health score (0–100) to canonical health state bands (85 / 70 / 50). */
export function mapHealthScoreToHealthState(score: number): HealthState {
  if (score >= 85) return "healthy";
  if (score >= 70) return "moderate";
  if (score >= 50) return "poor";
  return "critical_health";
}

export type EccMetricBadgeConfig = {
  type: SemanticBadgeType;
  value: string;
  labelKey: string;
  a11yLabelKey: string;
};

export function getEccHealthMetricBadge(score: number): EccMetricBadgeConfig {
  const health = mapHealthScoreToHealthState(score);
  const presentation = getHealthPresentation(health);
  return {
    type: "health",
    value: health,
    labelKey: presentation.labelKey,
    a11yLabelKey: presentation.a11yLabelKey,
  };
}

export function getEccSinceLastLoginMetricBadge(count: number): EccMetricBadgeConfig | null {
  if (count <= 0) return null;
  return {
    type: "severity",
    value: "info",
    labelKey: "customerApp.executiveCommandCenter.premium.metrics.sinceLastLoginUpdated",
    a11yLabelKey: "customerApp.executiveCommandCenter.premium.metrics.sinceLastLoginUpdated",
  };
}

export function getEccOpenAlertsMetricBadge(count: number): EccMetricBadgeConfig | null {
  if (count <= 0) {
    return {
      type: "workflow",
      value: "completed",
      labelKey: "customerApp.executiveCommandCenter.premium.metrics.countNone",
      a11yLabelKey: "common.status.semantic.a11y.workflow",
    };
  }
  return {
    type: "workflow",
    value: "open",
    labelKey: "common.status.semantic.workflow.open",
    a11yLabelKey: "common.status.semantic.a11y.workflow",
  };
}

export function getEccPendingActionsMetricBadge(count: number): EccMetricBadgeConfig | null {
  if (count <= 0) {
    return {
      type: "workflow",
      value: "completed",
      labelKey: "customerApp.executiveCommandCenter.premium.metrics.countNone",
      a11yLabelKey: "common.status.semantic.a11y.workflow",
    };
  }
  return {
    type: "workflow",
    value: "pending",
    labelKey: "common.status.semantic.workflow.pending",
    a11yLabelKey: "common.status.semantic.a11y.workflow",
  };
}

export function getEccCriticalItemsMetricBadge(count: number): EccMetricBadgeConfig {
  if (count <= 0) {
    return {
      type: "workflow",
      value: "completed",
      labelKey: "customerApp.executiveCommandCenter.premium.metrics.noCriticalItems",
      a11yLabelKey: "customerApp.executiveCommandCenter.premium.metrics.noCriticalItems",
    };
  }
  return {
    type: "severity",
    value: "critical",
    labelKey: "common.status.semantic.severity.critical",
    a11yLabelKey: "common.status.semantic.a11y.severity",
  };
}

export type ReliabilitySemanticMapping = {
  type: SemanticBadgeType;
  value: string;
};

/** Cross-portal reliability / system-health status → explicit semantic type. */
export function mapReliabilityStatusToSemantic(status: unknown): ReliabilitySemanticMapping {
  const key = normalizeSemanticValue(status);
  switch (key) {
    case "operational":
    case "healthy":
    case "connected":
    case "valid":
    case "passed":
    case "resolved":
    case "completed":
    case "active":
    case "enabled":
      return { type: "health", value: "healthy" };
    case "verified_restored":
    case "verified":
      return { type: "access", value: "verified" };
    case "degraded":
    case "moderate":
      return { type: "health", value: "moderate" };
    case "needs_attention":
    case "at_risk":
    case "attention":
      return { type: "severity", value: "medium" };
    case "expiring":
    case "delayed":
      return { type: "workflow", value: "overdue" };
    case "disruption":
    case "failed":
    case "critical":
      return { type: "severity", value: "critical" };
    case "expired":
      return { type: "access", value: "not_allowed" };
    case "recovery":
    case "pending":
    case "scheduled":
    case "waiting":
    case "investigating":
      return { type: "workflow", value: "pending" };
    case "restricted":
      return { type: "access", value: "restricted" };
    case "planned_maintenance":
    case "information":
    case "draft":
    case "open":
      return { type: "workflow", value: "open" };
    case "in_progress":
      return { type: "workflow", value: "in_progress" };
    case "blocked":
      return { type: "workflow", value: "blocked" };
    case "paused":
      return { type: "lifecycle", value: "paused" };
    case "inactive":
    case "disabled":
      return { type: "lifecycle", value: "inactive" };
    default:
      return { type: "severity", value: "info" };
  }
}

export type BusinessContinuitySemanticMapping = ReliabilitySemanticMapping;

export function mapBusinessContinuityStatusToSemantic(statusKey: unknown): BusinessContinuitySemanticMapping {
  const key = normalizeSemanticValue(statusKey);
  switch (key) {
    case "verified":
    case "operational":
    case "active":
    case "completed":
      return { type: "lifecycle", value: "active" };
    case "restricted":
    case "critical_unavailable":
      return { type: "access", value: "restricted" };
    case "continuity_risk":
    case "attention":
    case "elevated":
      return { type: "severity", value: "high" };
    case "waiting":
    case "pending":
      return { type: "workflow", value: "pending" };
    case "not_allowed":
    case "failed":
      return { type: "severity", value: "critical" };
    default:
      return { type: "workflow", value: "open" };
  }
}

export function mapChangeOperationStatusToSemantic(status: unknown): ReliabilitySemanticMapping {
  const key = normalizeSemanticValue(status);
  switch (key) {
    case "completed":
    case "deployed":
    case "resolved":
      return { type: "workflow", value: "completed" };
    case "pending":
    case "scheduled":
    case "awaiting_approval":
      return { type: "workflow", value: "awaiting_approval" };
    case "in_progress":
    case "executing":
      return { type: "workflow", value: "in_progress" };
    case "blocked":
    case "failed":
    case "rejected":
      return { type: "workflow", value: "blocked" };
    case "cancelled":
      return { type: "workflow", value: "cancelled" };
    case "overdue":
      return { type: "workflow", value: "overdue" };
    case "critical":
      return { type: "severity", value: "critical" };
    case "at_risk":
    case "attention":
      return { type: "severity", value: "medium" };
    default:
      return { type: "workflow", value: "open" };
  }
}
