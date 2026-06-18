import type {
  AttentionItem,
  CommandAdvisorSignal,
  CommandModule,
  EnterpriseCommandCenterMissionControl,
  HealthScore,
  IntelligenceSignal,
  MissionBriefing,
  MissionFeedEvent,
} from "./types";

function parseHealth(raw: unknown): HealthScore {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    score_key: typeof d.score_key === "string" ? d.score_key : undefined,
    score_domain: typeof d.score_domain === "string" ? d.score_domain : undefined,
    score_value: Number(d.score_value ?? 0),
    trend_direction: typeof d.trend_direction === "string" ? d.trend_direction : undefined,
  };
}

function parseModule(raw: unknown): CommandModule {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    module_key: typeof d.module_key === "string" ? d.module_key : undefined,
    module_name: typeof d.module_name === "string" ? d.module_name : undefined,
    module_type: typeof d.module_type === "string" ? d.module_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    health_score: Number(d.health_score ?? 0),
    summary_metrics:
      typeof d.summary_metrics === "object" && d.summary_metrics
        ? (d.summary_metrics as Record<string, unknown>)
        : undefined,
    route_path: typeof d.route_path === "string" ? d.route_path : undefined,
  };
}

function parseFeed(raw: unknown): MissionFeedEvent {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    event_key: typeof d.event_key === "string" ? d.event_key : undefined,
    event_type: typeof d.event_type === "string" ? d.event_type : undefined,
    event_title: typeof d.event_title === "string" ? d.event_title : undefined,
    event_summary: typeof d.event_summary === "string" ? d.event_summary : undefined,
    severity: typeof d.severity === "string" ? d.severity : undefined,
    source_module: typeof d.source_module === "string" ? d.source_module : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseAttention(raw: unknown): AttentionItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    item_key: typeof d.item_key === "string" ? d.item_key : undefined,
    item_title: typeof d.item_title === "string" ? d.item_title : undefined,
    attention_type: typeof d.attention_type === "string" ? d.attention_type : undefined,
    priority: typeof d.priority === "string" ? d.priority : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
  };
}

function parseBriefing(raw: unknown): MissionBriefing {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    briefing_key: typeof d.briefing_key === "string" ? d.briefing_key : undefined,
    briefing_title: typeof d.briefing_title === "string" ? d.briefing_title : undefined,
    briefing_period: typeof d.briefing_period === "string" ? d.briefing_period : undefined,
    executive_summary: typeof d.executive_summary === "string" ? d.executive_summary : undefined,
    recommended_actions: d.recommended_actions,
    generated_at: typeof d.generated_at === "string" ? d.generated_at : undefined,
  };
}

function parseIntelligence(raw: unknown): IntelligenceSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseAdvisor(raw: unknown): CommandAdvisorSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    observation: typeof d.observation === "string" ? d.observation : undefined,
    impact: typeof d.impact === "string" ? d.impact : undefined,
    recommendation: typeof d.recommendation === "string" ? d.recommendation : undefined,
    effort: typeof d.effort === "string" ? d.effort : undefined,
    confidence: typeof d.confidence === "string" ? d.confidence : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

export function parseEnterpriseCommandCenterMissionControl(
  raw: unknown
): EnterpriseCommandCenterMissionControl {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    strategic_intelligence_route:
      typeof d.strategic_intelligence_route === "string" ? d.strategic_intelligence_route : undefined,
    presence_route: typeof d.presence_route === "string" ? d.presence_route : undefined,
    executive_route: typeof d.executive_route === "string" ? d.executive_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    health_scores: Array.isArray(d.health_scores) ? d.health_scores.map(parseHealth) : [],
    command_modules: Array.isArray(d.command_modules) ? d.command_modules.map(parseModule) : [],
    mission_feed: Array.isArray(d.mission_feed) ? d.mission_feed.map(parseFeed) : [],
    attention_items: Array.isArray(d.attention_items) ? d.attention_items.map(parseAttention) : [],
    briefings: Array.isArray(d.briefings) ? d.briefings.map(parseBriefing) : [],
    intelligence_signals: Array.isArray(d.intelligence_signals) ? d.intelligence_signals.map(parseIntelligence) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseAdvisor) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    boardroom_dashboard:
      typeof d.boardroom_dashboard === "object" && d.boardroom_dashboard
        ? (d.boardroom_dashboard as Record<string, unknown>)
        : undefined,
  };
}
