import type {
  DecisionMemory,
  KnowledgeAsset,
  KnowledgeSource,
  LessonLearned,
  MemoryAdvisorSignal,
  OperationalMemory,
  OrganizationalMemoryCenter,
  RetentionItem,
} from "./types";

function parseSource(raw: unknown): KnowledgeSource {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    source_key: typeof d.source_key === "string" ? d.source_key : undefined,
    source_name: typeof d.source_name === "string" ? d.source_name : undefined,
    source_type: typeof d.source_type === "string" ? d.source_type : undefined,
    source_status: typeof d.source_status === "string" ? d.source_status : undefined,
  };
}

function parseAsset(raw: unknown): KnowledgeAsset {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    asset_key: typeof d.asset_key === "string" ? d.asset_key : undefined,
    asset_title: typeof d.asset_title === "string" ? d.asset_title : undefined,
    asset_type: typeof d.asset_type === "string" ? d.asset_type : undefined,
    asset_status: typeof d.asset_status === "string" ? d.asset_status : undefined,
    department: typeof d.department === "string" ? d.department : undefined,
    owner_name: typeof d.owner_name === "string" ? d.owner_name : undefined,
    freshness_score: Number(d.freshness_score ?? 0),
    validation_status: typeof d.validation_status === "string" ? d.validation_status : undefined,
  };
}

function parseDecision(raw: unknown): DecisionMemory {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    decision_key: typeof d.decision_key === "string" ? d.decision_key : undefined,
    decision_title: typeof d.decision_title === "string" ? d.decision_title : undefined,
    decision_owner: typeof d.decision_owner === "string" ? d.decision_owner : undefined,
    decision_status: typeof d.decision_status === "string" ? d.decision_status : undefined,
    reasoning: typeof d.reasoning === "string" ? d.reasoning : undefined,
    outcome_summary: typeof d.outcome_summary === "string" ? d.outcome_summary : undefined,
    review_at: typeof d.review_at === "string" ? d.review_at : undefined,
    created_at: typeof d.created_at === "string" ? d.created_at : undefined,
  };
}

function parseOperational(raw: unknown): OperationalMemory {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    record_key: typeof d.record_key === "string" ? d.record_key : undefined,
    record_title: typeof d.record_title === "string" ? d.record_title : undefined,
    record_type: typeof d.record_type === "string" ? d.record_type : undefined,
    record_status: typeof d.record_status === "string" ? d.record_status : undefined,
    department: typeof d.department === "string" ? d.department : undefined,
    outcome_summary: typeof d.outcome_summary === "string" ? d.outcome_summary : undefined,
  };
}

function parseLesson(raw: unknown): LessonLearned {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    lesson_key: typeof d.lesson_key === "string" ? d.lesson_key : undefined,
    lesson_title: typeof d.lesson_title === "string" ? d.lesson_title : undefined,
    lesson_type: typeof d.lesson_type === "string" ? d.lesson_type : undefined,
    lesson_summary: typeof d.lesson_summary === "string" ? d.lesson_summary : undefined,
    department: typeof d.department === "string" ? d.department : undefined,
  };
}

function parseRetention(raw: unknown): RetentionItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    id: typeof d.id === "string" ? d.id : undefined,
    retention_key: typeof d.retention_key === "string" ? d.retention_key : undefined,
    retention_title: typeof d.retention_title === "string" ? d.retention_title : undefined,
    gap_type: typeof d.gap_type === "string" ? d.gap_type : undefined,
    gap_status: typeof d.gap_status === "string" ? d.gap_status : undefined,
    priority: typeof d.priority === "string" ? d.priority : undefined,
    summary: typeof d.summary === "string" ? d.summary : undefined,
  };
}

function parseSignal(raw: unknown): MemoryAdvisorSignal {
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

export function parseOrganizationalMemoryCenter(raw: unknown): OrganizationalMemoryCenter {
  const d = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(d.found),
    has_access: Boolean(d.has_access),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    mission: typeof d.mission === "string" ? d.mission : undefined,
    abos_principle: typeof d.abos_principle === "string" ? d.abos_principle : undefined,
    knowledge_center_route: typeof d.knowledge_center_route === "string" ? d.knowledge_center_route : undefined,
    distinction_note: typeof d.distinction_note === "string" ? d.distinction_note : undefined,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    error: typeof d.error === "string" ? d.error : undefined,
    overview: typeof d.overview === "object" && d.overview ? (d.overview as Record<string, unknown>) : undefined,
    modules: Array.isArray(d.modules) ? (d.modules as Array<{ key?: string; route?: string }>) : [],
    knowledge_sources: Array.isArray(d.knowledge_sources) ? d.knowledge_sources.map(parseSource) : [],
    knowledge_assets: Array.isArray(d.knowledge_assets) ? d.knowledge_assets.map(parseAsset) : [],
    decisions: Array.isArray(d.decisions) ? d.decisions.map(parseDecision) : [],
    operational_memory: Array.isArray(d.operational_memory) ? d.operational_memory.map(parseOperational) : [],
    lessons_learned: Array.isArray(d.lessons_learned) ? d.lessons_learned.map(parseLesson) : [],
    retention_items: Array.isArray(d.retention_items) ? d.retention_items.map(parseRetention) : [],
    advisor_signals: Array.isArray(d.advisor_signals) ? d.advisor_signals.map(parseSignal) : [],
    audit_logs: Array.isArray(d.audit_logs) ? (d.audit_logs as Array<Record<string, unknown>>) : [],
    operations: typeof d.operations === "object" && d.operations ? (d.operations as Record<string, string>) : undefined,
    executive_dashboard: typeof d.executive_dashboard === "object" && d.executive_dashboard
      ? (d.executive_dashboard as Record<string, unknown>)
      : undefined,
  };
}
