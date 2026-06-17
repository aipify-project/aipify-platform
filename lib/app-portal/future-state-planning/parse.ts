import type {
  FutureStateActionResult,
  FutureStateAlignment,
  FutureStateBriefing,
  FutureStateMilestone,
  FutureStatePlan,
  FutureStatePlanDetail,
  FutureStatePlanningOverview,
  FutureStateRecommendation,
  FutureStateReview,
  FutureStateTimelineEvent,
} from "./types";

function str(v: unknown, fb = ""): string { return typeof v === "string" ? v : fb; }
function num(v: unknown, fb = 0): number { return typeof v === "number" ? v : fb; }
function bool(v: unknown): boolean { return v === true; }

function parsePlan(raw: unknown): FutureStatePlan | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  if (!str(d.id)) return undefined;
  return {
    id: str(d.id),
    plan_key: str(d.plan_key),
    title: str(d.title),
    description: str(d.description),
    category: str(d.category),
    status: str(d.status),
    time_horizon: str(d.time_horizon),
    custom_horizon_label: str(d.custom_horizon_label) || undefined,
    current_state: str(d.current_state),
    desired_future_state: str(d.desired_future_state),
    vision_statement: str(d.vision_statement),
    desired_outcomes: Array.isArray(d.desired_outcomes) ? d.desired_outcomes : [],
    strategic_priorities: Array.isArray(d.strategic_priorities) ? d.strategic_priorities : [],
    executive_sponsors: Array.isArray(d.executive_sponsors) ? d.executive_sponsors : [],
    departments_involved: Array.isArray(d.departments_involved) ? d.departments_involved : [],
    estimated_timeline: str(d.estimated_timeline),
    key_dependencies: Array.isArray(d.key_dependencies) ? d.key_dependencies : [],
    risks: Array.isArray(d.risks) ? d.risks : [],
    opportunities: Array.isArray(d.opportunities) ? d.opportunities : [],
    success_indicators: Array.isArray(d.success_indicators) ? d.success_indicators : [],
    strategic_objectives: Array.isArray(d.strategic_objectives) ? d.strategic_objectives : [],
    initiatives: Array.isArray(d.initiatives) ? d.initiatives : [],
    progress_score: num(d.progress_score),
    alignment_score: num(d.alignment_score),
    completeness_score: num(d.completeness_score),
    executive_owner: str(d.executive_owner),
    department: str(d.department),
    strategic_priority: str(d.strategic_priority),
    review_date: str(d.review_date) || null,
    next_review_date: str(d.next_review_date) || null,
    last_reviewed_at: str(d.last_reviewed_at) || null,
    updated_at: str(d.updated_at) || undefined,
  };
}

function parseRecommendations(raw: unknown): FutureStateRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key) };
  });
}

function parseMilestones(raw: unknown): FutureStateMilestone[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id),
      plan_id: str(d.plan_id) || undefined,
      plan_title: str(d.plan_title) || undefined,
      milestone_key: str(d.milestone_key) || undefined,
      title: str(d.title),
      description: str(d.description) || undefined,
      status: str(d.status),
      target_date: str(d.target_date) || null,
      success_indicator: str(d.success_indicator) || undefined,
      owner: str(d.owner) || undefined,
    };
  });
}

function parseAlignment(raw: unknown): FutureStateAlignment[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id),
      department: str(d.department),
      current_alignment: num(d.current_alignment),
      target_alignment: num(d.target_alignment),
      progress: num(d.progress),
      owner: str(d.owner),
      review_date: str(d.review_date) || null,
    };
  });
}

function parseReviews(raw: unknown): FutureStateReview[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id),
      review_notes: str(d.review_notes),
      reviewed_at: str(d.reviewed_at) || undefined,
    };
  });
}

function parseItems(raw: unknown): { id: string; title: string; date?: string }[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((i) => {
    const d = i as Record<string, unknown>;
    return {
      id: str(d.id),
      title: str(d.title),
      date: str(d.date) || undefined,
    };
  });
}

export function parseFutureStatePlanningOverview(data: unknown): FutureStatePlanningOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    can_full: bool(d.can_full),
    can_view: bool(d.can_view),
    can_create: bool(d.can_create),
    can_review: bool(d.can_review),
    has_plan_data: bool(d.has_plan_data),
    future_state_readiness_score: num(d.future_state_readiness_score),
    strategic_alignment_score: num(d.strategic_alignment_score),
    future_state_progress_score: num(d.future_state_progress_score),
    planning_completeness_score: num(d.planning_completeness_score),
    executive_summary: str(d.executive_summary),
    active_plans: parseItems(d.active_plans),
    upcoming_reviews: parseItems(d.upcoming_reviews),
    plans: Array.isArray(d.plans)
      ? d.plans.map((x) => parsePlan(x)).filter(Boolean) as FutureStatePlan[]
      : [],
    recommendations: parseRecommendations(d.recommendations),
    advisory_note: str(d.advisory_note),
    principle: str(d.principle),
  };
}

export function parseFutureStatePlanDetail(data: unknown): FutureStatePlanDetail {
  if (!data || typeof data !== "object") {
    return {
      found: false, id: "", plan_key: "", title: "", description: "",
      category: "", status: "draft", time_horizon: "3_years",
      current_state: "", desired_future_state: "", vision_statement: "",
      estimated_timeline: "", progress_score: 0, alignment_score: 0,
      completeness_score: 0, executive_owner: "", department: "",
      strategic_priority: "moderate",
    };
  }
  const d = data as Record<string, unknown>;
  const plan = parsePlan(d);
  return {
    found: bool(d.found),
    ...(plan ?? {
      id: str(d.id), plan_key: str(d.plan_key), title: str(d.title),
      description: str(d.description), category: str(d.category),
      status: str(d.status), time_horizon: str(d.time_horizon),
      current_state: str(d.current_state), desired_future_state: str(d.desired_future_state),
      vision_statement: str(d.vision_statement), estimated_timeline: str(d.estimated_timeline),
      progress_score: num(d.progress_score), alignment_score: num(d.alignment_score),
      completeness_score: num(d.completeness_score), executive_owner: str(d.executive_owner),
      department: str(d.department), strategic_priority: str(d.strategic_priority),
    }),
    can_create: bool(d.can_create),
    can_review: bool(d.can_review),
    milestones: parseMilestones(d.milestones),
    alignment: parseAlignment(d.alignment),
    reviews: parseReviews(d.reviews),
    advisory_note: str(d.advisory_note),
  };
}

export function parseFutureStateBriefing(data: unknown): FutureStateBriefing {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    current_position: str(d.current_position),
    future_state_vision: str(d.future_state_vision),
    progress_status: str(d.progress_status),
    key_opportunities: Array.isArray(d.key_opportunities) ? d.key_opportunities : [],
    key_risks: Array.isArray(d.key_risks) ? d.key_risks : [],
    recommended_actions: parseRecommendations(d.recommended_actions),
    next_review_date: str(d.next_review_date) || null,
    advisory_note: str(d.advisory_note),
  };
}

export function parseFutureStateMilestones(data: unknown): { found: boolean; milestones: FutureStateMilestone[] } {
  if (!data || typeof data !== "object") return { found: false, milestones: [] };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    milestones: parseMilestones(d.milestones),
  };
}

export function parseFutureStateTimeline(data: unknown): { found: boolean; timeline: FutureStateTimelineEvent[] } {
  if (!data || typeof data !== "object") return { found: false, timeline: [] };
  const d = data as Record<string, unknown>;
  const timeline = Array.isArray(d.timeline)
    ? d.timeline.map((i) => {
        const e = i as Record<string, unknown>;
        return {
          id: str(e.id),
          plan_id: str(e.plan_id) || undefined,
          event_type: str(e.event_type),
          description: str(e.description),
          created_at: str(e.created_at),
        };
      })
    : [];
  return { found: bool(d.found), timeline };
}

export function parseFutureStateActionResult(data: unknown): FutureStateActionResult {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: bool(d.found),
    plan_id: str(d.plan_id) || undefined,
    message: str(d.message) || undefined,
  };
}
