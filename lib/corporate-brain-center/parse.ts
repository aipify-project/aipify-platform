import type { OperationsStatusKey } from "@/lib/operations-center/status-standard";
import type {
  BrainSectionItem,
  BrainSectionKey,
  BrainSettings,
  CompanionHistorianItem,
  CorporateBrainCenter,
  DecisionMemoryItem,
  ExecutiveMemoryMetric,
  HistoricalSearchItem,
  IntelligenceItem,
  KnowledgeGraphNode,
  LessonItem,
  MemoryEntity,
  PreservationItem,
  TimelineItem,
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

function parseSection(raw: unknown): BrainSectionItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), title: asString(d.title), summary: asString(d.summary),
    metricLabel: asString(d.metric_label), metricValue: asString(d.metric_value),
    statusKey: asStatus(d.status_key),
    sectionKey: asString(d.section_key, "organizational_memory") as BrainSectionKey,
    itemType: "section",
  };
}
function parseSections(raw: unknown): BrainSectionItem[] {
  return Array.isArray(raw) ? raw.map(parseSection) : [];
}

function parseSettings(raw: unknown): BrainSettings {
  const d = asRecord(raw);
  return {
    brainEnabled: asBool(d.brain_enabled, true),
    knowledgePreservationEnabled: asBool(d.knowledge_preservation_enabled, true),
  };
}

function parseEntity(raw: unknown): MemoryEntity {
  const d = asRecord(raw);
  return {
    id: asString(d.id), entityType: asString(d.entity_type), entityName: asString(d.entity_name),
    connectionLabel: asString(d.connection_label), recordCountLabel: asString(d.record_count_label),
    statusKey: asStatus(d.status_key), itemType: "memory_entity",
  };
}

function parseTimeline(raw: unknown): TimelineItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), timelineYear: asString(d.timeline_year), timelineMonth: asString(d.timeline_month),
    eventTitle: asString(d.event_title), decisionLabel: asString(d.decision_label),
    outcomeLabel: asString(d.outcome_label), impactLabel: asString(d.impact_label),
    statusKey: asStatus(d.status_key), itemType: "timeline",
  };
}

function parseDecision(raw: unknown): DecisionMemoryItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), decisionTitle: asString(d.decision_title), reasonLabel: asString(d.reason_label),
    alternativesLabel: asString(d.alternatives_label), expectedOutcomeLabel: asString(d.expected_outcome_label),
    actualOutcomeLabel: asString(d.actual_outcome_label), lessonsLabel: asString(d.lessons_label),
    ownerName: asString(d.owner_name), sourceLabel: asString(d.source_label),
    statusKey: asStatus(d.status_key), itemType: "decision",
  };
}

function parseGraphNode(raw: unknown): KnowledgeGraphNode {
  const d = asRecord(raw);
  return {
    id: asString(d.id), nodeType: asString(d.node_type), nodeName: asString(d.node_name),
    connectionCountLabel: asString(d.connection_count_label), relationshipLabel: asString(d.relationship_label),
    statusKey: asStatus(d.status_key), itemType: "graph_node",
  };
}

function parseLesson(raw: unknown): LessonItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), lessonType: asString(d.lesson_type), title: asString(d.title),
    summary: asString(d.summary), lessonLabel: asString(d.lesson_label), ownerName: asString(d.owner_name),
    statusKey: asStatus(d.status_key), itemType: "lesson",
  };
}

function parseSearch(raw: unknown): HistoricalSearchItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), questionType: asString(d.question_type), question: asString(d.question),
    answer: asString(d.answer), sourceLabel: asString(d.source_label),
    status: asString(d.status), itemType: "historical_search",
  };
}

function parseExecutive(raw: unknown): ExecutiveMemoryMetric {
  const d = asRecord(raw);
  return {
    id: asString(d.id), metricKey: asString(d.metric_key), metricValue: asString(d.metric_value),
    trendLabel: asString(d.trend_label), statusKey: asStatus(d.status_key), itemType: "executive",
  };
}

function parseCompanion(raw: unknown): CompanionHistorianItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), historianType: asString(d.historian_type), question: asString(d.question),
    historicalContext: asString(d.historical_context), evidenceLabel: asString(d.evidence_label),
    status: asString(d.status), itemType: "companion",
  };
}

function parseIntelligence(raw: unknown): IntelligenceItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), intelType: asString(d.intel_type), title: asString(d.title),
    summary: asString(d.summary), trendLabel: asString(d.trend_label),
    statusKey: asStatus(d.status_key), itemType: "intelligence",
  };
}

function parsePreservation(raw: unknown): PreservationItem {
  const d = asRecord(raw);
  return {
    id: asString(d.id), preservationType: asString(d.preservation_type), title: asString(d.title),
    summary: asString(d.summary), statusKey: asStatus(d.status_key), itemType: "preservation",
  };
}

const emptyCenter: CorporateBrainCenter = {
  found: false,
  brainSettings: { brainEnabled: true, knowledgePreservationEnabled: true },
  memoryEngine: [],
  organizationalTimeline: [],
  decisionMemory: [],
  corporateKnowledgeGraph: [],
  lessonsLearnedEngine: [],
  historicalSearch: [],
  executiveMemoryDashboard: [],
  companionCorporateHistorian: [],
  corporateIntelligenceLayer: [],
  knowledgePreservation: [],
  sections: {
    organizational_memory: [], business_knowledge: [], historical_decisions: [],
    lessons_learned: [], institutional_knowledge: [], knowledge_timeline: [], corporate_intelligence: [],
  },
  statistics: { entityCount: 0, timelineCount: 0, decisionCount: 0, graphCount: 0, lessonCount: 0, companionCount: 0 },
};

export function parseCorporateBrainCenter(raw: unknown): CorporateBrainCenter {
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
    brainSettings: parseSettings(d.brain_settings),
    memoryEngine: Array.isArray(d.memory_engine) ? d.memory_engine.map(parseEntity) : [],
    organizationalTimeline: Array.isArray(d.organizational_timeline) ? d.organizational_timeline.map(parseTimeline) : [],
    decisionMemory: Array.isArray(d.decision_memory) ? d.decision_memory.map(parseDecision) : [],
    corporateKnowledgeGraph: Array.isArray(d.corporate_knowledge_graph) ? d.corporate_knowledge_graph.map(parseGraphNode) : [],
    lessonsLearnedEngine: Array.isArray(d.lessons_learned_engine) ? d.lessons_learned_engine.map(parseLesson) : [],
    historicalSearch: Array.isArray(d.historical_search) ? d.historical_search.map(parseSearch) : [],
    executiveMemoryDashboard: Array.isArray(d.executive_memory_dashboard) ? d.executive_memory_dashboard.map(parseExecutive) : [],
    companionCorporateHistorian: Array.isArray(d.companion_corporate_historian) ? d.companion_corporate_historian.map(parseCompanion) : [],
    corporateIntelligenceLayer: Array.isArray(d.corporate_intelligence_layer) ? d.corporate_intelligence_layer.map(parseIntelligence) : [],
    knowledgePreservation: Array.isArray(d.knowledge_preservation) ? d.knowledge_preservation.map(parsePreservation) : [],
    sections: {
      organizational_memory: parseSections(sections.organizational_memory),
      business_knowledge: parseSections(sections.business_knowledge),
      historical_decisions: parseSections(sections.historical_decisions),
      lessons_learned: parseSections(sections.lessons_learned),
      institutional_knowledge: parseSections(sections.institutional_knowledge),
      knowledge_timeline: parseSections(sections.knowledge_timeline),
      corporate_intelligence: parseSections(sections.corporate_intelligence),
    },
    statistics: {
      entityCount: asNumber(stats.entity_count),
      timelineCount: asNumber(stats.timeline_count),
      decisionCount: asNumber(stats.decision_count),
      graphCount: asNumber(stats.graph_count),
      lessonCount: asNumber(stats.lesson_count),
      companionCount: asNumber(stats.companion_count),
    },
  };
}

export function parseCorporateBrainAction(raw: unknown): { ok: boolean; error?: string } {
  const d = asRecord(raw);
  return { ok: d.ok === true, error: asString(d.error) || undefined };
}
