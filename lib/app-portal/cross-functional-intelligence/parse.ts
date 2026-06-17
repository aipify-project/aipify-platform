import type {
  CFIActionResult,
  CFIInsightItem,
  CFIRecommendation,
  CFITimelineEvent,
  CollaborationRecord,
  CrossFunctionalIntelligenceOverview,
  Dependency,
  FrictionRecord,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown): number | undefined { return typeof v === "number" ? v : undefined; }
function bool(v: unknown): boolean { return v === true; }
function strArr(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseDependencies(raw: unknown): Dependency[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id), dependency_key: str(d.dependency_key),
      from_department: str(d.from_department), to_department: str(d.to_department),
      dependency_type: str(d.dependency_type), dependency_strength: str(d.dependency_strength),
      risk_level: str(d.risk_level), review_status: str(d.review_status),
      leadership_owner: str(d.leadership_owner), description: str(d.description),
      recommended_review: str(d.recommended_review),
    };
  });
}

function parseCollaboration(raw: unknown): CollaborationRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id), collaboration_key: str(d.collaboration_key),
      department_a: str(d.department_a), department_b: str(d.department_b),
      category: str(d.category), collaboration_type: str(d.collaboration_type),
      health_status: str(d.health_status), description: str(d.description),
      improvement_opportunity: str(d.improvement_opportunity),
      priority: str(d.priority), leadership_owner: str(d.leadership_owner),
    };
  });
}

function parseFriction(raw: unknown): FrictionRecord[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id), friction_key: str(d.friction_key), title: str(d.title),
      friction_type: str(d.friction_type), description: str(d.description),
      affected_departments: strArr(d.affected_departments),
      severity: str(d.severity), recommended_action: str(d.recommended_action),
      status: str(d.status) as FrictionRecord["status"],
    };
  });
}

function insightItems(raw: unknown): CFIInsightItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => { const d = i as Record<string,unknown>; return { id: str(d.id), title: str(d.title) }; });
}

function parseRecommendations(raw: unknown): CFIRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => { const d = i as Record<string,unknown>; return { id: str(d.id), key: str(d.key) }; });
}

function parseTimeline(raw: unknown): CFITimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string,unknown>;
    return { id: str(d.id), entity_id: str(d.entity_id) || undefined,
      event_type: str(d.event_type), description: str(d.description), created_at: str(d.created_at) };
  });
}

export function parseCFIOverview(data: unknown): CrossFunctionalIntelligenceOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    can_full: bool(d.can_full),
    can_view: bool(d.can_view),
    can_review: bool(d.can_review),
    has_intelligence_data: bool(d.has_intelligence_data),
    cross_functional_health_score: num(d.cross_functional_health_score),
    department_collaboration_score: num(d.department_collaboration_score),
    organizational_dependency_score: num(d.organizational_dependency_score),
    process_alignment_score: num(d.process_alignment_score),
    executive_summary: str(d.executive_summary),
    areas_requiring_attention: insightItems(d.areas_requiring_attention),
    improvement_opportunities: insightItems(d.improvement_opportunities),
    dependencies: parseDependencies(d.dependencies),
    collaboration: parseCollaboration(d.collaboration),
    friction: parseFriction(d.friction),
    recommendations: parseRecommendations(d.recommendations),
    advisory_note: str(d.advisory_note),
    principle: str(d.principle),
  };
}

export function parseCFITimeline(data: unknown): CFITimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  return parseTimeline((data as Record<string,unknown>).events);
}

export function parseCFIActionResult(data: unknown): CFIActionResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string,unknown>;
  return { found: bool(d.found), message: str(d.message) || undefined,
    review_id: str(d.review_id) || undefined };
}
