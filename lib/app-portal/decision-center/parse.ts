import type {
  DecisionCategory,
  DecisionDetail,
  DecisionImpactLevel,
  DecisionItem,
  DecisionListResponse,
  DecisionStatus,
  DecisionSuggestion,
  WouldRepeat,
} from "./types";

const CATS = new Set<DecisionCategory>([
  "strategic", "financial", "operational", "customer_experience", "human_resources",
  "security", "technology", "compliance", "marketing", "growth",
]);
const STATUSES = new Set<DecisionStatus>([
  "proposed", "under_review", "approved", "rejected", "implemented", "evaluated",
]);
const IMPACTS = new Set<DecisionImpactLevel>(["low", "moderate", "high", "critical"]);
const REPEAT = new Set<WouldRepeat>(["yes", "partially", "no"]);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function parseContributors(raw: unknown): DecisionItem["contributors"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((c) => {
    const row = c as Record<string, unknown>;
    return { id: str(row.id) || undefined, name: str(row.name) || undefined };
  });
}

function parseEvidence(raw: unknown): DecisionItem["supporting_evidence"] {
  if (!Array.isArray(raw)) return [];
  return raw.map((e) => {
    const row = e as Record<string, unknown>;
    return {
      title: str(row.title) || undefined,
      reference: str(row.reference) || undefined,
      url: str(row.url) || undefined,
    };
  });
}

function parseItem(raw: unknown): DecisionItem {
  const d = (raw ?? {}) as Record<string, unknown>;
  const cat = str(d.category, "operational") as DecisionCategory;
  const st = str(d.status, "proposed") as DecisionStatus;
  const imp = str(d.impact_level, "moderate") as DecisionImpactLevel;
  const wr = str(d.would_repeat) as WouldRepeat;
  return {
    id: str(d.id),
    title: str(d.title),
    description: str(d.description_full) || str(d.description),
    description_full: str(d.description_full) || str(d.description) || undefined,
    category: CATS.has(cat) ? cat : "operational",
    decision_owner_id: str(d.decision_owner_id) || undefined,
    decision_owner: str(d.decision_owner, "Unassigned"),
    contributors: parseContributors(d.contributors),
    decision_date: str(d.decision_date),
    status: STATUSES.has(st) ? st : "proposed",
    impact_level: IMPACTS.has(imp) ? imp : "moderate",
    expected_outcome: str(d.expected_outcome),
    supporting_evidence: parseEvidence(d.supporting_evidence),
    related_business_packs: Array.isArray(d.related_business_packs)
      ? d.related_business_packs.map((p) => str(p)).filter(Boolean)
      : [],
    linked_follow_up_ids: Array.isArray(d.linked_follow_up_ids)
      ? d.linked_follow_up_ids.map((p) => str(p)).filter(Boolean)
      : [],
    outcome_rating: typeof d.outcome_rating === "number" ? d.outcome_rating : undefined,
    lessons_learned: str(d.lessons_learned) || undefined,
    unexpected_consequences: str(d.unexpected_consequences) || undefined,
    would_repeat: REPEAT.has(wr) ? wr : undefined,
    evaluated_at: str(d.evaluated_at) || undefined,
    created_at: str(d.created_at) || undefined,
    updated_at: str(d.updated_at) || undefined,
  };
}

function parseSuggestion(raw: unknown): DecisionSuggestion {
  const d = (raw ?? {}) as Record<string, unknown>;
  const cat = str(d.category, "operational") as DecisionCategory;
  const imp = str(d.impact_level, "moderate") as DecisionImpactLevel;
  return {
    id: str(d.id),
    title: str(d.title),
    category: CATS.has(cat) ? cat : "operational",
    impact_level: IMPACTS.has(imp) ? imp : "moderate",
    requires_review: d.requires_review !== false,
  };
}

function parseTimeline(raw: unknown) {
  if (!Array.isArray(raw)) return [];
  return raw.map((t) => {
    const row = t as Record<string, unknown>;
    return {
      id: str(row.id),
      event_type: str(row.event_type),
      description: str(row.description),
      created_at: str(row.created_at),
      performed_by: str(row.performed_by),
    };
  });
}

export function parseDecisionList(data: unknown): DecisionListResponse {
  if (!data || typeof data !== "object") {
    return { found: false, items: [], suggestions: [] };
  }
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    items: Array.isArray(d.items) ? d.items.map(parseItem) : [],
    suggestions: Array.isArray(d.suggestions) ? d.suggestions.map(parseSuggestion) : [],
    principle: str(d.principle),
  };
}

export function parseDecisionDetail(data: unknown): DecisionDetail {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  if (d.found !== true) return { found: false };
  const outcome = d.outcome_evaluation as Record<string, unknown> | null | undefined;
  const wr = outcome ? str(outcome.would_repeat) as WouldRepeat : undefined;
  return {
    found: true,
    can_manage: d.can_manage === true,
    decision: d.decision ? parseItem(d.decision) : undefined,
    timeline: parseTimeline(d.timeline),
    linked_follow_ups: Array.isArray(d.linked_follow_ups)
      ? d.linked_follow_ups.map((f) => {
          const row = f as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    related_approvals: Array.isArray(d.related_approvals)
      ? d.related_approvals.map((a) => {
          const row = a as Record<string, unknown>;
          return { id: str(row.id), title: str(row.title), status: str(row.status) };
        })
      : [],
    outcome_evaluation: outcome
      ? {
          outcome_rating: typeof outcome.outcome_rating === "number" ? outcome.outcome_rating : undefined,
          lessons_learned: str(outcome.lessons_learned) || undefined,
          unexpected_consequences: str(outcome.unexpected_consequences) || undefined,
          would_repeat: wr && REPEAT.has(wr) ? wr : undefined,
          evaluated_at: str(outcome.evaluated_at) || undefined,
        }
      : null,
    audit_history: parseTimeline(d.audit_history),
  };
}

export function parseDecisionItem(data: unknown): DecisionItem | null {
  if (!data || typeof data !== "object") return null;
  const d = data as Record<string, unknown>;
  if (d.decision) return parseItem(d.decision);
  return parseItem(d);
}
