import type { UnifiedBillingAdvisorBundle, UnifiedBillingCenter } from "./types";

export function parseUnifiedBillingCenter(raw: unknown): UnifiedBillingCenter {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    error: typeof row.error === "string" ? row.error : undefined,
    principle: typeof row.principle === "string" ? row.principle : undefined,
    privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : undefined,
    can_manage_profiles: Boolean(row.can_manage_profiles),
    profiles: Array.isArray(row.profiles) ? (row.profiles as UnifiedBillingCenter["profiles"]) : [],
    subscriptions: Array.isArray(row.subscriptions) ? (row.subscriptions as Record<string, unknown>[]) : [],
    invoices: Array.isArray(row.invoices) ? (row.invoices as Record<string, unknown>[]) : [],
    licenses: Array.isArray(row.licenses) ? (row.licenses as Record<string, unknown>[]) : [],
    recent_events: Array.isArray(row.recent_events) ? (row.recent_events as Record<string, unknown>[]) : [],
    checkout_flow: Array.isArray(row.checkout_flow) ? (row.checkout_flow as string[]) : [],
    stats: typeof row.stats === "object" && row.stats ? (row.stats as Record<string, number>) : {},
  };
}

export function parseUnifiedBillingAdvisorBundle(raw: unknown): UnifiedBillingAdvisorBundle {
  const row = (raw ?? {}) as Record<string, unknown>;
  return {
    found: Boolean(row.found),
    insights: Array.isArray(row.insights)
      ? (row.insights as UnifiedBillingAdvisorBundle["insights"])
      : [],
    center: row.center ? parseUnifiedBillingCenter(row.center) : undefined,
  };
}
