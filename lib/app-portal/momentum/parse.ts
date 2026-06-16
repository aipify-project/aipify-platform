import type {
  MomentumBottleneck,
  MomentumExecutionSignals,
  MomentumInitiative,
  MomentumOverview,
  MomentumRecommendation,
  MomentumStatus,
  MomentumTimelineEvent,
  MomentumTrend,
} from "./types";
import { MOMENTUM_STATUSES, MOMENTUM_TRENDS } from "./types";

const STATUSES = new Set<MomentumStatus>(MOMENTUM_STATUSES);
const TRENDS = new Set<MomentumTrend>(MOMENTUM_TRENDS);

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

function parseInitiatives(raw: unknown): MomentumInitiative[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    const status = str(d.momentum_status, "stable") as MomentumStatus;
    const trend = str(d.trend_direction, "stable") as MomentumTrend;
    return {
      id: str(d.id),
      title: str(d.title),
      initiative_owner: str(d.initiative_owner),
      owner_id: d.owner_id ? str(d.owner_id) : null,
      source_type: str(d.source_type),
      momentum_status: STATUSES.has(status) ? status : status,
      trend_direction: TRENDS.has(trend) ? trend : trend,
      progress_percent: num(d.progress_percent),
      recent_activity_count: num(d.recent_activity_count),
      blockers_identified: parseStringArray(d.blockers_identified),
      next_milestone: str(d.next_milestone),
      related_goals: parseStringArray(d.related_goals),
      related_follow_ups: parseStringArray(d.related_follow_ups),
      related_decisions: parseStringArray(d.related_decisions),
      notes: str(d.notes),
      team: str(d.team) || undefined,
    };
  });
}

function parseRecommendations(raw: unknown): MomentumRecommendation[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), priority: str(d.priority) };
  });
}

function parseBottlenecks(raw: unknown): MomentumBottleneck[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((item) => {
    const d = item as Record<string, unknown>;
    return { id: str(d.id), key: str(d.key), severity: str(d.severity) };
  });
}

function parseSignals(raw: unknown): MomentumExecutionSignals | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const d = raw as Record<string, unknown>;
  return {
    goal_progress: num(d.goal_progress),
    follow_up_completion: num(d.follow_up_completion),
    commitment_fulfillment: num(d.commitment_fulfillment),
    decision_implementation: num(d.decision_implementation),
    strategic_movement: num(d.strategic_movement),
    learning_implementation: num(d.learning_implementation),
    meeting_action_completion: num(d.meeting_action_completion),
    success_initiative_progress: num(d.success_initiative_progress),
  };
}

export function parseMomentumOverview(data: unknown): MomentumOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const status = str(d.organizational_momentum_status, "stable") as MomentumStatus;
  const trend = str(d.execution_trend, "stable") as MomentumTrend;

  return {
    found: d.found === true,
    can_manage: d.can_manage === true,
    can_admin: d.can_admin === true,
    review_started: d.review_started === true,
    organizational_momentum_score: num(d.organizational_momentum_score),
    execution_trend: TRENDS.has(trend) ? trend : "stable",
    organizational_momentum_status: STATUSES.has(status) ? status : "stable",
    high_momentum_initiatives: parseInitiatives(d.high_momentum_initiatives),
    slowing_initiatives: parseInitiatives(d.slowing_initiatives),
    stalled_initiatives: parseInitiatives(d.stalled_initiatives),
    teams_requiring_attention: parseStringArray(d.teams_requiring_attention),
    positive_momentum_signals: parseStringArray(d.positive_momentum_signals),
    initiatives: parseInitiatives(d.initiatives),
    recommendations: parseRecommendations(d.recommendations),
    bottlenecks: parseBottlenecks(d.bottlenecks),
    personal_initiatives: parseInitiatives(d.personal_initiatives),
    execution_signals: parseSignals(d.execution_signals),
    principle: str(d.principle),
  };
}

export function parseMomentumTimeline(data: unknown): MomentumTimelineEvent[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.timeline)) return [];
  return d.timeline.map((item) => {
    const row = item as Record<string, unknown>;
    return {
      id: str(row.id),
      event_type: str(row.event_type),
      description: str(row.description),
      created_at: str(row.created_at),
    };
  });
}

export function parseMomentumRecommendations(data: unknown): MomentumRecommendation[] {
  if (!data || typeof data !== "object") return [];
  return parseRecommendations((data as Record<string, unknown>).recommendations);
}

export function parseMomentumBottlenecks(data: unknown): MomentumBottleneck[] {
  if (!data || typeof data !== "object") return [];
  return parseBottlenecks((data as Record<string, unknown>).bottlenecks);
}
