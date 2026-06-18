import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  AlignmentItem,
  AwarenessItem,
  CoherenceItem,
  CompanionAdvisorItem,
  ConsciousnessSectionItem,
  ConsciousnessSectionKey,
  ConsciousnessSettings,
  EmergingSignalItem,
  ExecutiveAwarenessMetric,
  LongTermItem,
  NarrativeItem,
  OrganizationalConsciousnessCenter,
  ReflectionItem,
  StrategicItem,
} from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
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
  const allowed: OperationsStatusKey[] = ["completed", "not_allowed", "requires_attention", "information", "restricted", "verified", "waiting"];
  return allowed.includes(key as OperationsStatusKey) ? (key as OperationsStatusKey) : "information";
}

function parseSection(raw: unknown): ConsciousnessSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "organizational_awareness") as ConsciousnessSectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): ConsciousnessSectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseSettings(raw: unknown): ConsciousnessSettings {
  const d = asRecord(raw);
  return {
    consciousnessEnabled: asBool(d.consciousness_enabled, true),
    humanControlRequired: asBool(d.human_control_required, true),
  };
}

function parseAwareness(raw: unknown): AwarenessItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), awarenessArea: asString(d.awareness_area), areaName: asString(d.area_name),
    evaluationLabel: asString(d.evaluation_label), signalLabel: asString(d.signal_label),
    statusKey: asStatus(d.status_key), itemType: "awareness",
  };
}

function parseAlignment(raw: unknown): AlignmentItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), alignmentType: asString(d.alignment_type), title: asString(d.title),
    summary: asString(d.summary), evidenceLabel: asString(d.evidence_label),
    statusKey: asStatus(d.status_key), itemType: "alignment",
  };
}

function parseStrategic(raw: unknown): StrategicItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), strategicType: asString(d.strategic_type), title: asString(d.title),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "strategic",
  };
}

function parseNarrative(raw: unknown): NarrativeItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), narrativeType: asString(d.narrative_type), title: asString(d.title),
    narrative: asString(d.narrative), statusKey: asStatus(d.status_key), itemType: "narrative",
  };
}

function parseEmerging(raw: unknown): EmergingSignalItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), signalType: asString(d.signal_type), title: asString(d.title),
    summary: asString(d.summary), evidenceLabel: asString(d.evidence_label),
    statusKey: asStatus(d.status_key), itemType: "emerging_signal",
  };
}

function parseCoherence(raw: unknown): CoherenceItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), coherenceDimension: asString(d.coherence_dimension), dimensionName: asString(d.dimension_name),
    alignmentScoreLabel: asString(d.alignment_score_label), statusKey: asStatus(d.status_key), itemType: "coherence",
  };
}

function parseExecutive(raw: unknown): ExecutiveAwarenessMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
  };
}

function parseCompanion(raw: unknown): CompanionAdvisorItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), advisorType: asString(d.advisor_type), question: asString(d.question),
    insight: asString(d.insight), evidenceLabel: asString(d.evidence_label),
    status: asString(d.status), itemType: "companion",
  };
}

function parseLongTerm(raw: unknown): LongTermItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), horizonKey: asString(d.horizon_key), horizonLabel: asString(d.horizon_label),
    trendSummary: asString(d.trend_summary), statusKey: asStatus(d.status_key), itemType: "long_term",
  };
}

function parseReflection(raw: unknown): ReflectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), reflectionType: asString(d.reflection_type), title: asString(d.title),
    summary: asString(d.summary), statusKey: asStatus(d.status_key), itemType: "reflection",
  };
}

const emptyCenter: OrganizationalConsciousnessCenter = {
  found: false,
  consciousnessSettings: { consciousnessEnabled: true, humanControlRequired: true },
  awarenessEngine: [],
  organizationalAlignmentAnalysis: [],
  strategicAwarenessLayer: [],
  organizationalNarrativeEngine: [],
  emergingSignalDetection: [],
  organizationalCoherenceEngine: [],
  executiveAwarenessDashboard: [],
  companionStrategicAdvisor: [],
  longTermIntelligenceLayer: [],
  reflectionEngine: [],
  sections: {
    organizational_awareness: [], strategic_awareness: [], operational_awareness: [],
    cultural_awareness: [], organizational_alignment: [], long_term_trends: [], emerging_signals: [],
  },
  statistics: { awarenessCount: 0, alignmentCount: 0, signalCount: 0, reflectionCount: 0, companionCount: 0 },
};

export function parseOrganizationalConsciousnessCenter(raw: unknown): OrganizationalConsciousnessCenter {
  const d = asRecord(raw);
  if (!d.found) return { ...emptyCenter, error: asString(d.error) || undefined };

  const sections = asRecord(d.sections);
  const stats = asRecord(d.statistics);

  return {
    found: true,
    philosophy: asString(d.philosophy) || undefined,
    canExecutive: d.can_executive === true,
    canManage: d.can_manage === true,
    governanceNote: asString(d.governance_note) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
    consciousnessSettings: parseSettings(d.consciousness_settings),
    awarenessEngine: Array.isArray(d.awareness_engine) ? d.awareness_engine.map(parseAwareness) : [],
    organizationalAlignmentAnalysis: Array.isArray(d.organizational_alignment_analysis) ? d.organizational_alignment_analysis.map(parseAlignment) : [],
    strategicAwarenessLayer: Array.isArray(d.strategic_awareness_layer) ? d.strategic_awareness_layer.map(parseStrategic) : [],
    organizationalNarrativeEngine: Array.isArray(d.organizational_narrative_engine) ? d.organizational_narrative_engine.map(parseNarrative) : [],
    emergingSignalDetection: Array.isArray(d.emerging_signal_detection) ? d.emerging_signal_detection.map(parseEmerging) : [],
    organizationalCoherenceEngine: Array.isArray(d.organizational_coherence_engine) ? d.organizational_coherence_engine.map(parseCoherence) : [],
    executiveAwarenessDashboard: Array.isArray(d.executive_awareness_dashboard) ? d.executive_awareness_dashboard.map(parseExecutive) : [],
    companionStrategicAdvisor: Array.isArray(d.companion_strategic_advisor) ? d.companion_strategic_advisor.map(parseCompanion) : [],
    longTermIntelligenceLayer: Array.isArray(d.long_term_intelligence_layer) ? d.long_term_intelligence_layer.map(parseLongTerm) : [],
    reflectionEngine: Array.isArray(d.reflection_engine) ? d.reflection_engine.map(parseReflection) : [],
    sections: {
      organizational_awareness: parseSections(sections.organizational_awareness),
      strategic_awareness: parseSections(sections.strategic_awareness),
      operational_awareness: parseSections(sections.operational_awareness),
      cultural_awareness: parseSections(sections.cultural_awareness),
      organizational_alignment: parseSections(sections.organizational_alignment),
      long_term_trends: parseSections(sections.long_term_trends),
      emerging_signals: parseSections(sections.emerging_signals),
    },
    statistics: {
      awarenessCount: asNumber(stats.awareness_count),
      alignmentCount: asNumber(stats.alignment_count),
      signalCount: asNumber(stats.signal_count),
      reflectionCount: asNumber(stats.reflection_count),
      companionCount: asNumber(stats.companion_count),
    },
  };
}

export function parseOrganizationalConsciousnessAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
