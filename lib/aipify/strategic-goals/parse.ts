import type { StrategicGoalsCenter } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function parseStrategicGoalsCenter(data: unknown): StrategicGoalsCenter {
  if (!data || typeof data !== "object") return { has_customer: false };
  const d = data as Record<string, unknown>;

  return {
    has_customer: Boolean(d.has_customer),
    has_access: d.has_access !== undefined ? Boolean(d.has_access) : undefined,
    upgrade_required: Boolean(d.upgrade_required),
    plan: asString(d.plan) || undefined,
    enterprise_features: Boolean(d.enterprise_features),
    briefing: asString(d.briefing) || undefined,
    active_goals: asArray(d.active_goals),
    goals_at_risk: asArray(d.goals_at_risk),
    completed_goals: asArray(d.completed_goals),
    upcoming_milestones: asArray(d.upcoming_milestones),
    goal_timeline: asArray(d.goal_timeline),
    recommended_actions: asArray(d.recommended_actions),
    health_summary: (d.health_summary as StrategicGoalsCenter["health_summary"]) ?? undefined,
    privacy_note: asString(d.privacy_note) || undefined,
  };
}
