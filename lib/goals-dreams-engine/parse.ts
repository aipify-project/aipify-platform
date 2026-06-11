import type { GoalsCenterBundle } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function parseGoalsCenter(data: unknown): GoalsCenterBundle {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    user_name: typeof d.user_name === "string" ? d.user_name : undefined,
    settings: d.settings as GoalsCenterBundle["settings"],
    active_goals: asArray(d.active_goals),
    completed_goals: asArray(d.completed_goals),
    recommended_next_steps: asArray(d.recommended_next_steps),
    celebrations: asArray(d.celebrations),
    check_ins: asArray(d.check_ins),
    stale_goals_count:
      typeof d.stale_goals_count === "number" ? d.stale_goals_count : undefined,
    check_in_prompt:
      typeof d.check_in_prompt === "string" ? d.check_in_prompt : null,
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    integrations: d.integrations as Record<string, string>,
  };
}
