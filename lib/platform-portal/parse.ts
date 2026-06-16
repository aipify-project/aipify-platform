import type { PlatformPortalDashboard } from "./types";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

export function parsePlatformPortalDashboard(raw: unknown): PlatformPortalDashboard | null {
  const row = asRecord(raw);
  if (!row) return null;

  const payment = asRecord(row.payment_status_summary) ?? {};
  const customerSuccess = asRecord(row.customer_success_indicators) ?? {};
  const marketplace = asRecord(row.marketplace_moderation) ?? {};
  const growth = asRecord(row.growth_partner_summary) ?? {};

  const productUpdates = Array.isArray(row.product_deployment_updates)
    ? row.product_deployment_updates
        .map((item) => {
          const u = asRecord(item);
          if (!u) return null;
          return {
            id: asString(u.id),
            title: asString(u.title),
            version: asString(u.version),
            classification: asString(u.classification),
            scheduled_at: u.scheduled_at ? asString(u.scheduled_at) : null,
          };
        })
        .filter((u): u is NonNullable<typeof u> => u !== null)
    : [];

  return {
    principle: asString(row.principle),
    organizations_requiring_attention: asNumber(row.organizations_requiring_attention),
    active_subscriptions: asNumber(row.active_subscriptions),
    open_support_workload: asNumber(row.open_support_workload),
    payment_status_summary: {
      active: asNumber(payment.active),
      past_due: asNumber(payment.past_due),
      trialing: asNumber(payment.trialing),
    },
    customer_success_indicators: {
      organizations_total: asNumber(customerSuccess.organizations_total),
      organizations_requiring_attention: asNumber(customerSuccess.organizations_requiring_attention),
      healthy_ratio_pct: asNumber(customerSuccess.healthy_ratio_pct, 100),
    },
    marketplace_moderation: {
      pending_review: asNumber(marketplace.pending_review),
      published: asNumber(marketplace.published),
    },
    growth_partner_summary: {
      active_programs: asNumber(growth.active_programs),
      pending_applications: asNumber(growth.pending_applications),
    },
    product_deployment_updates: productUpdates,
    privacy_note: asString(row.privacy_note),
  };
}
