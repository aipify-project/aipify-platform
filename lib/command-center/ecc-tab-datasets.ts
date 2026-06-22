import {
  getSeverityPresentation,
  mapExecutivePriorityToSeverity,
  mapHealthScoreToHealthState,
  type SemanticBadgeType,
  type SeverityLevel,
} from "@/lib/design/semantic-status-system";
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";

export type CommandCenterBadge = {
  type: SemanticBadgeType;
  value: string;
  labelKey: string;
};

export type CommandCenterItem = {
  id: string;
  dedupeKey: string;
  title: string;
  description: string;
  source?: string;
  itemType?: string;
  timestamp?: string;
  count: number;
  href: string;
  actionLabelKey: string;
  primaryBadge: CommandCenterBadge;
  secondaryBadge?: CommandCenterBadge;
  healthScore?: number;
  blockedSummary?: string;
  requester?: string;
  valueLabel?: string;
  confidenceLabel?: string;
  nextStep?: string;
  supportsPdf?: boolean;
  supportsWord?: boolean;
  severityRank: number;
};

export type EccOverviewCounts = {
  sinceLastLoginItems: number;
  openAlerts: number;
  pendingActions: number;
  openOpportunities: number;
  criticalItems: number;
};

const SYNTHETIC_TEXT_PATTERN =
  /\b(synthetic|layout testing|layout test|mock data|mock record|demo dataset|design validation|test description|lorem ipsum|validation dataset|since last login validation|synthetic activity)\b/i;
const SYNTHETIC_KEY_PREFIX = /^ps620:/i;

const RISK_ALERT_TYPES = new Set([
  "customer_risk",
  "revenue_decline",
  "security",
  "compliance",
  "risk",
  "approval_delay",
]);

const REPORT_TITLE_OVERRIDES: Record<string, string> = {
  monthly_mbr: "Monthly Business Review",
  mbr: "Monthly Business Review",
  quarterly_qbr: "Quarterly Business Review",
  qbr: "Quarterly Business Review",
  executive_summary: "Executive Summary",
  board_summary: "Board Summary",
  annual: "Annual Summary",
};

export function isEccDemoModeEnabled(): boolean {
  return process.env.NEXT_PUBLIC_ECC_DEMO_MODE === "true";
}

export function containsSyntheticEccText(...fields: string[]): boolean {
  const text = fields.filter(Boolean).join(" ");
  if (!text.trim()) return false;
  if (SYNTHETIC_TEXT_PATTERN.test(text)) return true;
  return SYNTHETIC_KEY_PREFIX.test(text);
}

export function isSyntheticEccRecord(record: Record<string, unknown>): boolean {
  if (isEccDemoModeEnabled()) return false;

  const idFields = [
    record.alert_key,
    record.alert_id,
    record.action_key,
    record.approval_id,
    record.opportunity_key,
    record.opportunity_id,
    record.health_key,
    record.report_key,
    record.report_id,
    record.briefing_key,
    record.item_key,
    record.source_record_id,
    record.id,
  ].map((value) => String(value ?? ""));

  if (idFields.some((value) => SYNTHETIC_KEY_PREFIX.test(value))) return true;

  const textFields = [
    record.alert_title,
    record.action_title,
    record.opportunity_title,
    record.health_title,
    record.report_title,
    record.briefing_title,
    record.item_title,
    record.title,
    record.summary,
    record.companion_recommendation,
    record.recommendation,
    record.description,
  ]
    .map((value) => String(value ?? ""))
    .join(" ");

  return SYNTHETIC_TEXT_PATTERN.test(textFields);
}

function normalizeTitleKey(title: string): string {
  return title.trim().toLowerCase().replace(/[^\w\s]/g, "").replace(/\s+/g, " ");
}

function parseTimestamp(record: Record<string, unknown>): string | undefined {
  for (const field of ["occurred_at", "updated_at", "due_at", "created_at", "timestamp"]) {
    const value = record[field];
    if (typeof value === "string" && value.trim()) return value;
  }
  return undefined;
}

function severityRank(value: unknown): number {
  const severity = mapExecutivePriorityToSeverity(value);
  return getSeverityPresentation(severity).sortPriority;
}

function resolveRecordId(record: Record<string, unknown>, fallbacks: string[]): string {
  for (const field of [
    "alert_id",
    "approval_id",
    "risk_id",
    "opportunity_id",
    "report_id",
    "source_record_id",
    "alert_key",
    "action_key",
    "opportunity_key",
    "health_key",
    "report_key",
    "briefing_key",
    "item_key",
    "event_key",
    "id",
    ...fallbacks,
  ]) {
    const value = record[field];
    if (value !== undefined && value !== null && String(value).trim()) return String(value);
  }
  return "";
}

function resolveDedupeKey(record: Record<string, unknown>, namespace: string, title: string): string {
  const id = resolveRecordId(record, []);
  if (id) return `${namespace}:${id}`;

  const sourceRecord = String(record.source_record_id ?? "").trim();
  if (sourceRecord) return `${namespace}:source:${sourceRecord}`;

  return `${namespace}:title:${normalizeTitleKey(title)}`;
}

function pickPreferredRecord(
  existing: CommandCenterItem,
  candidate: CommandCenterItem
): CommandCenterItem {
  if (candidate.severityRank < existing.severityRank) return candidate;
  if (candidate.severityRank > existing.severityRank) return existing;

  const existingTs = existing.timestamp ? Date.parse(existing.timestamp) : 0;
  const candidateTs = candidate.timestamp ? Date.parse(candidate.timestamp) : 0;
  if (candidateTs > existingTs) return candidate;
  return existing;
}

export function deduplicateCommandCenterItems(items: CommandCenterItem[]): CommandCenterItem[] {
  const byKey = new Map<string, CommandCenterItem>();

  for (const item of items) {
    const existing = byKey.get(item.dedupeKey);
    if (!existing) {
      byKey.set(item.dedupeKey, item);
      continue;
    }
    byKey.set(item.dedupeKey, pickPreferredRecord(existing, item));
  }

  return [...byKey.values()];
}

export function filterRealRecords<T extends Record<string, unknown>>(records: T[]): T[] {
  return records.filter((record) => !isSyntheticEccRecord(record));
}

function resolveAlertHref(record: Record<string, unknown>): string {
  if (typeof record.record_href === "string" && record.record_href.startsWith("/")) {
    return record.record_href;
  }

  const alertType = String(record.alert_type ?? "").toLowerCase();
  switch (alertType) {
    case "approval_delay":
      return "/app/approvals";
    case "customer_risk":
      return "/app/command-center/risks";
    case "security":
      return "/app/settings/security";
    case "invoice_overdue":
      return "/app/settings/billing";
    default:
      return `/app/command-center/alerts?highlight=${encodeURIComponent(resolveRecordId(record, ["alert_key"]))}`;
  }
}

function resolveAlertActionLabelKey(record: Record<string, unknown>): string {
  const alertType = String(record.alert_type ?? "").toLowerCase();
  switch (alertType) {
    case "approval_delay":
      return "customerApp.executiveCommandCenter.tabs.alerts.actions.reviewApproval";
    case "customer_risk":
      return "customerApp.executiveCommandCenter.tabs.alerts.actions.viewCustomerRisk";
    case "security":
      return "customerApp.executiveCommandCenter.tabs.alerts.actions.openSecurityReview";
    case "invoice_overdue":
      return "customerApp.executiveCommandCenter.tabs.alerts.actions.openInvoice";
    default:
      return "customerApp.executiveCommandCenter.tabs.shared.open";
  }
}

function mapAlertWorkflow(record: Record<string, unknown>): string {
  const status = String(record.alert_status ?? "open").toLowerCase();
  if (status === "pending") return "pending";
  if (status === "closed" || status === "resolved") return "completed";
  return "open";
}

export function mapAlertToItem(record: Record<string, unknown>): CommandCenterItem {
  const title = String(record.alert_title ?? "Alert");
  const priority = record.priority;
  const severity = mapExecutivePriorityToSeverity(priority);
  const id = resolveRecordId(record, ["alert_key"]) || title;

  return {
    id,
    dedupeKey: resolveDedupeKey(record, "alert", title),
    title,
    description: String(record.companion_recommendation || record.summary || ""),
    source: String(record.alert_type ?? "alert").replace(/_/g, " "),
    itemType: String(record.alert_type ?? "alert"),
    timestamp: parseTimestamp(record),
    count: 1,
    href: resolveAlertHref(record),
    actionLabelKey: resolveAlertActionLabelKey(record),
    primaryBadge: {
      type: "severity",
      value: severity,
      labelKey: severityLabelKey(severity),
    },
    secondaryBadge: {
      type: "workflow",
      value: mapAlertWorkflow(record),
      labelKey: workflowLabelKey(mapAlertWorkflow(record)),
    },
    severityRank: severityRank(priority),
  };
}

function mapApprovalWorkflow(record: Record<string, unknown>): string {
  const status = String(record.action_status ?? "pending").toLowerCase();
  if (status === "blocked") return "blocked";
  if (status === "in_progress") return "in_progress";
  if (status === "completed") return "completed";
  return "awaiting_approval";
}

export function mapApprovalToItem(record: Record<string, unknown>): CommandCenterItem {
  const title = String(record.action_title ?? "Approval");
  const priority = record.priority;
  const severity = mapExecutivePriorityToSeverity(priority);
  const id = resolveRecordId(record, ["action_key", "approval_id"]) || title;
  const href =
    typeof record.record_href === "string" && record.record_href.startsWith("/")
      ? record.record_href
      : "/app/approvals";

  return {
    id,
    dedupeKey: resolveDedupeKey(record, "approval", title),
    title,
    description: String(record.summary ?? ""),
    source: String(record.action_type ?? "approval").replace(/_/g, " "),
    itemType: String(record.action_type ?? "approval"),
    timestamp: parseTimestamp(record),
    count: 1,
    href,
    actionLabelKey: "customerApp.executiveCommandCenter.tabs.approvals.actions.review",
    primaryBadge: {
      type: "severity",
      value: severity,
      labelKey: severityLabelKey(severity),
    },
    secondaryBadge: {
      type: "workflow",
      value: mapApprovalWorkflow(record),
      labelKey: workflowLabelKey(mapApprovalWorkflow(record)),
    },
    blockedSummary: String(record.blocked_summary ?? record.summary ?? ""),
    requester: typeof record.requester === "string" ? record.requester : undefined,
    severityRank: severityRank(priority),
  };
}

export function mapRiskAlertToItem(record: Record<string, unknown>): CommandCenterItem {
  const item = mapAlertToItem(record);
  return {
    ...item,
    dedupeKey: resolveDedupeKey(record, "risk", item.title),
    actionLabelKey: "customerApp.executiveCommandCenter.tabs.risks.actions.reviewRisk",
    href: resolveAlertHref(record),
  };
}

export function mapHealthToItem(record: Record<string, unknown>): CommandCenterItem {
  const title = String(record.health_title ?? "Health signal");
  const score = Number(record.health_score ?? 0);
  const healthState = mapHealthScoreToHealthState(score);
  const id = resolveRecordId(record, ["health_key"]) || title;

  return {
    id,
    dedupeKey: resolveDedupeKey(record, "health", title),
    title,
    description: String(record.summary ?? ""),
    source: "organizational health",
    itemType: "health",
    count: 1,
    href: "/app/command-center/performance",
    actionLabelKey: "customerApp.executiveCommandCenter.tabs.performance.actions.viewHealth",
    primaryBadge: {
      type: "health",
      value: healthState,
      labelKey: healthLabelKey(healthState),
    },
    healthScore: score,
    severityRank: 100 - score,
  };
}

function mapOpportunityStatus(record: Record<string, unknown>): string {
  const explicit = String(record.opportunity_status ?? "").trim();
  if (explicit) return explicit.toLowerCase();
  const priority = String(record.priority ?? "").toLowerCase();
  if (priority === "attention") return "review_required";
  if (priority === "information") return "identified";
  return "recommended";
}

export function mapOpportunityToItem(record: Record<string, unknown>): CommandCenterItem {
  const title = String(record.opportunity_title ?? "Opportunity");
  const status = mapOpportunityStatus(record);
  const id = resolveRecordId(record, ["opportunity_key", "opportunity_id"]) || title;

  return {
    id,
    dedupeKey: resolveDedupeKey(record, "opportunity", title),
    title,
    description: String(record.recommendation || record.summary || ""),
    source: String(record.opportunity_type ?? "opportunity").replace(/_/g, " "),
    itemType: String(record.opportunity_type ?? "opportunity"),
    timestamp: parseTimestamp(record),
    count: 1,
    href:
      typeof record.record_href === "string" && record.record_href.startsWith("/")
        ? record.record_href
        : `/app/command-center/opportunities?highlight=${encodeURIComponent(id)}`,
    actionLabelKey: "customerApp.executiveCommandCenter.tabs.opportunities.actions.review",
    primaryBadge: {
      type: "opportunity",
      value: status,
      labelKey: opportunityLabelKey(status),
    },
    valueLabel: typeof record.value === "string" ? record.value : undefined,
    confidenceLabel:
      typeof record.confidence === "string"
        ? record.confidence
        : typeof record.confidence_level === "string"
          ? record.confidence_level
          : undefined,
    nextStep: typeof record.next_step === "string" ? record.next_step : String(record.recommendation ?? ""),
    severityRank: 50,
  };
}

export function normalizeReportTitle(rawTitle: string, reportType?: string): string {
  const typeKey = String(reportType ?? rawTitle).trim().toLowerCase().replace(/[\s-]+/g, "_");
  if (REPORT_TITLE_OVERRIDES[typeKey]) return REPORT_TITLE_OVERRIDES[typeKey];

  const normalized = rawTitle.replace(/\bMbr\b/gi, "Business Review").replace(/\bQbr\b/gi, "Business Review");
  if (/monthly/i.test(normalized) && /business review/i.test(normalized)) return "Monthly Business Review";
  if (/quarterly/i.test(normalized) && /business review/i.test(normalized)) return "Quarterly Business Review";
  return normalized.trim();
}

function mapReportState(record: Record<string, unknown>): string {
  const status = String(record.report_status ?? "draft").toLowerCase();
  if (status === "available") return "generated";
  return status;
}

export function mapReportToItem(record: Record<string, unknown>): CommandCenterItem {
  const reportType = String(record.report_type ?? "");
  const title = normalizeReportTitle(String(record.report_title ?? "Report"), reportType);
  const state = mapReportState(record);
  const id = resolveRecordId(record, ["report_key", "report_id"]) || title;

  const periodKey = reportType || normalizeTitleKey(title);

  return {
    id,
    dedupeKey: `report:period:${periodKey}`,
    title,
    description: String(record.summary ?? ""),
    source: reportType.replace(/_/g, " ") || "report",
    itemType: reportType || "report",
    timestamp: parseTimestamp(record),
    count: 1,
    href: `/app/command-center/companion-briefing?highlight=${encodeURIComponent(id)}`,
    actionLabelKey:
      state === "generated"
        ? "customerApp.executiveCommandCenter.tabs.briefing.actions.openReport"
        : state === "generating"
          ? "customerApp.executiveCommandCenter.tabs.briefing.actions.generateReport"
          : "customerApp.executiveCommandCenter.tabs.briefing.actions.openReport",
    primaryBadge: {
      type: "report",
      value: state,
      labelKey: reportLabelKey(state),
    },
    supportsPdf: Boolean(record.supports_pdf ?? state === "generated"),
    supportsWord: Boolean(record.supports_word),
    severityRank: 50,
  };
}

export function mapBriefingToItem(record: Record<string, unknown>): CommandCenterItem {
  const title = String(record.briefing_title ?? "Briefing");
  const briefingType = String(record.briefing_type ?? "daily_executive");
  const id = resolveRecordId(record, ["briefing_key"]) || title;
  const status = String(record.briefing_status ?? "generated").toLowerCase();

  const description =
    String(record.summary ?? "") ||
    [
      record.revenue_summary,
      record.customer_summary,
      record.risk_summary,
      record.operational_summary,
      record.growth_summary,
      record.companion_recommendations,
    ]
      .filter((part) => typeof part === "string" && part.trim())
      .slice(0, 2)
      .join(" · ");

  return {
    id,
    dedupeKey: resolveDedupeKey(record, `briefing:${briefingType}`, title),
    title,
    description,
    source: briefingType.replace(/_/g, " "),
    itemType: briefingType,
    timestamp: parseTimestamp(record),
    count: 1,
    href: `/app/command-center/companion-briefing?highlight=${encodeURIComponent(id)}`,
    actionLabelKey: "customerApp.executiveCommandCenter.tabs.briefing.actions.openBriefing",
    primaryBadge: {
      type: "report",
      value: status === "available" ? "generated" : status,
      labelKey: reportLabelKey(status === "available" ? "generated" : status),
    },
    severityRank: 50,
  };
}

export function sortBySeverity(items: CommandCenterItem[]): CommandCenterItem[] {
  return [...items].sort((a, b) => {
    if (a.severityRank !== b.severityRank) return a.severityRank - b.severityRank;
    const aTs = a.timestamp ? Date.parse(a.timestamp) : 0;
    const bTs = b.timestamp ? Date.parse(b.timestamp) : 0;
    return bTs - aTs;
  });
}

export function buildAlertsDataset(center: ExecutiveCommandCenter): CommandCenterItem[] {
  const alerts = filterRealRecords(center.alerts ?? []).map(mapAlertToItem);
  return sortBySeverity(crossTabSafeguardDedupe(deduplicateCommandCenterItems(alerts)));
}

export function buildApprovalsDataset(center: ExecutiveCommandCenter): CommandCenterItem[] {
  const approvals = filterRealRecords(center.actions ?? [])
    .filter((record) => {
      const actionType = String(record.action_type ?? "").toLowerCase();
      return actionType === "approval" || actionType.includes("approval");
    })
    .map(mapApprovalToItem);

  return sortBySeverity(crossTabSafeguardDedupe(deduplicateCommandCenterItems(approvals)));
}

export function buildRisksDataset(center: ExecutiveCommandCenter): {
  activeRisks: CommandCenterItem[];
  operationalHealth: CommandCenterItem[];
} {
  const riskAlerts = filterRealRecords(center.alerts ?? [])
    .filter((record) => RISK_ALERT_TYPES.has(String(record.alert_type ?? "").toLowerCase()))
    .map(mapRiskAlertToItem);

  const operationalHealth = filterRealRecords(center.health ?? []).map(mapHealthToItem);

  return {
    activeRisks: sortBySeverity(crossTabSafeguardDedupe(deduplicateCommandCenterItems(riskAlerts))),
    operationalHealth: deduplicateCommandCenterItems(operationalHealth).sort(
      (a, b) => (a.healthScore ?? 0) - (b.healthScore ?? 0)
    ),
  };
}

export function buildOpportunitiesDataset(center: ExecutiveCommandCenter): CommandCenterItem[] {
  const opportunities = filterRealRecords(center.opportunities ?? []).map(mapOpportunityToItem);
  return crossTabSafeguardDedupe(deduplicateCommandCenterItems(opportunities));
}

export function buildPerformanceDataset(center: ExecutiveCommandCenter): {
  healthItems: CommandCenterItem[];
  overallHealthScore: number;
} {
  const healthItems = deduplicateCommandCenterItems(filterRealRecords(center.health ?? []).map(mapHealthToItem));
  return {
    healthItems: healthItems.sort((a, b) => (a.healthScore ?? 0) - (b.healthScore ?? 0)),
    overallHealthScore: center.overall_health_score ?? 0,
  };
}

export function buildCompanionBriefingDataset(center: ExecutiveCommandCenter): {
  executiveBriefings: CommandCenterItem[];
  dailyBriefings: CommandCenterItem[];
  boardReports: CommandCenterItem[];
} {
  const briefings = filterRealRecords(center.briefings ?? []).map(mapBriefingToItem);
  const reports = filterRealRecords(center.board_reports ?? []).map(mapReportToItem);

  const dedupedBriefings = deduplicateCommandCenterItems(briefings);
  const dedupedReports = deduplicateCommandCenterItems(reports);

  return {
    executiveBriefings: dedupedBriefings.filter((item) =>
      ["weekly_leadership", "companion_summary", "executive"].some((type) => item.itemType?.includes(type))
    ),
    dailyBriefings: dedupedBriefings.filter((item) => item.itemType?.includes("daily")),
    boardReports: dedupedReports,
  };
}

export function buildEccOverviewCounts(center: ExecutiveCommandCenter): EccOverviewCounts {
  const alerts = buildAlertsDataset(center);
  const approvals = buildApprovalsDataset(center);
  const opportunities = buildOpportunitiesDataset(center);
  const sinceLastLogin = filterRealRecords(center.since_last_login ?? []);

  const criticalItems = alerts.filter((item) => item.primaryBadge.value === "critical").length;

  return {
    sinceLastLoginItems: sinceLastLogin.length,
    openAlerts: alerts.filter((item) => item.secondaryBadge?.value === "open").length || alerts.length,
    pendingActions: approvals.filter((item) => item.secondaryBadge?.value !== "completed").length,
    openOpportunities: opportunities.filter((item) => !["won", "declined", "expired"].includes(item.primaryBadge.value))
      .length,
    criticalItems,
  };
}

export function crossTabSafeguardDedupe(items: CommandCenterItem[]): CommandCenterItem[] {
  const titleGroups = new Map<string, CommandCenterItem[]>();
  for (const item of items) {
    const key = normalizeTitleKey(item.title);
    const group = titleGroups.get(key) ?? [];
    group.push(item);
    titleGroups.set(key, group);
  }

  const kept = new Map<string, CommandCenterItem>();
  for (const group of titleGroups.values()) {
    const winner = group.reduce((best, current) => pickPreferredRecord(best, current));
    kept.set(winner.dedupeKey, winner);
  }

  return [...kept.values()];
}

export function severityLabelKey(severity: SeverityLevel): string {
  if (severity === "critical") return "common.status.semantic.severity.critical";
  if (severity === "high") return "common.status.semantic.severity.high";
  if (severity === "medium") return "common.status.semantic.severity.medium";
  if (severity === "low") return "common.status.semantic.severity.low";
  return "common.status.semantic.severity.info";
}

function workflowLabelKey(state: string): string {
  switch (state) {
    case "awaiting_approval":
      return "common.status.semantic.workflow.awaitingApproval";
    case "in_progress":
      return "common.status.semantic.workflow.inProgress";
    case "completed":
      return "common.status.semantic.workflow.completed";
    case "pending":
      return "common.status.semantic.workflow.pending";
    case "blocked":
      return "common.status.semantic.workflow.blocked";
    default:
      return "common.status.semantic.workflow.open";
  }
}

function healthLabelKey(state: string): string {
  if (state === "critical_health") return "common.status.semantic.health.criticalHealth";
  return `common.status.semantic.health.${state}`;
}

function opportunityLabelKey(status: string): string {
  if (status === "review_required") return "customerApp.executiveCommandCenter.tabs.opportunityStatus.reviewRequired";
  if (status === "in_progress") return "customerApp.executiveCommandCenter.tabs.opportunityStatus.inProgress";
  return `customerApp.executiveCommandCenter.tabs.opportunityStatus.${status}`;
}

function reportLabelKey(state: string): string {
  return `customerApp.executiveCommandCenter.tabs.reportState.${state}`;
}
