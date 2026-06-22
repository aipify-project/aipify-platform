import {
  COMMAND_BRIEF_RETURN_PATH,
  buildCommandBriefAttentionItemsFromCenter,
} from "@/lib/command-center/command-brief-attention";
import {
  filterRealRecords,
  mapAlertToItem,
  mapApprovalToItem,
  mapOpportunityToItem,
  type CommandCenterItem,
} from "@/lib/command-center/ecc-tab-datasets";
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";

export type CommandBriefNextActionCategory =
  | "integration_setup"
  | "overdue_approval"
  | "security"
  | "failed_payment"
  | "blocked_workflow"
  | "onboarding"
  | "operational";

type RankedNextAction = CommandCenterItem & {
  category: CommandBriefNextActionCategory;
  categoryRank: number;
};

const CATEGORY_RANK: Record<CommandBriefNextActionCategory, number> = {
  integration_setup: 0,
  overdue_approval: 1,
  security: 2,
  failed_payment: 3,
  blocked_workflow: 4,
  onboarding: 5,
  operational: 6,
};

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

const CONTINUE_SETUP_ACTION_KEY =
  "customerApp.executiveCommandCenter.commandBriefOverview.nextAction.actions.continueSetup";

function appendReturnPath(href: string, returnPath = COMMAND_BRIEF_RETURN_PATH): string {
  if (!href.startsWith("/")) return href;
  const [pathname, search = ""] = href.split("?");
  const params = new URLSearchParams(search);
  if (!params.has("return")) params.set("return", returnPath);
  const query = params.toString();
  return query ? `${pathname}?${query}` : pathname;
}

function withReturn(item: CommandCenterItem): CommandCenterItem {
  return {
    ...item,
    href: appendReturnPath(item.href),
  };
}

function isOverdue(isoDate: string): boolean {
  const parsed = Date.parse(isoDate);
  if (Number.isNaN(parsed)) return false;
  return parsed < Date.now();
}

function isIntegrationSetupRecord(record: Record<string, unknown>): boolean {
  const category = String(record.item_category ?? record.category ?? "").toLowerCase();
  if (category.includes("integration")) {
    const priority = String(record.priority ?? "").toLowerCase();
    if (priority === "completed") return false;
    return true;
  }

  const alertType = String(record.alert_type ?? "").toLowerCase();
  if (INTEGRATION_ALERT_TYPES.has(alertType) || alertType.includes("integration")) return true;

  const status = String(record.connection_status ?? record.item_status ?? record.status ?? "").toLowerCase();
  return status === "pending" || status === "disconnected" || status === "incomplete";
}

function mapIntegrationSetupItem(record: Record<string, unknown>): CommandCenterItem {
  const title = String(record.item_title ?? record.alert_title ?? record.pack_title ?? "Integration");
  const id = String(record.item_key ?? record.alert_key ?? record.pack_key ?? title);
  const href =
    typeof record.record_href === "string" && record.record_href.startsWith("/")
      ? record.record_href
      : "/app/platform/integrations";

  return {
    id,
    dedupeKey: `next-action:integration:${id}`,
    title,
    description: String(record.summary ?? record.companion_recommendation ?? ""),
    source: "integration",
    itemType: "integration",
    timestamp: undefined,
    count: 1,
    href,
    actionLabelKey: CONTINUE_SETUP_ACTION_KEY,
    primaryBadge: {
      type: "workflow",
      value: "pending",
      labelKey: "common.status.semantic.workflow.pending",
    },
    severityRank: 0,
  };
}

function mapOnboardingItem(record: Record<string, unknown>): CommandCenterItem {
  const title = String(record.opportunity_title ?? record.item_title ?? "Onboarding");
  const id = String(record.opportunity_key ?? record.item_key ?? title);
  const href =
    typeof record.record_href === "string" && record.record_href.startsWith("/")
      ? record.record_href
      : "/app/install";

  return {
    id,
    dedupeKey: `next-action:onboarding:${id}`,
    title,
    description: String(record.summary ?? record.recommendation ?? ""),
    source: "onboarding",
    itemType: "onboarding",
    count: 1,
    href,
    actionLabelKey: CONTINUE_SETUP_ACTION_KEY,
    primaryBadge: {
      type: "workflow",
      value: "in_progress",
      labelKey: "common.status.semantic.workflow.in_progress",
    },
    severityRank: 5,
  };
}

function classifyAttentionItem(item: CommandCenterItem): CommandBriefNextActionCategory {
  const itemType = String(item.itemType ?? "").toLowerCase();
  const workflow = item.secondaryBadge?.value ?? "";

  if (itemType.includes("integration")) return "integration_setup";
  if (workflow === "blocked") return "blocked_workflow";
  if (itemType.includes("approval") || workflow === "awaiting_approval" || workflow === "overdue") {
    return "overdue_approval";
  }
  if (SECURITY_ALERT_TYPES.has(itemType)) return "security";
  if (PAYMENT_ALERT_TYPES.has(itemType)) return "failed_payment";
  if (itemType.includes("onboarding")) return "onboarding";
  return "operational";
}

function rankCandidate(
  item: CommandCenterItem,
  category: CommandBriefNextActionCategory
): RankedNextAction {
  return {
    ...item,
    category,
    categoryRank: CATEGORY_RANK[category],
  };
}

function sortCandidates(a: RankedNextAction, b: RankedNextAction): number {
  if (a.categoryRank !== b.categoryRank) return a.categoryRank - b.categoryRank;
  if (a.severityRank !== b.severityRank) return a.severityRank - b.severityRank;
  const aTs = a.timestamp ? Date.parse(a.timestamp) : 0;
  const bTs = b.timestamp ? Date.parse(b.timestamp) : 0;
  return bTs - aTs;
}

function buildNextActionCandidates(center: ExecutiveCommandCenter): RankedNextAction[] {
  const candidates: RankedNextAction[] = [];
  const seen = new Set<string>();

  function addCandidate(item: CommandCenterItem, category: CommandBriefNextActionCategory) {
    const normalized = withReturn(item);
    if (seen.has(normalized.dedupeKey)) return;
    seen.add(normalized.dedupeKey);
    candidates.push(rankCandidate(normalized, category));
  }

  const attention = buildCommandBriefAttentionItemsFromCenter(center);
  for (const item of attention.items) {
    addCandidate(item, classifyAttentionItem(item));
  }

  for (const record of filterRealRecords(center.since_last_login ?? [])) {
    if (!isIntegrationSetupRecord(record)) continue;
    addCandidate(mapIntegrationSetupItem(record), "integration_setup");
  }

  for (const record of filterRealRecords(center.alerts ?? [])) {
    const alertType = String(record.alert_type ?? "").toLowerCase();
    const item = mapAlertToItem(record);

    if (INTEGRATION_ALERT_TYPES.has(alertType) || alertType.includes("integration")) {
      addCandidate({ ...item, actionLabelKey: CONTINUE_SETUP_ACTION_KEY }, "integration_setup");
      continue;
    }
    if (SECURITY_ALERT_TYPES.has(alertType)) {
      addCandidate(item, "security");
      continue;
    }
    if (PAYMENT_ALERT_TYPES.has(alertType)) {
      addCandidate(item, "failed_payment");
    }
  }

  for (const record of filterRealRecords(center.actions ?? [])) {
    const item = mapApprovalToItem(record);
    const status = String(record.action_status ?? "").toLowerCase();
    const dueAt = typeof record.due_at === "string" ? record.due_at : undefined;

    if (status === "blocked") {
      addCandidate(item, "blocked_workflow");
      continue;
    }

    const actionType = String(record.action_type ?? "").toLowerCase();
    if ((actionType.includes("approval") || actionType === "approval") && dueAt && isOverdue(dueAt)) {
      addCandidate(item, "overdue_approval");
    }
  }

  for (const record of filterRealRecords(center.opportunities ?? [])) {
    const opportunityType = String(record.opportunity_type ?? "").toLowerCase();
    const item = mapOpportunityToItem(record);
    if (opportunityType.includes("onboarding")) {
      addCandidate({ ...item, actionLabelKey: CONTINUE_SETUP_ACTION_KEY }, "onboarding");
      continue;
    }
    if (item.primaryBadge.value === "review_required" || item.primaryBadge.value === "recommended") {
      addCandidate(item, "operational");
    }
  }

  const activity = center.activity_since_login ?? {};
  if (
    activity.setup_incomplete === true ||
    activity.onboarding_incomplete === true ||
    String(activity.onboarding_status ?? "").toLowerCase() === "incomplete"
  ) {
    addCandidate(
      mapOnboardingItem({
        item_title: typeof activity.onboarding_title === "string" ? activity.onboarding_title : "Complete onboarding",
        summary:
          typeof activity.onboarding_summary === "string"
            ? activity.onboarding_summary
            : typeof activity.next_step === "string"
              ? activity.next_step
              : "",
        record_href: typeof activity.onboarding_href === "string" ? activity.onboarding_href : "/app/install",
      }),
      "onboarding"
    );
  }

  return candidates;
}

export function buildCommandBriefNextAction(center: ExecutiveCommandCenter): CommandCenterItem | null {
  const candidates = buildNextActionCandidates(center).sort(sortCandidates);
  return candidates[0] ?? null;
}

/** @deprecated Use buildCommandBriefNextAction(center) for verified multi-source selection. */
export function pickCommandBriefNextAction(attentionItems: CommandCenterItem[]): CommandCenterItem | null {
  if (attentionItems.length === 0) return null;
  const item = attentionItems[0];
  return item ? withReturn(item) : null;
}
