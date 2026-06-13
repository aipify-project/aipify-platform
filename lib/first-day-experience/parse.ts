import type { FirstDayCenter } from "./types";
import { JOURNEY_STEPS } from "./constants";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseFirstDayExperienceCenter(raw: unknown): FirstDayCenter {
  const row = asRecord(raw);
  const settings = asRecord(row.settings);
  const step = Number(settings.current_step ?? row.current_step ?? 1);

  return {
    current_step: JOURNEY_STEPS.includes(step as (typeof JOURNEY_STEPS)[number])
      ? (step as FirstDayCenter["current_step"])
      : 1,
    adoption_stage: String(settings.adoption_stage ?? row.adoption_stage ?? "observer"),
    journey_status: String(settings.journey_status ?? row.journey_status ?? "in_progress"),
    welcome_message: String(row.welcome_message ?? ""),
    trust_score: Number(settings.trust_score ?? row.trust_score ?? 0),
    first_value_delivered: Boolean(settings.first_value_delivered ?? row.first_value_delivered),
    first_task_completed: Boolean(settings.first_task_completed ?? row.first_task_completed),
    journey_steps: Array.isArray(row.journey_steps)
      ? row.journey_steps.map((item) => {
          const s = asRecord(item);
          return {
            step_key: String(s.step_key ?? ""),
            step_number: Number(s.step_number ?? 0),
            status: String(s.status ?? "pending"),
          };
        })
      : [],
    value_moments: Array.isArray(row.value_moments)
      ? row.value_moments.map((item) => {
          const m = asRecord(item);
          return {
            moment_key: String(m.moment_key ?? ""),
            title: String(m.title ?? ""),
            summary: String(m.summary ?? ""),
            insight_type: String(m.insight_type ?? ""),
            confidence: String(m.confidence ?? "moderate"),
            delivered: Boolean(m.delivered),
          };
        })
      : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((rec) => {
          const r = asRecord(rec);
          return {
            key: String(r.key ?? ""),
            message: String(r.message ?? r.recommendation ?? ""),
          };
        })
      : [],
    confidence_messages: Array.isArray(row.confidence_messages)
      ? row.confidence_messages.map((msg) => {
          const m = asRecord(msg);
          return {
            area: String(m.area ?? ""),
            message: String(m.message ?? ""),
            level: String(m.level ?? m.confidence ?? "moderate"),
          };
        })
      : [],
    discovery_summary: row.discovery_summary ? asRecord(row.discovery_summary) : null,
    readiness_report: row.readiness_report ? asRecord(row.readiness_report) : null,
    personalization: row.personalization ? asRecord(row.personalization) : null,
    widgets: row.widgets ? asRecord(row.widgets) : null,
    recent_audit: Array.isArray(row.recent_audit)
      ? row.recent_audit.map((entry) => {
          const e = asRecord(entry);
          return {
            id: String(e.id ?? ""),
            event_type: String(e.event_type ?? ""),
            summary: e.summary ? String(e.summary) : null,
            created_at: String(e.created_at ?? ""),
          };
        })
      : [],
    blueprint: row.blueprint ? asRecord(row.blueprint) : null,
    can_manage: Boolean(row.can_manage),
    can_complete: Boolean(row.can_complete),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
