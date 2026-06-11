import type { AttentionCenterBundle } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function parseAttentionCenter(data: unknown): AttentionCenterBundle {
  if (!data || typeof data !== "object") {
    return { has_customer: false };
  }
  const d = data as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    settings: d.settings as AttentionCenterBundle["settings"],
    attention_state: typeof d.attention_state === "string" ? d.attention_state : undefined,
    overload_score: typeof d.overload_score === "number" ? d.overload_score : undefined,
    active_focus_session: (d.active_focus_session as AttentionCenterBundle["active_focus_session"]) ?? null,
    focus_sessions: asArray(d.focus_sessions),
    protected_blocks: asArray(d.protected_blocks),
    daily_focus_briefing: (d.daily_focus_briefing as Record<string, unknown>) ?? null,
    end_of_day_review: (d.end_of_day_review as Record<string, unknown>) ?? null,
    weekly_attention: d.weekly_attention as Record<string, number> | null,
    weekly_prompt: typeof d.weekly_prompt === "string" ? d.weekly_prompt : null,
    meeting_analysis: d.meeting_analysis as AttentionCenterBundle["meeting_analysis"],
    energy_insights: asArray<string>(d.energy_insights),
    goal_alignment: asArray(d.goal_alignment),
    recovery_alerts: asArray<string>(d.recovery_alerts),
    priority_defense: asArray(d.priority_defense),
    recent_activity: asArray(d.recent_activity),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
    integrations: d.integrations as Record<string, string>,
  };
}
