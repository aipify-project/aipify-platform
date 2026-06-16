import type {
  MatrixQuadrant,
  PrioritizationCategory,
  PrioritizationDashboard,
  PrioritizationDetail,
  PrioritizationItem,
  PrioritizationListResponse,
  PrioritizationMatrix,
  PrioritizationRecommendation,
  PrioritizationScoreRecord,
  PriorityStatus,
} from "./types";

const CATEGORIES = new Set<PrioritizationCategory>([
  "strategic_initiative", "operational_improvement", "customer_initiative", "technology_initiative",
  "risk_mitigation", "compliance_requirement", "revenue_opportunity", "workforce_initiative",
  "innovation_opportunity", "custom_category",
]);
const STATUSES = new Set<PriorityStatus>([
  "under_evaluation", "recommended", "high_priority", "medium_priority", "low_priority", "deferred", "completed",
]);
const QUADRANTS = new Set<MatrixQuadrant>(["quick_wins", "major_projects", "fill_ins", "reconsider"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function parseItem(raw: unknown): PrioritizationItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const cat = str(d.category, "strategic_initiative") as PrioritizationCategory;
  const status = str(d.priority_status, "under_evaluation") as PriorityStatus;
  const quad = str(d.matrix_quadrant) as MatrixQuadrant;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description) || undefined,
    description_full: str(d.description_full) || undefined,
    category: CATEGORIES.has(cat) ? cat : "strategic_initiative",
    owner_id: str(d.owner_id) || null,
    owner_name: str(d.owner_name, "Unassigned"),
    executive_sponsor_id: str(d.executive_sponsor_id) || null,
    executive_sponsor_name: str(d.executive_sponsor_name, "Unassigned"),
    priority_status: STATUSES.has(status) ? status : "under_evaluation",
    strategic_alignment_score: num(d.strategic_alignment_score, 3),
    impact_score: num(d.impact_score, 3),
    urgency_score: num(d.urgency_score, 3),
    effort_estimate: num(d.effort_estimate, 3),
    capacity_requirement: num(d.capacity_requirement, 3),
    scoring_factors: typeof d.scoring_factors === "object" && d.scoring_factors ? d.scoring_factors as Record<string, unknown> : undefined,
    scoring_weights: typeof d.scoring_weights === "object" && d.scoring_weights ? d.scoring_weights as Record<string, unknown> : undefined,
    composite_score: typeof d.composite_score === "number" ? d.composite_score : num(d.composite_score as unknown),
    matrix_quadrant: QUADRANTS.has(quad) ? quad : undefined,
    due_date: str(d.due_date) || null,
    dependencies: str(d.dependencies_full) || str(d.dependencies) || undefined,
    dependencies_full: str(d.dependencies_full) || undefined,
    capacity_considerations: str(d.capacity_considerations_full) || str(d.capacity_considerations) || undefined,
    capacity_considerations_full: str(d.capacity_considerations_full) || undefined,
    capacity_conflict: d.capacity_conflict === true,
    notes: str(d.notes_full) || str(d.notes) || undefined,
    notes_full: str(d.notes_full) || undefined,
    created_at: str(d.created_at),
    updated_at: str(d.updated_at),
  };
}

function parseRecs(raw: unknown): PrioritizationRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((r) => {
    const row = r as Record<string, unknown>;
    return { id: str(row.id), key: str(row.key), priority: str(row.priority), item_id: str(row.item_id) || undefined };
  });
}

function parseMatrix(raw: unknown): PrioritizationMatrix | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    quick_wins: Array.isArray(d.quick_wins) ? d.quick_wins.map(parseItem) : [],
    major_projects: Array.isArray(d.major_projects) ? d.major_projects.map(parseItem) : [],
    fill_ins: Array.isArray(d.fill_ins) ? d.fill_ins.map(parseItem) : [],
    reconsider: Array.isArray(d.reconsider) ? d.reconsider.map(parseItem) : [],
  };
}

function parseDashboard(raw: unknown): PrioritizationDashboard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    highest_priority: Array.isArray(d.highest_priority) ? d.highest_priority.map(parseItem) : [],
    deferred: Array.isArray(d.deferred) ? d.deferred.map(parseItem) : [],
    capacity_conflicts: typeof d.capacity_conflicts === "number" ? d.capacity_conflicts : 0,
    strategic_alignment_overview: typeof d.strategic_alignment_overview === "number" ? d.strategic_alignment_overview : 0,
    recently_reprioritized: Array.isArray(d.recently_reprioritized)
      ? d.recently_reprioritized.map((r) => {
          const row = r as Record<string, unknown>;
          const quad = str(row.matrix_quadrant) as MatrixQuadrant;
          return {
            id: str(row.id),
            item_id: str(row.item_id),
            priority_status: str(row.priority_status) || undefined,
            composite_score: typeof row.composite_score === "number" ? row.composite_score : undefined,
            matrix_quadrant: QUADRANTS.has(quad) ? quad : undefined,
            created_at: str(row.created_at),
            performed_by: str(row.performed_by),
          };
        })
      : [],
  };
}

export function parsePrioritizationList(data: unknown): PrioritizationListResponse {
  if (!data || typeof data !== "object") return { found: false, items: [] };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parseItem) : [],
    dashboard: parseDashboard(d.dashboard),
    matrix: parseMatrix(d.matrix),
    recommendations: parseRecs(d.recommendations),
    principle: str(d.principle),
  };
}

export function parsePrioritizationDetail(data: unknown): PrioritizationDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  const audit = Array.isArray(d.audit_history)
    ? d.audit_history.map((a) => {
        const row = a as Record<string, unknown>;
        return { id: str(row.id), event_type: str(row.event_type), description: str(row.description), created_at: str(row.created_at), performed_by: str(row.performed_by) };
      })
    : [];
  const scoreHistory: PrioritizationScoreRecord[] = Array.isArray(d.recommendation_history)
    ? d.recommendation_history.map((h) => {
        const row = h as Record<string, unknown>;
        const quad = str(row.matrix_quadrant) as MatrixQuadrant;
        return {
          id: str(row.id),
          priority_status: str(row.priority_status) || undefined,
          strategic_alignment_score: typeof row.strategic_alignment_score === "number" ? row.strategic_alignment_score : undefined,
          impact_score: typeof row.impact_score === "number" ? row.impact_score : undefined,
          urgency_score: typeof row.urgency_score === "number" ? row.urgency_score : undefined,
          effort_estimate: typeof row.effort_estimate === "number" ? row.effort_estimate : undefined,
          capacity_requirement: typeof row.capacity_requirement === "number" ? row.capacity_requirement : undefined,
          composite_score: typeof row.composite_score === "number" ? row.composite_score : undefined,
          matrix_quadrant: QUADRANTS.has(quad) ? quad : undefined,
          notes: str(row.notes) || undefined,
          created_at: str(row.created_at),
          performed_by: str(row.performed_by),
        };
      })
    : [];
  return {
    found: true,
    can_manage: d.can_manage === true,
    item: d.item ? parseItem(d.item) : undefined,
    related_goals: Array.isArray(d.related_goals) ? d.related_goals.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_follow_ups: Array.isArray(d.related_follow_ups) ? d.related_follow_ups.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_risks: Array.isArray(d.related_risks) ? d.related_risks.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    related_strategic_initiatives: Array.isArray(d.related_strategic_initiatives) ? d.related_strategic_initiatives.map((r) => { const row = r as Record<string, unknown>; return { id: str(row.id), title: str(row.title), status: str(row.status) }; }) : [],
    recommendation_history: scoreHistory,
    activity_timeline: audit,
    audit_history: audit,
    recommendations: parseRecs(d.recommendations),
  };
}

export function parsePrioritizationItem(data: unknown): PrioritizationItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.item) return parseItem(d.item);
  return parseItem(d);
}
