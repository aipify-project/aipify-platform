/**
 * Detect whether the authenticated user already has a CSP seller identity.
 * Fail-closed: missing Core → treat as "unknown", never invent a partner id.
 */
import { callCspRpc, type CspRpcClient } from "@/lib/certified-sales-partner/core-rpc";
import { parsePartnerOverview } from "@/lib/certified-sales-partner/partner-overview";

export type CspPresence =
  | { known: false; reason: "rpc_unavailable" | "unauthorized" | "not_found" }
  | { known: true; partnerId: string; partnerStatus: string | null };

export async function detectOwnCspPartnerPresence(supabase: CspRpcClient): Promise<CspPresence> {
  const result = await callCspRpc(supabase, "csp_get_partner_overview");
  if (!result.ready) {
    if (result.error === "unauthorized") return { known: false, reason: "unauthorized" };
    if (result.error === "partner_not_found") return { known: false, reason: "not_found" };
    // Suspended/inactive partners still own a CSP identity — block dual GP signup.
    if (result.error === "partner_not_active") {
      return { known: true, partnerId: "csp-inactive", partnerStatus: "suspended" };
    }
    return { known: false, reason: "rpc_unavailable" };
  }
  const overview = parsePartnerOverview(result.data);
  if (!overview.partnerId) return { known: false, reason: "not_found" };
  return {
    known: true,
    partnerId: overview.partnerId,
    partnerStatus: overview.partnerStatus,
  };
}