import type {
  ComplianceDetail,
  ComplianceInsights,
  ComplianceOverview,
  CompliancePackCard,
  CompliancePolicy,
  ComplianceRecommendation,
  ComplianceReview,
  ComplianceReviewResult,
  ComplianceTimelineEvent,
  PolicyAlignmentSummary,
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

function parsePolicyAlignment(raw: unknown): PolicyAlignmentSummary | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    policies_reviewed: num(d.policies_reviewed),
    policies_acknowledged: num(d.policies_acknowledged),
    policies_requiring_review: num(d.policies_requiring_review),
    policies_pending_approval: num(d.policies_pending_approval),
    policies_requiring_updates: num(d.policies_requiring_updates),
  };
}

function parseRecommendations(raw: unknown): ComplianceRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), pack_key: str(d.pack_key) || undefined };
  });
}

function parseInsightItems(raw: unknown): { pack_key?: string; name?: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { pack_key: str(d.pack_key) || undefined, name: str(d.name) || undefined };
  });
}

function parseInsights(raw: unknown): ComplianceInsights | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    approaching_deadlines: parseInsightItems(d.approaching_deadlines),
    missing_acknowledgements: parseInsightItems(d.missing_acknowledgements),
    governance_gaps: parseInsightItems(d.governance_gaps),
    strong_practices: parseInsightItems(d.strong_practices),
    improvement_opportunities: parseInsightItems(d.improvement_opportunities),
  };
}

function parsePackCard(raw: unknown): CompliancePackCard | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    id: str(d.id || d.pack_key),
    pack_key: str(d.pack_key),
    name: str(d.name),
    compliance_status: str(d.compliance_status),
    assigned_reviewer: str(d.assigned_reviewer),
    review_frequency: str(d.review_frequency),
    priority_level: str(d.priority_level),
    governance_notes: str(d.governance_notes),
    policies_linked: parseStringArray(d.policies_linked),
    open_recommendations: parseStringArray(d.open_recommendations),
    policy_alignment: parsePolicyAlignment(d.policy_alignment),
    last_review_at: str(d.last_review_at) || null,
    next_review_at: str(d.next_review_at) || null,
  };
}

function parsePolicies(raw: unknown): CompliancePolicy[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      policy_key: str(d.policy_key),
      policy_name: str(d.policy_name),
      category: str(d.category),
      alignment_status: str(d.alignment_status),
    };
  });
}

function parseReviews(raw: unknown): ComplianceReview[] {
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

function parseTimeline(raw: unknown): ComplianceTimelineEvent[] {
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

export function parseComplianceOverview(data: unknown): ComplianceOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    can_full: d.can_full === true,
    can_manage: d.can_manage === true,
    can_view: d.can_view === true,
    can_review: d.can_review === true,
    has_compliance_data: d.has_compliance_data === true,
    compliance_health_score: num(d.compliance_health_score),
    packs_under_review: num(d.packs_under_review),
    packs_missing_reviews: num(d.packs_missing_reviews),
    upcoming_compliance_reviews: num(d.upcoming_compliance_reviews),
    recently_completed_reviews: num(d.recently_completed_reviews),
    open_compliance_recommendations: num(d.open_compliance_recommendations),
    executive_summary: str(d.executive_summary),
    packs: Array.isArray(d.packs) ? d.packs.map((p) => parsePackCard(p)).filter(Boolean) as CompliancePackCard[] : [],
    policy_alignment: parsePolicyAlignment(d.policy_alignment),
    insights: parseInsights(d.insights),
    recommendations: parseRecommendations(d.recommendations),
    principle: str(d.principle),
  };
}

export function parseComplianceDetail(data: unknown): ComplianceDetail {
  if (!data || typeof data !== "object") {
    return {
      found: false, id: "", pack_key: "", name: "", compliance_status: "",
      assigned_reviewer: "", review_frequency: "", priority_level: "",
    };
  }
  const d = data as Record<string, unknown>;
  const card = parsePackCard(d);
  return {
    found: d.found === true,
    ...(card ?? {
      id: str(d.pack_key), pack_key: str(d.pack_key), name: str(d.name),
      compliance_status: str(d.compliance_status), assigned_reviewer: str(d.assigned_reviewer),
      review_frequency: str(d.review_frequency), priority_level: str(d.priority_level),
    }),
    review_history: parseReviews(d.review_history),
    policies: parsePolicies(d.policies),
    can_review: d.can_review === true,
    recommendations: parseRecommendations(d.recommendations),
  };
}

export function parseComplianceRecommendations(data: unknown): ComplianceRecommendation[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseRecommendations(d.recommendations);
}

export function parseComplianceTimeline(data: unknown): ComplianceTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseTimeline(d.events);
}

export function parseComplianceReviewResult(data: unknown): ComplianceReviewResult {
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
