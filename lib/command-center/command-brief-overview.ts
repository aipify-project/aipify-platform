import {
  buildCommandBriefAttentionItems,
  buildCommandBriefAttentionItemsFromCenter,
  filterRealCompanionRecommendations,
} from "@/lib/command-center/command-brief-attention";
import {
  buildAlertsDataset,
  buildApprovalsDataset,
  buildEccOverviewCounts,
  buildOpportunitiesDataset,
  buildPerformanceDataset,
  crossTabSafeguardDedupe,
  deduplicateCommandCenterItems,
  isSyntheticEccRecord,
  mapAlertToItem,
  mapOpportunityToItem,
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
export const COMMAND_BRIEF_APPROVALS_LIMIT = 3;
export const COMMAND_BRIEF_RECOMMENDATIONS_LIMIT = 3;
export const COMMAND_BRIEF_HEALTH_LIMIT = 4;

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
  attentionItems: CommandCenterItem[],
): { items: CommandCenterItem[]; totalCount: number } {
  const all = excludeAttentionItems(buildApprovalsDataset(center), attentionItems);
  return {
    items: all.slice(0, COMMAND_BRIEF_APPROVALS_LIMIT),
    totalCount: all.length,
  };
}

function mapCompanionRecommendationToItem(record: Record<string, unknown>): CommandCenterItem {
  if (record.alert_title || record.alert_type) {
    return mapAlertToItem({
      ...record,
      companion_recommendation: record.recommendation ?? record.companion_recommendation,
    });
  }
  if (record.opportunity_title) return mapOpportunityToItem(record);

  const title = String(record.recommendation_title ?? record.title ?? "Recommendation");
  return mapOpportunityToItem({
    ...record,
    opportunity_title: title,
    recommendation: record.recommendation ?? record.summary,
  });
}

function sortBySeverity(items: CommandCenterItem[]): CommandCenterItem[] {
  return [...items].sort((a, b) => {
    if (a.severityRank !== b.severityRank) return a.severityRank - b.severityRank;
    const aTs = a.timestamp ? Date.parse(a.timestamp) : 0;
    const bTs = b.timestamp ? Date.parse(b.timestamp) : 0;
    return bTs - aTs;
  });
}

export function buildCommandBriefRecommendationSummary(
  center: ExecutiveCommandCenter,
): { items: CommandCenterItem[]; totalCount: number } {
  const companionItems = filterRealCompanionRecommendations(center.companion_recommendations ?? []).map(
    mapCompanionRecommendationToItem,
  );
  const opportunityItems = buildOpportunitiesDataset(center);
  const merged = sortBySeverity(
    crossTabSafeguardDedupe(deduplicateCommandCenterItems([...companionItems, ...opportunityItems])),
  );

  return {
    items: merged.slice(0, COMMAND_BRIEF_RECOMMENDATIONS_LIMIT),
    totalCount: merged.length,
  };
}

export function buildCommandBriefHealthSummary(center: ExecutiveCommandCenter): {
  items: CommandCenterItem[];
  totalCount: number;
  overallScore: number | null;
} {
  const performance = buildPerformanceDataset(center);
  return {
    items: performance.healthItems.slice(0, COMMAND_BRIEF_HEALTH_LIMIT),
    totalCount: performance.healthItems.length,
    overallScore:
      typeof center.overall_health_score === "number" ? center.overall_health_score : null,
  };
}

export {
  buildCommandBriefNextAction,
  pickCommandBriefNextAction,
} from "@/lib/command-center/command-brief-next-action";
export type { CommandBriefNextActionCategory } from "@/lib/command-center/command-brief-next-action";
