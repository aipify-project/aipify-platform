import type { RevenueOperationsCenter } from "./types";

function asRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === "object" && value !== null ? (value as Record<string, unknown>) : null;
}

export function parseRevenueOperationsCenter(raw: unknown): RevenueOperationsCenter | null {
  const row = asRecord(raw);
  if (!row || !asRecord(row.overview)) return null;

  const overview = row.overview as Record<string, unknown>;
  const external = asRecord(row.external_responsibilities);
  const packageSync = asRecord(row.package_sync);

  return {
    principle: String(row.principle ?? ""),
    founding_principle: String(row.founding_principle ?? ""),
    external_responsibilities: {
      tax_calculation: Boolean(external?.tax_calculation),
      vat_reporting: Boolean(external?.vat_reporting),
      note: String(external?.note ?? ""),
    },
    activation_flow: Array.isArray(row.activation_flow)
      ? row.activation_flow.map(String)
      : [],
    package_sync: {
      on_payment_success: String(packageSync?.on_payment_success ?? ""),
      on_subscription_expiry: String(packageSync?.on_subscription_expiry ?? ""),
      status: String(packageSync?.status ?? ""),
    },
    overview: {
      active_billing_providers: Number(overview.active_billing_providers ?? 0),
      successful_activations_30d: Number(overview.successful_activations_30d ?? 0),
      pending_activations: Number(overview.pending_activations ?? 0),
      failed_activations: Number(overview.failed_activations ?? 0),
      subscription_upgrades: Number(overview.subscription_upgrades ?? 0),
      subscription_downgrades: Number(overview.subscription_downgrades ?? 0),
    },
    failed_activations: Array.isArray(row.failed_activations)
      ? row.failed_activations.map((item) => {
          const f = asRecord(item)!;
          return {
            id: String(f.id),
            customer_id: String(f.customer_id),
            customer: String(f.customer),
            provider: String(f.provider),
            failure_reason: String(f.failure_reason),
            detected_at: String(f.detected_at),
            resolution_status: String(f.resolution_status),
            package_key: String(f.package_key),
          };
        })
      : [],
    timeline: Array.isArray(row.timeline)
      ? row.timeline.map((item) => {
          const e = asRecord(item)!;
          return {
            id: String(e.id),
            customer_id: e.customer_id ? String(e.customer_id) : null,
            customer: String(e.customer),
            event_type: String(e.event_type),
            provider: String(e.provider),
            timestamp: String(e.timestamp),
            outcome: String(e.outcome),
            summary: String(e.summary),
          };
        })
      : [],
    notifications: Array.isArray(row.notifications)
      ? row.notifications.map((item) => {
          const n = asRecord(item)!;
          return {
            id: String(n.id),
            customer_id: String(n.customer_id),
            customer: String(n.customer),
            notification_type: String(n.notification_type),
            channel: String(n.channel),
            status: String(n.status),
            summary: String(n.summary),
            created_at: String(n.created_at),
          };
        })
      : [],
    audit: Array.isArray(row.audit)
      ? row.audit.map((item) => {
          const a = asRecord(item)!;
          return {
            id: String(a.id),
            customer_id: a.customer_id ? String(a.customer_id) : null,
            activation_id: a.activation_id ? String(a.activation_id) : null,
            action: String(a.action),
            summary: String(a.summary),
            context:
              typeof a.context === "object" && a.context !== null
                ? (a.context as Record<string, unknown>)
                : {},
            created_at: String(a.created_at),
          };
        })
      : [],
    supported_providers: Array.isArray(row.supported_providers)
      ? row.supported_providers.map(String)
      : [],
    supported_event_types: Array.isArray(row.supported_event_types)
      ? row.supported_event_types.map(String)
      : [],
  };
}
