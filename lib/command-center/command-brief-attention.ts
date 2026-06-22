import {
  crossTabSafeguardDedupe,
  deduplicateCommandCenterItems,
  filterRealRecords,
  isSyntheticEccRecord,
  mapAlertToItem,
  mapApprovalToItem,
  mapHealthToItem,
  type CommandCenterItem,
} from "@/lib/command-center/ecc-tab-datasets";
import { getSeverityPresentation, mapExecutivePriorityToSeverity } from "@/lib/design/semantic-status-system";
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";

export const COMMAND_BRIEF_ATTENTION_LIMIT = 5;
export const COMMAND_BRIEF_ATTENTION_SEE_ALL_HREF = "/app/command-center/alerts";
export const COMMAND_BRIEF_RETURN_PATH = "/app/command-center";

export type CommandBriefAttentionSeverityTier = "critical" | "attention" | "waiting" | "info";

export type CommandBriefAttentionItem = CommandCenterItem & {
  severityTier: CommandBriefAttentionSeverityTier;
  moduleArea: string;
  responsiblePerson?: string;
  detailHref: string;
  businessImpactRank: number;
  dueAt?: string;
  iconKey: CommandBriefAttentionIconKey;
};

export type CommandBriefAttentionIconKey =
  | "critical"
  | "alerts"
  | "approvals"
  | "risks"
  | "health"
  | "action"
  | "performance";

export type CommandBriefAttentionResult = {
  items: CommandBriefAttentionItem[];
  totalCount: number;
  seeAllHref: string;
};

const OPEN_ALERT_STATUSES = new Set(["open", "pending", "active"]);

const INTEGRATION_ALERT_TYPES = new Set([
  "integration_failure",
  "integration_disconnected",
  "integration_error",
  "disconnected_integration",
  "integration",
]);

const PAYMENT_ALERT_TYPES = new Set([
  "invoice_overdue",
  "payment_failed",
  "subscription_issue",
  "billing",
  "license",
]);

const SECURITY_ALERT_TYPES = new Set(["security", "compliance"]);

const SYSTEM_ALERT_TYPES = new Set(["system_error", "critical_error", "service_outage"]);

const DATA_QUALITY_ALERT_TYPES = new Set(["data_quality", "data_integrity"]);

function isOverdue(isoDate: string): boolean {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return false;
  return parsed < Date.now();
}

function appendReturnPath(href: string, returnPath = COMMAND_BRIEF_RETURN_PATH): string {
  if (!href.startsWith("/")) return href;
  const [pathname, search = ""] = href.split("?");
  const params = new URLSearchParams(search);
  if (!params.has("return")) params.set("return", returnPath);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function resolveSeverityTier(item: CommandCenterItem): CommandBriefAttentionSeverityTier {
  const severity = item.primaryBadge.value;
  const workflow = item.secondaryBadge?.value;

  if (severity === "critical") return "critical";
  if (severity === "high") return "attention";
  if (workflow === "blocked" || workflow === "overdue" || workflow === "awaiting_approval") return "waiting";
  if (severity === "medium") return "attention";
  if (severity === "low" || workflow === "pending" || workflow === "open") return "waiting";
  return "info";
}

function resolveBusinessImpactRank(item: CommandCenterItem): number {
  const workflow = item.secondaryBadge?.value;
  if (workflow === "blocked") return 0;
  if (workflow === "overdue") return 1;
  if (item.primaryBadge.value === "critical") return 2;
  if (workflow === "awaiting_approval" || workflow === "pending" || workflow === "open") return 3;
  return 4;
}

function resolveIconKey(item: CommandCenterItem, alertType?: string): CommandBriefAttentionIconKey {
  const type = String(alertType ?? item.itemType ?? "").toLowerCase();
  if (SYSTEM_ALERT_TYPES.has(type) || item.primaryBadge.value === "critical") return "critical";
  if (INTEGRATION_ALERT_TYPES.has(type) || type.includes("integration")) return "alerts";
  if (PAYMENT_ALERT_TYPES.has(type)) return "action";
  if (SECURITY_ALERT_TYPES.has(type)) return "risks";
  if (DATA_QUALITY_ALERT_TYPES.has(type) || item.itemType === "health") return "health";
  if (type.includes("approval")) return "approvals";
  if (item.itemType === "health") return "performance";
  return "alerts";
}

function isOpenAlert(record: Record<string, unknown>): boolean {
  const status = String(record.alert_status ?? "open").toLowerCase();
  return OPEN_ALERT_STATUSES.has(status);
}

function isAttentionWorthyAlert(record: Record<string, unknown>): boolean {
  if (!isOpenAlert(record)) return false;

  const priority = String(record.priority ?? "").toLowerCase();
  const alertType = String(record.alert_type ?? "").toLowerCase();

  if (priority === "critical" || priority === "urgent") return true;
  if (alertType === "approval_delay") return true;
  if (INTEGRATION_ALERT_TYPES.has(alertType) || alertType.includes("integration")) return true;
  if (PAYMENT_ALERT_TYPES.has(alertType)) return true;
  if (SECURITY_ALERT_TYPES.has(alertType)) return true;
  if (SYSTEM_ALERT_TYPES.has(alertType)) return true;
  if (DATA_QUALITY_ALERT_TYPES.has(alertType)) return true;
  if (["customer_risk", "revenue_decline", "compliance", "risk"].includes(alertType) && priority !== "information") {
    return true;
  }

  return priority === "attention";
}

function isAttentionWorthyApproval(record: Record<string, unknown>): boolean {
  const actionType = String(record.action_type ?? "").toLowerCase();
  if (actionType !== "approval" && !actionType.includes("approval")) return false;

  const status = String(record.action_status ?? "pending").toLowerCase();
  const priority = String(record.priority ?? "").toLowerCase();

  if (status === "blocked") return true;
  if (priority === "critical" || priority === "urgent") return true;

  const dueAt = record.due_at;
  if (typeof dueAt === "string" && isOverdue(dueAt)) return true;

  return false;
}

function isAttentionWorthyTask(record: Record<string, unknown>): boolean {
  const actionType = String(record.action_type ?? "").toLowerCase();
  if (actionType === "approval" || actionType.includes("approval")) return false;

  const status = String(record.action_status ?? "").toLowerCase();
  if (status === "blocked") return true;
  if (status === "completed" || status === "cancelled") return false;

  const dueAt = record.due_at;
  if (typeof dueAt === "string" && isOverdue(dueAt)) return true;

  return priorityRequiresAttention(record.priority);
}

function priorityRequiresAttention(priority: unknown): boolean {
  const key = String(priority ?? "").toLowerCase();
  return key === "critical" || key === "urgent" || key === "attention";
}

function severityRankFromPriority(priority: unknown): number {
  const severity = mapExecutivePriorityToSeverity(priority);
  return getSeverityPresentation(severity).sortPriority;
}

function mapSinceLastLoginIntegrationToItem(record: Record<string, unknown>): CommandCenterItem {
  const title = String(record.item_title ?? "Integration issue");
  const priority = record.priority;
  const severity = mapExecutivePriorityToSeverity(priority);

  return {
    id: String(record.item_key ?? title),
    dedupeKey: `since-login-integration:${String(record.item_key ?? title)}`,
    title,
    description: String(record.summary ?? ""),
    source: "integration",
    itemType: "integration",
    timestamp: undefined,
    count: Number(record.item_count ?? 1),
    href: "/app/platform/integrations",
    actionLabelKey: "customerApp.executiveCommandCenter.commandBriefOverview.attention.actions.reviewIntegration",
    primaryBadge: {
      type: "severity",
      value: severity,
      labelKey: `common.status.semantic.severity.${severity === "medium" ? "medium" : severity}`,
    },
    secondaryBadge: {
      type: "workflow",
      value: "open",
      labelKey: "common.status.semantic.workflow.open",
    },
    severityRank: severityRankFromPriority(priority),
  };
}

function mapBusinessPackAlertToItem(record: Record<string, unknown>): CommandCenterItem | null {
  const alertsCount = Number(record.alerts_count ?? 0);
  if (alertsCount <= 0) return null;

  const title = String(record.pack_title ?? "Business pack");
  return {
    id: String(record.pack_key ?? title),
    dedupeKey: `business-pack-alert:${String(record.pack_key ?? title)}`,
    title,
    description: String(record.summary ?? ""),
    source: "business pack",
    itemType: "integration",
    timestamp: undefined,
    count: alertsCount,
    href: "/app/platform/integrations",
    actionLabelKey: "customerApp.executiveCommandCenter.commandBriefOverview.attention.actions.reviewIntegration",
    primaryBadge: {
      type: "severity",
      value: "medium",
      labelKey: "common.status.semantic.severity.medium",
    },
    secondaryBadge: {
      type: "workflow",
      value: "open",
      labelKey: "common.status.semantic.workflow.open",
    },
    severityRank: 2,
  };
}

function enrichAttentionItem(
  item: CommandCenterItem,
  options: {
    moduleArea: string;
    responsiblePerson?: string;
    dueAt?: string;
    alertType?: string;
    detailHref?: string;
  }
): CommandBriefAttentionItem {
  const detailHref = appendReturnPath(options.detailHref ?? item.href);
  return {
    ...item,
    href: appendReturnPath(item.href),
    detailHref,
    moduleArea: options.moduleArea,
    responsiblePerson: options.responsiblePerson,
    dueAt: options.dueAt,
    severityTier: resolveSeverityTier(item),
    businessImpactRank: resolveBusinessImpactRank(item),
    iconKey: resolveIconKey(item, options.alertType),
  };
}

function sortAttentionItems(a: CommandBriefAttentionItem, b: CommandBriefAttentionItem): number {
  if (a.severityRank !== b.severityRank) return a.severityRank - b.severityRank;
  if (a.businessImpactRank !== b.businessImpactRank) return a.businessImpactRank - b.businessImpactRank;

  const aDue = a.dueAt ? Date.parse(a.dueAt) : Number.POSITIVE_INFINITY;
  const bDue = b.dueAt ? Date.parse(b.dueAt) : Number.POSITIVE_INFINITY;
  if (aDue !== bDue) return aDue - bDue;

  const aTs = a.timestamp ? Date.parse(a.timestamp) : 0;
  const bTs = b.timestamp ? Date.parse(b.timestamp) : 0;
  return bTs - aTs;
}

export function buildCommandBriefAttentionItemsFromCenter(
  center: ExecutiveCommandCenter
): CommandBriefAttentionResult {
  const candidates: CommandBriefAttentionItem[] = [];

  for (const record of filterRealRecords(center.alerts ?? [])) {
    if (!isAttentionWorthyAlert(record)) continue;
    const item = mapAlertToItem(record);
    candidates.push(
      enrichAttentionItem(item, {
        moduleArea: String(record.alert_type ?? "alert").replace(/_/g, " "),
        dueAt: typeof record.due_at === "string" ? record.due_at : undefined,
        alertType: String(record.alert_type ?? ""),
        detailHref: item.href,
      })
    );
  }

  for (const record of filterRealRecords(center.actions ?? [])) {
    if (isAttentionWorthyApproval(record)) {
      const item = mapApprovalToItem(record);
      candidates.push(
        enrichAttentionItem(item, {
          moduleArea: String(record.action_type ?? "approval").replace(/_/g, " "),
          responsiblePerson: typeof record.requester === "string" ? record.requester : undefined,
          dueAt: typeof record.due_at === "string" ? record.due_at : undefined,
          alertType: String(record.action_type ?? "approval"),
          detailHref: item.href,
        })
      );
      continue;
    }

    if (isAttentionWorthyTask(record)) {
      const item = mapApprovalToItem({
        ...record,
        action_title: record.action_title ?? "Overdue task",
        action_type: record.action_type ?? "task",
      });
      candidates.push(
        enrichAttentionItem(item, {
          moduleArea: String(record.action_type ?? "task").replace(/_/g, " "),
          responsiblePerson: typeof record.requester === "string" ? record.requester : undefined,
          dueAt: typeof record.due_at === "string" ? record.due_at : undefined,
          alertType: String(record.action_type ?? "task"),
          detailHref: item.href,
        })
      );
    }
  }

  for (const record of filterRealRecords(center.health ?? [])) {
    const score = Number(record.health_score ?? 100);
    if (score >= 50) continue;
    const item = mapHealthToItem(record);
    candidates.push(
      enrichAttentionItem(item, {
        moduleArea: "organizational health",
        alertType: "data_quality",
        detailHref: item.href,
      })
    );
  }

  for (const record of filterRealRecords(center.since_last_login ?? [])) {
    const category = String(record.item_category ?? "").toLowerCase();
    if (!category.includes("integration")) continue;
    if (!priorityRequiresAttention(record.priority)) continue;
    const item = mapSinceLastLoginIntegrationToItem(record);
    candidates.push(
      enrichAttentionItem(item, {
        moduleArea: "integration",
        alertType: "integration",
        detailHref: item.href,
      })
    );
  }

  for (const record of filterRealRecords(center.business_packs ?? [])) {
    const item = mapBusinessPackAlertToItem(record);
    if (!item) continue;
    candidates.push(
      enrichAttentionItem(item, {
        moduleArea: "business pack",
        alertType: "integration",
        detailHref: item.href,
      })
    );
  }

  const deduped = crossTabSafeguardDedupe(deduplicateCommandCenterItems(candidates)).map((item) =>
    "severityTier" in item ? (item as CommandBriefAttentionItem) : enrichAttentionItem(item, { moduleArea: item.source ?? "attention" })
  );

  const sorted = deduped.sort(sortAttentionItems);
  const totalCount = sorted.length;

  return {
    items: sorted.slice(0, COMMAND_BRIEF_ATTENTION_LIMIT),
    totalCount,
    seeAllHref: appendReturnPath(COMMAND_BRIEF_ATTENTION_SEE_ALL_HREF),
  };
}

export function buildCommandBriefAttentionItems(center: ExecutiveCommandCenter): CommandBriefAttentionItem[] {
  return buildCommandBriefAttentionItemsFromCenter(center).items;
}

export function attentionSeverityLabelKey(tier: CommandBriefAttentionSeverityTier): string {
  return `customerApp.executiveCommandCenter.commandBriefOverview.attention.severity.${tier}`;
}

/** @internal test helper */
export function filterRealCompanionRecommendations(
  records: Record<string, unknown>[]
): Record<string, unknown>[] {
  return records.filter((record) => !isSyntheticEccRecord(record));
}
