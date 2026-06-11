import type { OrganizationalMemoryCenter } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function parseOrganizationalMemoryCenter(data: unknown): OrganizationalMemoryCenter {
  if (!data || typeof data !== "object") return { has_customer: false };
  const d = data as Record<string, unknown>;

  return {
    has_customer: Boolean(d.has_customer),
    has_access: d.has_access !== undefined ? Boolean(d.has_access) : undefined,
    plan: asString(d.plan) || undefined,
    starter_mode: Boolean(d.starter_mode),
    business_features: Boolean(d.business_features),
    enterprise_features: Boolean(d.enterprise_features),
    briefing: asString(d.briefing) || undefined,
    since_last_login: asArray(d.since_last_login),
    entry_count: typeof d.entry_count === "number" ? d.entry_count : undefined,
    recent_entries: asArray(d.recent_entries),
    decisions: asArray(d.decisions),
    lessons: asArray(d.lessons),
    integration_context: (d.integration_context as OrganizationalMemoryCenter["integration_context"]) ?? undefined,
    privacy_note: asString(d.privacy_note) || undefined,
  };
}
