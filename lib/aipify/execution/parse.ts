import type { ActionCenter, AipifyAction } from "./types";

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function parseAipifyActions(data: unknown): AipifyAction[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (Array.isArray(d.actions)) return d.actions as AipifyAction[];
  return asArray<AipifyAction>(d);
}

export function parseActionCenter(data: unknown): ActionCenter {
  if (!data || typeof data !== "object") return { has_customer: false };
  const d = data as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    has_access: d.has_access !== undefined ? Boolean(d.has_access) : undefined,
    plan: typeof d.plan === "string" ? d.plan : undefined,
    upgrade_required: Boolean(d.upgrade_required),
    user_role: typeof d.user_role === "string" ? d.user_role : undefined,
    settings: d.settings as ActionCenter["settings"],
    counts: d.counts as Record<string, number>,
    pending_actions: asArray(d.pending_actions),
    recent_executed: asArray(d.recent_executed),
    rules: asArray(d.rules),
    audit_log: asArray(d.audit_log),
    permissions: asArray(d.permissions),
    ethical_principles: asArray<string>(d.ethical_principles).filter(
      (v): v is string => typeof v === "string"
    ),
    privacy_note: typeof d.privacy_note === "string" ? d.privacy_note : undefined,
  };
}
