import type {
  AdoptionSignal,
  ActiveRisk,
  CategoryScores,
  CustomerOutcome,
  CustomerSuccessActivityEvent,
  CustomerSuccessFollowUpItem,
  CustomerSuccessOverview,
  CustomerSuccessRecommendation,
  CustomerSuccessStatus,
  RecommendedNextAction,
  SuccessMilestone,
  SuccessPlan,
} from "./types";
import { CUSTOMER_SUCCESS_STATUSES } from "./types";
import {
  legacyScoresToEntries,
  parseCustomerSuccessScores,
  parsePilotStatus,
} from "./score-availability";
import { filterSyntheticFollowUps, filterSyntheticRisks } from "./synthetic-filter";

const STATUSES = new Set<CustomerSuccessStatus>(CUSTOMER_SUCCESS_STATUSES);

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : fb;
}

function numOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  return typeof v === "number" ? v : null;
}

function parseRecommendations(raw: unknown): CustomerSuccessRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), priority: str(d.priority), category: str(d.category) };
  });
}

function parseMilestones(raw: unknown): SuccessMilestone[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      key: str(d.key),
      title: str(d.title),
      achieved_at: str(d.achieved_at),
      auto_detected: d.auto_detected === true,
      item_type: str(d.item_type, "milestone"),
      status: str(d.status, "completed"),
    };
  });
}

function parseFollowUps(raw: unknown): CustomerSuccessFollowUpItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      title: str(d.title),
      summary: str(d.summary),
      category: str(d.category),
      priority: str(d.priority),
      status: str(d.status),
      owner_id: str(d.owner_id) || undefined,
      owner_label: str(d.owner_label),
      due_at: str(d.due_at) || undefined,
      item_type: str(d.item_type, "follow_up"),
      href: str(d.href) || undefined,
    };
  });
}

function parsePlans(raw: unknown): SuccessPlan[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      title: str(d.title),
      goal_summary: str(d.goal_summary),
      owner_id: str(d.owner_id) || undefined,
      owner_label: str(d.owner_label),
      status: str(d.status),
      category: str(d.category),
      priority: str(d.priority),
      progress_percent: numOrNull(d.progress_percent) ?? 0,
      start_date: str(d.start_date) || undefined,
      target_date: str(d.target_date) || undefined,
      item_type: str(d.item_type, "success_plan"),
    };
  });
}

function parseOutcomes(raw: unknown): CustomerOutcome[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      title: str(d.title),
      target_value: str(d.target_value),
      current_value: str(d.current_value),
      progress_percent: numOrNull(d.progress_percent) ?? 0,
      category: str(d.category),
      status: str(d.status),
      item_type: str(d.item_type, "outcome"),
    };
  });
}

function parseRisks(raw: unknown): ActiveRisk[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      title: str(d.title),
      description: str(d.description),
      category: str(d.category),
      status: str(d.status),
      likelihood: str(d.likelihood),
      impact: str(d.impact),
      owner_id: str(d.owner_id) || undefined,
      owner_label: str(d.owner_label),
      item_type: str(d.item_type, "risk"),
      href: str(d.href) || undefined,
    };
  });
}

function parseAdoptionSignals(raw: unknown): AdoptionSignal[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    const unit = str(d.unit, "score");
    return {
      key: str(d.key),
      label_key: str(d.label_key),
      value: numOrNull(d.value) ?? 0,
      unit: unit === "count" || unit === "percent" ? unit : "score",
      availability: str(d.availability) || undefined,
    };
  });
}

function parseActivity(raw: unknown): CustomerSuccessActivityEvent[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return {
      id: str(d.id),
      event_type: str(d.event_type),
      title: str(d.title),
      description: str(d.description),
      created_at: str(d.created_at),
      item_type: str(d.item_type, "activity"),
    };
  });
}

function parseCategoryScores(raw: unknown): CategoryScores | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    learning_completion: num(d.learning_completion),
    feature_adoption: num(d.feature_adoption),
    user_engagement: num(d.user_engagement),
    operational_maturity: num(d.operational_maturity),
    security_completion: num(d.security_completion),
    integration_usage: num(d.integration_usage),
  };
}

function parseNextAction(raw: unknown): RecommendedNextAction | null {
  if (!raw || typeof raw !== "object") return null;
  const d = raw as Record<string, unknown>;
  if (!d.key) return null;
  return {
    key: str(d.key),
    priority: str(d.priority),
    category: str(d.category),
    shadow: d.shadow === true,
  };
}

export function parseCustomerSuccessOverview(data: unknown): CustomerSuccessOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const status = str(d.success_status, "getting_started") as CustomerSuccessStatus;
  const maturity = d.maturity as Record<string, unknown> | undefined;
  const personal = d.personal_progress as Record<string, unknown> | undefined;
  const team = d.team_reporting as Record<string, unknown> | null | undefined;
  const journeyStarted = d.journey_started === true;
  const scores =
    parseCustomerSuccessScores(d.scores) ??
    legacyScoresToEntries(
      {
        health_score: numOrNull(d.health_score) ?? undefined,
        adoption_score: numOrNull(d.adoption_score) ?? undefined,
        utilization_score: numOrNull(d.utilization_score) ?? undefined,
        engagement_score: numOrNull(d.engagement_score) ?? undefined,
        health_state: str(d.health_state) || undefined,
        last_updated_at: str(d.last_updated_at) || undefined,
        journey_started: journeyStarted,
      },
      journeyStarted
    );

  const explicitFound = d.found === true;
  const implicitFound =
    d.found !== false &&
    (d.success_status !== undefined ||
      d.scores !== undefined ||
      d.journey_started !== undefined ||
      d.adoption_signals !== undefined);

  return {
    found: explicitFound || implicitFound,
    filtered_out: d.filtered_out === true,
    can_manage: d.can_manage === true,
    can_admin: d.can_admin === true,
    journey_started: journeyStarted,
    adoption_score: numOrNull(d.adoption_score),
    utilization_score: numOrNull(d.utilization_score),
    engagement_score: numOrNull(d.engagement_score),
    health_score: numOrNull(d.health_score) ?? numOrNull(d.adoption_score),
    scores,
    pilot_status: parsePilotStatus(d.pilot_status),
    health_state: str(d.health_state) || undefined,
    success_status: STATUSES.has(status) ? status : "getting_started",
    maturity: maturity ? { stage: num(maturity.stage), key: str(maturity.key) } : undefined,
    category_scores: parseCategoryScores(d.category_scores),
    milestones_achieved: parseMilestones(d.milestones_achieved),
    recommendations: parseRecommendations(d.recommendations),
    recommended_next_action: parseNextAction(d.recommended_next_action),
    follow_ups: filterSyntheticFollowUps(parseFollowUps(d.follow_ups)),
    success_plans: parsePlans(d.success_plans),
    outcomes: parseOutcomes(d.outcomes),
    active_risks: filterSyntheticRisks(parseRisks(d.active_risks)),
    adoption_signals: parseAdoptionSignals(d.adoption_signals),
    timeline: parseActivity(d.timeline),
    owners: Array.isArray(d.owners) ? d.owners.map((o) => String(o)) : [],
    personal_progress: personal
      ? { courses_completed: num(personal.courses_completed), certifications: num(personal.certifications) }
      : undefined,
    team_reporting: team
      ? {
          team_count: str(team.team_count),
          two_fa_adoption_percent: numOrNull(team.two_fa_adoption_percent) ?? undefined,
          learning_completions: str(team.learning_completions),
        }
      : team === null
        ? null
        : undefined,
    last_updated_at: str(d.last_updated_at) || undefined,
  };
}

export function parseCustomerSuccessAdoption(data: unknown): {
  found: boolean;
  category_scores?: import("./types").CategoryScores;
  adoption_signals?: import("./types").AdoptionSignal[];
} {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const overview = parseCustomerSuccessOverview(d);
  return {
    found: overview.found,
    category_scores: overview.category_scores,
    adoption_signals: overview.adoption_signals,
  };
}

export function parseCustomerSuccessMilestones(data: unknown): SuccessMilestone[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseMilestones(d.milestones);
}

export function parseCustomerSuccessRecommendations(data: unknown): CustomerSuccessRecommendation[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  return parseRecommendations(d.recommendations);
}
