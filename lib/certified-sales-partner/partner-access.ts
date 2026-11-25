import type { SupabaseClient } from "@supabase/supabase-js";
import { authUserHasCspPartnerProfile } from "@/lib/certified-sales-partner/partner-admin-detail";
import { callCspRpc } from "@/lib/certified-sales-partner/core-rpc";

/**
 * True when the signed-in user has a CSP partner profile.
 * Prefers service-role lookup by auth uid; falls back to the user-scoped overview RPC
 * so /partners access still works when service role is unavailable in the runtime.
 */
export async function userHasCspPartnerAccess(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  if (!userId) return false;

  try {
    if (await authUserHasCspPartnerProfile(userId)) return true;
  } catch {
    // Fall through to user-scoped RPC.
  }

  try {
    const result = await callCspRpc(supabase, "csp_get_partner_overview");
    if (!result.ready) return false;
    const data = result.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) return false;
    const partner = (data as Record<string, unknown>).partner;
    return Boolean(partner && typeof partner === "object");
  } catch {
    return false;
  }
}
