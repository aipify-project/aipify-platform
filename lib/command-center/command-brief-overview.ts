import {
  buildCommandBriefAttentionItems,
  buildCommandBriefAttentionItemsFromCenter,
  filterRealCompanionRecommendations,
} from "@/lib/command-center/command-brief-attention";
import {
  buildAlertsDataset,
  buildApprovalsDataset,
  buildEccOverviewCounts,
  crossTabSafeguardDedupe,
  isSyntheticEccRecord,
  type CommandCenterItem,
} from "@/lib/command-center/ecc-tab-datasets";
import {
  buildSinceLastLoginDataset,
  groupSinceLastLoginEvents,
  type SinceLastLoginEvent,
} from "@/lib/command-center/since-last-login";
import { buildCommandBriefIntegrationStatus } from "@/lib/command-center/command-brief-integration-status";
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";

export type CommandBriefKpiCounts = {
  sinceLastLogin: number;
  preparedByAipify: number;
  requiresAttention: number;
  awaitingApproval: number;
  organizationHealth: number | null;
};

export { buildCommandBriefAttentionItems, buildCommandBriefAttentionItemsFromCenter, filterRealCompanionRecommendations };

export const COMMAND_BRIEF_ACTIVITY_LIMIT = 5;
export const COMMAND_BRIEF_ALERTS_LIMIT = 3;
export const COMMAND_BRIEF_INTEGRATIONS_LIMIT = 6;

function sortActivityEvents(events: SinceLastLoginEvent[]): SinceLastLoginEvent[] {
  return events.slice().sort((a, b) => {
    const aTime = a.occurredAt ? Date.parse(a.occurredAt) : 0;
    const bTime = b.occurredAt ? Date.parse(b.occurredAt) : 0;
    return bTime - aTime;
  });
}

export function buildCommandBriefActivityFeed(center: ExecutiveCommandCenter): {
  items: SinceLastLoginEvent[];
  totalCount: number;
} {
  const events = sortActivityEvents(
    buildSinceLastLoginDataset({
      eccItems: (center.since_last_login ?? []).filter((item) => !isSyntheticEccRecord(item)),
      activitySinceLogin: center.activity_since_login,
      timeline: center.timeline,
    })
  );
  return {
    items: events.slice(0, COMMAND_BRIEF_ACTIVITY_LIMIT),
    totalCount: events.length,
  };
}

export function buildCommandBriefKpiCounts(center: ExecutiveCommandCenter): CommandBriefKpiCounts {
  const counts = buildEccOverviewCounts(center);
  const events = buildSinceLastLoginDataset({
    eccItems: (center.since_last_login ?? []).filter((item) => !isSyntheticEccRecord(item)),
    activitySinceLogin: center.activity_since_login,
    timeline: center.timeline,
  });
  const grouped = groupSinceLastLoginEvents(events);
  const attention = buildCommandBriefAttentionItemsFromCenter(center);

  return {
    sinceLastLogin: counts.sinceLastLoginItems,
    preparedByAipify: grouped.counts.completedByAipify,
    requiresAttention: attention.totalCount > 0 ? attention.totalCount : counts.criticalItems + counts.openAlerts,
    awaitingApproval: counts.pendingActions,
    organizationHealth:
      typeof center.overall_health_score === "number" ? center.overall_health_score : null,
  };
}

export {
  buildCommandBriefIntegrationStatus,
  type CommandBriefIntegrationStatusItem,
  type CommandBriefIntegrationStatusKey,
} from "@/lib/command-center/command-brief-integration-status";

/** @deprecated Use buildCommandBriefIntegrationStatus */
export type CommandBriefIntegrationSignal = {
  id: string;
  title: string;
  summary: string;
  eventsCount: number;
  alertsCount: number;
};

/** @deprecated Use buildCommandBriefIntegrationStatus */
export function buildCommandBriefIntegrationSignals(center: ExecutiveCommandCenter) {
  const { items } = buildCommandBriefIntegrationStatus(center);
  return items.map((item) => ({
    id: item.id,
    title: item.title,
    summary: item.summary,
    eventsCount: item.eventsCount,
    alertsCount: item.alertsCount,
  }));
}

function excludeAttentionItems(
  items: CommandCenterItem[],
  attentionItems: CommandCenterItem[]
): CommandCenterItem[] {
  const keys = new Set(attentionItems.map((item) => item.dedupeKey));
  return items.filter((item) => !keys.has(item.dedupeKey));
}

export function buildCommandBriefAlertSummary(
  center: ExecutiveCommandCenter,
  attentionItems: CommandCenterItem[]
): { items: CommandCenterItem[]; totalCount: number } {
  const all = excludeAttentionItems(buildAlertsDataset(center), attentionItems);
  return {
    items: all.slice(0, COMMAND_BRIEF_ALERTS_LIMIT),
    totalCount: all.length,
  };
}

export function buildCommandBriefApprovalSummary(
  center: ExecutiveCommandCenter,
  attentionItems: CommandCenterItem[]
): CommandCenterItem[] {
  return excludeAttentionItems(buildApprovalsDataset(center), attentionItems).slice(0, 3);
}

export {
  buildCommandBriefNextAction,
  pickCommandBriefNextAction,
} from "@/lib/command-center/command-brief-next-action";
export type { CommandBriefNextActionCategory } from "@/lib/command-center/command-brief-next-action";
