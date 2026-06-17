import type {
  GovernanceDetail,
  GovernanceInsights,
  GovernanceOverview,
  GovernancePackCard,
  GovernanceRecommendation,
  GovernanceReview,
  GovernanceReviewResult,
  GovernanceTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : typeof v === "string" ? Number(v) || fb : fb;
}

function parseStringArray(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x) => String(x));
}

function parseRecommendations(raw: unknown): GovernanceRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), pack_key: str(d.pack_key) || undefined };
  });
}

function parseInsightItems(raw: unknown): { pack_key?: string; name?: string; primary_owner?: string; department?: string; count?: number }[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      pack_key: str(d.pack_key) || undefined,
      name: str(d.name) || undefined,
      primary_owner: str(d.primary_owner) || undefined,
      department: str(d.department) || undefined,
      count: num(d.count) || undefined,
    };
  });
}

function parseInsights(raw: unknown): GovernanceInsights | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    packs_without_ownership: parseInsightItems(d.packs_without_ownership),
    packs_overdue_review: parseInsightItems(d.packs_overdue_review),
    ownership_concentration: parseInsightItems(d.ownership_concentration),
    strongest_departments: parseInsightItems(d.strongest_departments),
    improvement_opportunities: parseInsightItems(d.improvement_opportunities),
  };
}

function parsePackCard(raw: unknown): GovernancePackCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    id: str(d.id || d.pack_key),
    pack_key: str(d.pack_key),
    name: str(d.name),
    primary_owner: str(d.primary_owner),
    backup_owner: str(d.backup_owner),
    department: str(d.department),
    governance_status: str(d.governance_status),
    health_status: str(d.health_status),
    review_frequency: str(d.review_frequency),
    governance_notes: str(d.governance_notes),
    related_risks: parseStringArray(d.related_risks),
    recommended_actions: parseStringArray(d.recommended_actions),
    last_review_at: str(d.last_review_at) || null,
    next_review_at: str(d.next_review_at) || null,
  };
}

function parseReviews(raw: unknown): GovernanceReview[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      status: str(d.status),
      reviewer_name: str(d.reviewer_name),
      governance_notes: str(d.governance_notes),
      review_frequency: str(d.review_frequency),
      reviewed_at: str(d.reviewed_at) || undefined,
    };
  });
}

function parseTimeline(raw: unknown): GovernanceTimelineEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      pack_key: str(d.pack_key) || undefined,
      event_type: str(d.event_type),
      description: str(d.description),
      created_at: str(d.created_at),
    };
  });
}

export function parseGovernanceOverview(data: unknown): GovernanceOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_manage: d.can_manage === true,
    can_view: d.can_view === true,
    can_review: d.can_review === true,
    has_governance_data: d.has_governance_data === true,
    total_packs: num(d.total_packs),
    packs_with_owners: num(d.packs_with_owners),
    packs_missing_owners: num(d.packs_missing_owners),
    governance_health_score: num(d.governance_health_score),
    upcoming_reviews: num(d.upcoming_reviews),
    ownership_changes: num(d.ownership_changes),
    executive_summary: str(d.executive_summary),
    packs: Array.isArray(d.packs) ? d.packs.map((p) => parsePackCard(p)).filter(Boolean) as GovernancePackCard[] : [],
    insights: parseInsights(d.insights),
    recommendations: parseRecommendations(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseGovernanceDetail(data: unknown): GovernanceDetail {
  if (!data || typeof data !== "object") {
    return {
      found: false, id: "", pack_key: "", name: "", primary_owner: "", backup_owner: "",
      department: "", governance_status: "", health_status: "", review_frequency: "",
    };
  }
  const d = data as Record<string, unknown>;
  const card = parsePackCard(d);
  return {
    found: d.found === true,
    ...(card ?? {
      id: str(d.pack_key), pack_key: str(d.pack_key), name: str(d.name),
      primary_owner: str(d.primary_owner), backup_owner: str(d.backup_owner),
      department: str(d.department), governance_status: str(d.governance_status),
      health_status: str(d.health_status), review_frequency: str(d.review_frequency),
    }),
    review_history: parseReviews(d.review_history),
    can_review: d.can_review === true,
    recommendations: parseRecommendations(d.recommendations),
  };
}

export function parseGovernanceRecommendations(data: unknown): GovernanceRecommendation[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseRecommendations(d.recommendations);
}

export function parseGovernanceTimeline(data: unknown): GovernanceTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseTimeline(d.events);
}

export function parseGovernanceReviewResult(data: unknown): GovernanceReviewResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    review_id: str(d.review_id) || undefined,
    pack_key: str(d.pack_key) || undefined,
    next_review_at: str(d.next_review_at) || undefined,
    message: str(d.message) || undefined,
  };
}
