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

export function filterRealCompanionRecommendations(
  records: Record<string, unknown>[]
): Record<string, unknown>[] {
  return records.filter((record) => !isSyntheticEccRecord(record));
}

export function buildCommandBriefAttentionItems(center: ExecutiveCommandCenter): CommandCenterItem[] {
  const alerts = buildAlertsDataset(center);
  const approvals = buildApprovalsDataset(center);
  const combined = crossTabSafeguardDedupe([...alerts, ...approvals]);
  return combined.sort((a, b) => b.severityRank - a.severityRank).slice(0, 3);
}

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
  const attentionItems = buildCommandBriefAttentionItems(center);

  return {
    sinceLastLogin: counts.sinceLastLoginItems,
    preparedByAipify: grouped.counts.completedByAipify,
    requiresAttention: attentionItems.length > 0 ? attentionItems.length : counts.criticalItems + counts.openAlerts,
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

export function pickCommandBriefNextAction(
  attentionItems: CommandCenterItem[]
): CommandCenterItem | null {
  if (attentionItems.length === 0) return null;
  return attentionItems[0] ?? null;
}
