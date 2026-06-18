import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  BriefingAction,
  BriefingHighlight,
  BusinessOsCommandCenter,
  CommandSectionItem,
  CommandSectionKey,
  CompanionItem,
  CrossIntelligenceItem,
  EventStreamItem,
  MissionMetric,
  MorningBriefing,
  PulseMetric,
  RadarItem,
  RadarTier,
  ReadinessItem,
  ReadinessModeKey,
  WidgetItem,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function asBool(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asStatus(value: unknown): OperationsStatusKey {
  const key = asString(value, "information");
  const allowed: OperationsStatusKey[] = [
    "completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting",
  ];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function asRadarTier(value: unknown): RadarTier {
  const key = asString(value, "information");
  const allowed: RadarTier[] = ["healthy", "emerging_risk", "critical", "information"];
  return allowed.includes(key as RadarTier) ? (key as RadarTier) : "information";
}

function parseSection(raw: unknown): CommandSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    title: asString(d.title),
    summary: asString(d.summary),
    metricLabel: asString(d.metric_label),
    metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "executive_overview") as CommandSectionKey,
    itemType: "section",
  };
}

function parseSections(raw: unknown): CommandSectionItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parseSection);
}

function parseMission(raw: unknown): MissionMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    metricKey: asString(d.metric_key),
    metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label),
    statusKey: asStatus(d.status_key),
    itemType: "mission",
  };
}

function parseRadar(raw: unknown): RadarItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    radarTier: asRadarTier(d.radar_tier),
    title: asString(d.title),
    summary: asString(d.summary),
    impactLevel: asString(d.impact_level),
    statusKey: asStatus(d.status_key),
    itemType: "radar",
  };
}

function parsePulse(raw: unknown): PulseMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    periodKey: asString(d.period_key, "today") as PulseMetric["periodKey"],
    metricCategory: asString(d.metric_category),
    metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label),
    statusKey: asStatus(d.status_key),
    itemType: "pulse",
  };
}

function parseEvent(raw: unknown): EventStreamItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    eventSource: asString(d.event_source),
    eventType: asString(d.event_type),
    title: asString(d.title),
    summary: asString(d.summary),
    statusKey: asStatus(d.status_key),
    createdAt: asString(d.created_at) || undefined,
    itemType: "event",
  };
}

function parseBriefing(raw: unknown): MorningBriefing {
  const d = asRecord(raw);
  const highlights: BriefingHighlight[] = Array.isArray(d.highlights)
    ? d.highlights.map((h) => {
        const item = asRecord(h);
        return { text: asString(item.text), statusKey: asStatus(item.status_key) };
      })
    : [];
  const recommendedActions: BriefingAction[] = Array.isArray(d.recommended_actions)
    ? d.recommended_actions.map((a) => {
        const item = asRecord(a);
        return { rank: asNumber(item.rank), action: asString(item.action), reason: asString(item.reason) };
      })
    : [];
  return {
    id: asString(d.id) || undefined,
    greeting: asString(d.greeting),
    sinceLoginSummary: asString(d.since_login_summary),
    highlights,
    recommendedActions,
    statusKey: asStatus(d.status_key),
    itemType: "briefing",
  };
}

function parseWidget(raw: unknown): WidgetItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    widgetKey: asString(d.widget_key),
    isPinned: asBool(d.is_pinned, true),
    isHidden: asBool(d.is_hidden),
    sortOrder: asNumber(d.sort_order, 100),
    size: asString(d.size, "medium"),
    itemType: "widget",
  };
}

function parseCrossIntel(raw: unknown): CrossIntelligenceItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    correlationTitle: asString(d.correlation_title),
    observation: asString(d.observation),
    suggestedAction: asString(d.suggested_action),
    statusKey: asStatus(d.status_key),
    itemType: "cross_intel",
  };
}

function parseCompanion(raw: unknown): CompanionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    capabilityType: asString(d.capability_type),
    recommendation: asString(d.recommendation),
    reason: asString(d.reason),
    status: asString(d.status),
    itemType: "companion",
  };
}

function parseReadiness(raw: unknown): ReadinessItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id),
    modeKey: asString(d.mode_key, "board_meeting") as ReadinessModeKey,
    title: asString(d.title),
    keyMetrics: asString(d.key_metrics),
    risks: asString(d.risks),
    achievements: asString(d.achievements),
    priorities: asString(d.priorities),
    statusKey: asStatus(d.status_key),
    itemType: "readiness",
  };
}

const emptyBriefing: MorningBriefing = {
  greeting: "",
  sinceLoginSummary: "",
  highlights: [],
  recommendedActions: [],
  statusKey: "information",
  itemType: "briefing",
};

const emptyCenter: BusinessOsCommandCenter = {
  found: false,
  readinessMode: "standard",
  executiveMissionControl: [],
  organizationRadar: [],
  liveBusinessPulse: [],
  unifiedEventStream: [],
  morningBriefing: emptyBriefing,
  widgets: [],
  crossSystemIntelligence: [],
  companionAdvisor: [],
  executiveReadiness: [],
  sections: {
    executiveOverview: [],
    operationalOverview: [],
    financialOverview: [],
    customerOverview: [],
    workforceOverview: [],
    intelligenceOverview: [],
    companionRecommendations: [],
  },
  statistics: { missionCount: 0, radarCount: 0, eventCount: 0, widgetCount: 0, companionCount: 0 },
};

export function parseBusinessOsCommandCenter(raw: unknown): BusinessOsCommandCenter {
  const d = asRecord(raw);
  if (!d.found) {
    return { ...emptyCenter, error: asString(d.error) || undefined };
  }

  const sections = asRecord(d.sections);
  const stats = asRecord(d.statistics);
  const links = asRecord(d.links);
  const briefingRaw = d.morning_briefing;

  return {
    found: true,
    philosophy: asString(d.philosophy) || undefined,
    canExecutive: d.can_executive === true,
    canManage: d.can_manage === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    readinessMode: asString(d.readiness_mode, "standard"),
    executiveMissionControl: Array.isArray(d.executive_mission_control) ? d.executive_mission_control.map(parseMission) : [],
    organizationRadar: Array.isArray(d.organization_radar) ? d.organization_radar.map(parseRadar) : [],
    liveBusinessPulse: Array.isArray(d.live_business_pulse) ? d.live_business_pulse.map(parsePulse) : [],
    unifiedEventStream: Array.isArray(d.unified_event_stream) ? d.unified_event_stream.map(parseEvent) : [],
    morningBriefing: briefingRaw && Object.keys(asRecord(briefingRaw)).length > 0 ? parseBriefing(briefingRaw) : emptyBriefing,
    widgets: Array.isArray(d.widgets) ? d.widgets.map(parseWidget) : [],
    crossSystemIntelligence: Array.isArray(d.cross_system_intelligence) ? d.cross_system_intelligence.map(parseCrossIntel) : [],
    companionAdvisor: Array.isArray(d.companion_advisor) ? d.companion_advisor.map(parseCompanion) : [],
    executiveReadiness: Array.isArray(d.executive_readiness) ? d.executive_readiness.map(parseReadiness) : [],
    sections: {
      executiveOverview: parseSections(sections.executive_overview),
      operationalOverview: parseSections(sections.operational_overview),
      financialOverview: parseSections(sections.financial_overview),
      customerOverview: parseSections(sections.customer_overview),
      workforceOverview: parseSections(sections.workforce_overview),
      intelligenceOverview: parseSections(sections.intelligence_overview),
      companionRecommendations: parseSections(sections.companion_recommendations),
    },
    statistics: {
      missionCount: asNumber(stats.mission_count),
      radarCount: asNumber(stats.radar_count),
      eventCount: asNumber(stats.event_count),
      widgetCount: asNumber(stats.widget_count),
      companionCount: asNumber(stats.companion_count),
    },
    links: {
      presenceFeed: asString(links.presence_feed) || undefined,
      desktopConnect: asString(links.desktop_connect) || undefined,
      legacyMissionControl: asString(links.legacy_mission_control) || undefined,
    },
  };
}

export function parseBusinessOsCommandCenterAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
