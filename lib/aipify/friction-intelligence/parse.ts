import type { FrictionCenter } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function parseFrictionCenter(data: unknown): FrictionCenter {
  if (!data || typeof data !== "object") return { has_customer: false };
  const d = data as Record<string, unknown>;

  return {
    has_customer: Boolean(d.has_customer),
    has_access: d.has_access !== undefined ? Boolean(d.has_access) : undefined,
    upgrade_required: Boolean(d.upgrade_required),
    plan: asString(d.plan) || undefined,
    enterprise_features: Boolean(d.enterprise_features),
    overall_score_level: asString(d.overall_score_level) as FrictionCenter["overall_score_level"],
    briefing: asString(d.briefing) || undefined,
    category_cards: asArray(d.category_cards),
    events: asArray(d.events),
    recommendations: asArray(d.recommendations),
    history: asArray(d.history),
    privacy_note: asString(d.privacy_note) || undefined,
  };
}
