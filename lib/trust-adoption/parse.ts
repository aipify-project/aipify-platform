import type { TrustAdoptionCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export function parseTrustAdoptionCenter(raw: unknown): TrustAdoptionCenter {
  const row = asRecord(raw);
  const settings = asRecord(row.settings);

  return {
    adoption_state: String(settings.adoption_state ?? row.adoption_state ?? "exploring"),
    adoption_stage: String(settings.adoption_stage ?? row.adoption_stage ?? "curiosity"),
    companion_reliability_score: Number(
      settings.companion_reliability_score ?? row.companion_reliability_score ?? 0
    ),
    reliability_level: String(
      settings.reliability_level ?? row.reliability_level ?? "building_trust"
    ),
    trust_trend: settings.trust_trend ? String(settings.trust_trend) : row.trust_trend ? String(row.trust_trend) : null,
    value_moments: Array.isArray(row.value_moments)
      ? row.value_moments.map((item) => {
          const m = asRecord(item);
          return {
            moment_key: String(m.moment_key ?? ""),
            title: String(m.title ?? ""),
            summary: String(m.summary ?? ""),
            outcome_type: String(m.outcome_type ?? ""),
            time_saved_minutes: Number(m.time_saved_minutes ?? 0),
            trust_impact: String(m.trust_impact ?? "moderate"),
          };
        })
      : [],
    signals: Array.isArray(row.adoption_signals)
      ? row.adoption_signals.map((item) => {
          const s = asRecord(item);
          return {
            signal_key: String(s.signal_key ?? ""),
            signal_value: Number(s.signal_value ?? 0),
            period: String(s.period ?? "30d"),
          };
        })
      : Array.isArray(row.signals)
        ? row.signals.map((item) => {
            const s = asRecord(item);
            return {
              signal_key: String(s.signal_key ?? ""),
              signal_value: Number(s.signal_value ?? 0),
              period: String(s.period ?? "30d"),
            };
          })
        : [],
    recommendations: Array.isArray(row.recommendations)
      ? row.recommendations.map((item) => {
          const r = asRecord(item);
          return {
            recommendation_key: String(r.recommendation_key ?? r.key ?? ""),
            message: String(r.message ?? ""),
            status: String(r.status ?? "pending"),
          };
        })
      : [],
    widgets: row.widgets ? asRecord(row.widgets) : row.executive_widgets ? asRecord(row.executive_widgets) : null,
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
    can_record: Boolean(row.can_record),
    privacy_note: row.privacy_note ? String(row.privacy_note) : null,
  };
}
