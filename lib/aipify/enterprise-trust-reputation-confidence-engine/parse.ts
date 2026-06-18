import type {
  EnterpriseTrustConfidenceCenter,
  TrustAdvisorSignal,
  TrustIncident,
  TrustIntelligenceSignal,
  TrustMilestone,
  TrustReliabilityMetric,
  TrustReputationRecord,
  TrustServiceQuality,
  TrustSignal,
  TrustTransparencyItem,
} from "./types";

function parseReliability(raw: unknown): TrustReliabilityMetric {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    metric_key: typeof d.metric_key === "string" ? d.metric_key : undefined,
    metric_title: typeof d.metric_title === "string" ? d.metric_title : undefined,
    metric_type: typeof d.metric_type === "string" ? d.metric_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    score: Number(d.score ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseTransparency(raw: unknown): TrustTransparencyItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    item_key: typeof d.item_key === "string" ? d.item_key : undefined,
    item_title: typeof d.item_title === "string" ? d.item_title : undefined,
    item_type: typeof d.item_type === "string" ? d.item_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    visibility: typeof d.visibility === "string" ? d.visibility : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseTrustSignal(raw: unknown): TrustSignal {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    signal_key: typeof d.signal_key === "string" ? d.signal_key : undefined,
    signal_title: typeof d.signal_title === "string" ? d.signal_title : undefined,
    signal_type: typeof d.signal_type === "string" ? d.signal_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    value_text: typeof d.value_text === "string" ? d.value_text : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseReputation(raw: unknown): TrustReputationRecord {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    record_key: typeof d.record_key === "string" ? d.record_key : undefined,
    record_title: typeof d.record_title === "string" ? d.record_title : undefined,
    record_type: typeof d.record_type === "string" ? d.record_type : undefined,
    sentiment: typeof d.sentiment === "string" ? d.sentiment : undefined,
    score: Number(d.score ?? 0),
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseServiceQuality(raw: unknown): TrustServiceQuality {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    quality_key: typeof d.quality_key === "string" ? d.quality_key : undefined,
    quality_title: typeof d.quality_title === "string" ? d.quality_title : undefined,
    quality_domain: typeof d.quality_domain === "string" ? d.quality_domain : undefined,
    score: Number(d.score ?? 0),
    trend: typeof d.trend === "string" ? d.trend : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseIncident(raw: unknown): TrustIncident {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    incident_key: typeof d.incident_key === "string" ? d.incident_key : undefined,
    incident_title: typeof d.incident_title === "string" ? d.incident_title : undefined,
    severity: typeof d.severity === "string" ? d.severity : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    root_cause: typeof d.root_cause === "string" ? d.root_cause : undefined,
    resolution_summary: typeof d.resolution_summary === "string" ? d.resolution_summary : undefined,
    lessons_learned: typeof d.lessons_learned === "string" ? d.lessons_learned : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseMilestone(raw: unknown): TrustMilestone {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    milestone_key: typeof d.milestone_key === "string" ? d.milestone_key : undefined,
    milestone_title: typeof d.milestone_title === "string" ? d.milestone_title : undefined,
    milestone_type: typeof d.milestone_type === "string" ? d.milestone_type : undefined,
    status: typeof d.status === "string" ? d.status : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseIntelligence(raw: unknown): TrustIntelligenceSignal {
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

function parseAdvisor(raw: unknown): TrustAdvisorSignal {
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

function parseArray<T>(raw: unknown, parser: (item: unknown) => T): T[] {
  if (!Array.isArray(raw)) return [];
  return raw.map(parser);
}

export function parseEnterpriseTrustConfidenceCenter(raw: unknown): EnterpriseTrustConfidenceCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: d.found === true,
    has_access: d.has_access === true,
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    trust_engine_route: typeof d.trust_engine_route === "string" ? d.trust_engine_route : undefined,
    trust_reputation_route: typeof d.trust_reputation_route === "string" ? d.trust_reputation_route : undefined,
    license_route: typeof d.license_route === "string" ? d.license_route : undefined,
    security_settings_route: typeof d.security_settings_route === "string" ? d.security_settings_route : undefined,
    platform_excellence_route: typeof d.platform_excellence_route === "string" ? d.platform_excellence_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview !== null ? (d.overview as Record<string, unknown>) : undefined,
    settings: typeof d.settings === "object" && d.settings !== null ? (d.settings as Record<string, unknown>) : undefined,
    modules: parseArray(d.modules, (m) => m as { key?: string; route?: string }),
    core_languages: Array.isArray(d.core_languages) ? d.core_languages.filter((l): l is string => typeof l === "string") : undefined,
    reliability_metrics: parseArray(d.reliability_metrics, parseReliability),
    transparency_items: parseArray(d.transparency_items, parseTransparency),
    trust_signals: parseArray(d.trust_signals, parseTrustSignal),
    reputation_records: parseArray(d.reputation_records, parseReputation),
    service_quality: parseArray(d.service_quality, parseServiceQuality),
    incidents: parseArray(d.incidents, parseIncident),
    trust_milestones: parseArray(d.trust_milestones, parseMilestone),
    intelligence_signals: parseArray(d.intelligence_signals, parseIntelligence),
    advisor_signals: parseArray(d.advisor_signals, parseAdvisor),
    audit_logs: parseArray(d.audit_logs, (l) => l as Record<string, unknown>),
    executive_dashboard:
      typeof d.executive_dashboard === "object" && d.executive_dashboard !== null
        ? (d.executive_dashboard as Record<string, unknown>)
        : undefined,
    governance:
      typeof d.governance === "object" && d.governance !== null ? (d.governance as Record<string, unknown>) : undefined,
  };
}
