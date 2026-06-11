import type { BusinessPulseCenter, PulseAlert, PulseAreaSnapshot, PulseSnapshot } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function parseBusinessPulseCenter(data: unknown): BusinessPulseCenter {
  if (!data || typeof data !== "object") return { has_customer: false };
  const d = data as Record<string, unknown>;

  return {
    has_customer: Boolean(d.has_customer),
    has_access: d.has_access !== undefined ? Boolean(d.has_access) : undefined,
    upgrade_required: Boolean(d.upgrade_required),
    plan: asString(d.plan) || undefined,
    enterprise_features: Boolean(d.enterprise_features),
    overall_status: asString(d.overall_status) as BusinessPulseCenter["overall_status"],
    briefing: asString(d.briefing) || undefined,
    since_yesterday: asArray(d.since_yesterday),
    since_last_week: asArray(d.since_last_week),
    areas: asArray<PulseAreaSnapshot>(d.areas),
    normal_areas: asArray(d.normal_areas),
    attention_areas: asArray(d.attention_areas),
    snapshot: (d.snapshot as PulseSnapshot) ?? null,
    alerts: asArray<PulseAlert>(d.alerts),
    history: asArray<PulseSnapshot>(d.history),
    recommended_focus: asArray<string>(d.recommended_focus),
    data_sources: asArray<string>(d.data_sources),
    privacy_note: asString(d.privacy_note) || undefined,
  };
}
