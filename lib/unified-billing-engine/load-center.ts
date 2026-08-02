import type { SupabaseClient } from "@supabase/supabase-js";
import { isDatabaseExecutionError } from "@/lib/tenant/app-portal-route-access";
import type { UnifiedBillingCenter } from "./types";

const PRINCIPLE =
  "Aipify owns the billing truth. Payment providers process payments.";
const PRIVACY_NOTE = "Billing metadata only — no raw payment card data stored.";

function asRecordArray(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

/**
 * Production root cause: get_customer_unified_billing_center is STABLE but calls
 * _ube586_seed() which INSERTs. PostgREST may run STABLE RPCs in a read-only
 * transaction → "cannot execute INSERT in a read-only transaction" → HTTP 500.
 *
 * This loader retries with a read-only payload (no seed) so the UI can render.
 */
export async function loadUnifiedBillingCenter(
  supabase: SupabaseClient
): Promise<{ center: UnifiedBillingCenter; status: number; degraded: boolean }> {
  const { data, error } = await supabase.rpc("get_customer_unified_billing_center");

  if (!error) {
    const row = (data ?? {}) as Record<string, unknown>;
    return {
      center: {
        found: row.found !== false,
        error: typeof row.error === "string" ? row.error : undefined,
        principle: typeof row.principle === "string" ? row.principle : PRINCIPLE,
        privacy_note: typeof row.privacy_note === "string" ? row.privacy_note : PRIVACY_NOTE,
        can_manage_profiles: Boolean(row.can_manage_profiles),
        profiles: asRecordArray(row.profiles) as UnifiedBillingCenter["profiles"],
        subscriptions: asRecordArray(row.subscriptions),
        invoices: asRecordArray(row.invoices),
        licenses: asRecordArray(row.licenses),
        recent_events: asRecordArray(row.recent_events),
        checkout_flow: Array.isArray(row.checkout_flow) ? (row.checkout_flow as string[]) : [],
        stats:
          typeof row.stats === "object" && row.stats
            ? (row.stats as Record<string, number>)
            : {},
      },
      status: 200,
      degraded: false,
    };
  }

  const message = error.message ?? "unified_billing_unavailable";
  console.error("[unified-billing/center]", message.slice(0, 240));

  if (!isDatabaseExecutionError(message)) {
    return {
      center: { found: false, error: "billing_center_unavailable" },
      status: 500,
      degraded: false,
    };
  }

  // Read-only degraded response — never invent invoices/subscriptions/profiles.
  return {
    center: {
      found: true,
      principle: PRINCIPLE,
      privacy_note: PRIVACY_NOTE,
      can_manage_profiles: false,
      profiles: [],
      subscriptions: [],
      invoices: [],
      licenses: [],
      recent_events: [],
      checkout_flow: [],
      stats: {
        profile_count: 0,
        active_subscriptions: 0,
        overdue_invoices: 0,
        available_user_capacity: 0,
      },
      error: "billing_center_partial",
    },
    status: 200,
    degraded: true,
  };
}
