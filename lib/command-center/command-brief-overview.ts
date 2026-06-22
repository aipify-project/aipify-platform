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
import type { ExecutiveCommandCenter } from "@/lib/executive-command-center-engine/parse";

export type CommandBriefKpiCounts = {
  sinceLastLogin: number;
  preparedByAipify: number;
  requiresAttention: number;
  awaitingApproval: number;
  organizationHealth: number | null;
};

export { buildCommandBriefAttentionItems, buildCommandBriefAttentionItemsFromCenter, filterRealCompanionRecommendations };

export function buildCommandBriefActivityFeed(center: ExecutiveCommandCenter): SinceLastLoginEvent[] {
  const events = buildSinceLastLoginDataset({
    eccItems: (center.since_last_login ?? []).filter((item) => !isSyntheticEccRecord(item)),
    activitySinceLogin: center.activity_since_login,
    timeline: center.timeline,
  });
  return events
    .slice()
    .sort((a, b) => {
      const aTime = a.occurredAt ? Date.parse(a.occurredAt) : 0;
      const bTime = b.occurredAt ? Date.parse(b.occurredAt) : 0;
      return bTime - aTime;
    })
    .slice(0, 5);
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

export type CommandBriefIntegrationSignal = {
  id: string;
  title: string;
  summary: string;
  eventsCount: number;
  alertsCount: number;
};

export function buildCommandBriefIntegrationSignals(
  center: ExecutiveCommandCenter
): CommandBriefIntegrationSignal[] {
  return (center.business_packs ?? [])
    .filter((pack) => !isSyntheticEccRecord(pack))
    .slice(0, 3)
    .map((pack) => ({
      id: String(pack.pack_key ?? pack.pack_title),
      title: String(pack.pack_title ?? ""),
      summary: String(pack.summary ?? ""),
      eventsCount: Number(pack.events_count ?? 0),
      alertsCount: Number(pack.alerts_count ?? 0),
    }))
    .filter((item) => item.title.length > 0);
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
): CommandCenterItem[] {
  return excludeAttentionItems(buildAlertsDataset(center), attentionItems).slice(0, 3);
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
