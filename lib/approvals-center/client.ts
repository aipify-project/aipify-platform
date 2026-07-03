import type { SupabaseClient } from "@supabase/supabase-js";
import { parseTrustApprovalFromCenterRow } from "@/lib/core/human-approval/trust-action-adapter";

export async function getCustomerApprovalsCenter(supabase: SupabaseClient) {
  const { data, error } = await supabase.rpc("get_customer_approvals_center");
  if (error) throw new Error(error.message);

  const payload = (data ?? {}) as Record<string, unknown>;
  const approvals = Array.isArray(payload.approvals)
    ? payload.approvals.map((row) =>
        parseTrustApprovalFromCenterRow(row as Record<string, unknown>),
      )
    : [];

  return {
    ...payload,
    approvals,
  } as Record<string, unknown>;
}
