import type {
  PackLifecycleCard,
  PackLifecycleDetail,
  PackLifecycleGovernance,
  PackLifecycleHighlight,
  PackLifecycleOverview,
  PackLifecycleRecommendation,
  PackLifecycleReview,
  PackLifecycleTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseTimeline(raw: unknown): PackLifecycleTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), event_type: str(d.event_type), description: str(d.description), created_at: str(d.created_at) };
  });
}

function parseReviews(raw: unknown): PackLifecycleReview[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      review_type: str(d.review_type),
      status: str(d.status),
      review_owner: str(d.review_owner),
      answers: typeof d.answers === "object" && d.answers ? (d.answers as Record<string, unknown>) : undefined,
      notes: str(d.notes) || undefined,
      completed_at: str(d.completed_at),
    };
  });
}

function parseRecommendations(raw: unknown): PackLifecycleRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), pack_key: str(d.pack_key) };
  });
}

function parseHighlights(raw: unknown): PackLifecycleHighlight[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      pack_key: str(d.pack_key),
      name: str(d.name),
      installed_at: str(d.installed_at) || undefined,
      next_review_at: str(d.next_review_at) || undefined,
      review_owner: str(d.review_owner) || undefined,
    };
  });
}

function parsePackCard(raw: unknown): PackLifecycleCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const milestones = Array.isArray(d.upcoming_milestones)
    ? d.upcoming_milestones.map((m) => {
        const row = m as Record<string, unknown>;
        return { key: str(row.key), achieved_at: str(row.achieved_at) };
      })
    : [];
  return {
    id: str(d.id || d.pack_key),
    pack_key: str(d.pack_key),
    name: str(d.name),
    lifecycle_stage: str(d.lifecycle_stage),
    installed_at: str(d.installed_at) || null,
    last_activity_at: str(d.last_activity_at) || null,
    adoption_score: num(d.adoption_score),
    users_assigned: num(d.users_assigned),
    review_frequency: str(d.review_frequency),
    review_owner: str(d.review_owner),
    responsible_department: str(d.responsible_department) || undefined,
    related_packs: parseStringArray(d.related_packs),
    next_review_at: str(d.next_review_at) || null,
    review_status: str(d.review_status),
    lifecycle_notes: str(d.lifecycle_notes) || undefined,
    upcoming_milestones: milestones,
    timeline: parseTimeline(d.timeline),
  };
}

function parseGovernance(raw: unknown): PackLifecycleGovernance | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  const reviews = parseReviews(d.review_history);
  return {
    review_owner: str(d.review_owner),
    responsible_department: str(d.responsible_department),
    review_history: reviews,
    lifecycle_notes: str(d.lifecycle_notes),
    decision_history: parseReviews(d.decision_history),
  };
}

export function parsePackLifecycleOverview(data: unknown): PackLifecycleOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const dist = d.lifecycle_distribution;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_manage: d.can_manage === true,
    can_view: d.can_view === true,
    has_lifecycle_data: d.has_lifecycle_data === true,
    total_installed: num(d.total_installed),
    lifecycle_distribution: dist && typeof dist === "object" ? (dist as Record<string, number>) : {},
    packs_requiring_review: num(d.packs_requiring_review),
    recently_activated: parseHighlights(d.recently_activated),
    recently_retired: parseHighlights(d.recently_retired),
    upcoming_reviews: parseHighlights(d.upcoming_reviews),
    packs: Array.isArray(d.packs) ? d.packs.map((p) => parsePackCard(p)).filter(Boolean) as PackLifecycleCard[] : [],
    recommendations: parseRecommendations(d.recommendations),
    principle: str(d.principle),
  };
}

export function parsePackLifecycleDetail(data: unknown): PackLifecycleDetail {
  if (!data || typeof data !== "object") {
    return {
      found: false, id: "", pack_key: "", name: "", lifecycle_stage: "", adoption_score: 0,
      users_assigned: 0, review_frequency: "", review_owner: "", review_status: "",
    };
  }
  const d = data as Record<string, unknown>;
  const card = parsePackCard(d);
  return {
    found: d.found === true,
    ...(card ?? {
      id: str(d.pack_key), pack_key: str(d.pack_key), name: str(d.name), lifecycle_stage: str(d.lifecycle_stage),
      adoption_score: num(d.adoption_score), users_assigned: num(d.users_assigned),
      review_frequency: str(d.review_frequency), review_owner: str(d.review_owner), review_status: str(d.review_status),
    }),
    governance: parseGovernance(d.governance),
    recommendations: parseRecommendations(d.recommendations),
    can_update: d.can_update === true,
    can_review: d.can_review === true,
  };
}
