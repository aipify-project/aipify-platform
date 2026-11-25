import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceRoleClient } from "@/lib/supabase/service-role";
import { callCspRpc } from "@/lib/certified-sales-partner/core-rpc";

/**
 * Partner statuses that may enter the seller portal (`/partners`).
 * Pending / rejected / suspended / terminated must never unlock the seller shell.
 */
export const CSP_PARTNER_PORTAL_ALLOWED_STATUSES = [
  "approved",
  "active",
  "certified",
  "in_academy",
] as const;

export type CspPartnerPortalAllowedStatus = (typeof CSP_PARTNER_PORTAL_ALLOWED_STATUSES)[number];

export function isCspPartnerPortalStatusAllowed(status: unknown): status is CspPartnerPortalAllowedStatus {
  return (
    typeof status === "string" &&
    (CSP_PARTNER_PORTAL_ALLOWED_STATUSES as readonly string[]).includes(status)
  );
}

/**
 * Server-only. Returns the CSP partner status for an auth user, or null when none exists.
 * Uses service role — never trusts client-supplied role/status fields.
 */
export async function fetchCspPartnerStatusForAuthUser(
  authUserId: string,
): Promise<string | null> {
  if (!authUserId) return null;
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from("csp_partner_profiles")
      .select("status")
      .eq("auth_user_id", authUserId)
      .maybeSingle();
    if (error || !data) return null;
    return typeof data.status === "string" ? data.status : null;
  } catch {
    return null;
  }
}

/**
 * True when the signed-in user is an explicitly approved/active CSP partner.
 * Prefers service-role status lookup; falls back to the user-scoped overview RPC
 * (still status-gated). Never grants access from email, company membership, or
 * the mere existence of a partner application row.
 */
export async function userHasCspPartnerAccess(
  supabase: SupabaseClient,
  userId: string,
): Promise<boolean> {
  if (!userId) return false;

  try {
    const status = await fetchCspPartnerStatusForAuthUser(userId);
    if (isCspPartnerPortalStatusAllowed(status)) return true;
    if (status !== null) return false;
  } catch {
    // Fall through to user-scoped RPC.
  }

  try {
    const result = await callCspRpc(supabase, "csp_get_partner_overview");
    if (!result.ready) return false;
    const data = result.data;
    if (!data || typeof data !== "object" || Array.isArray(data)) return false;
    const partner = (data as Record<string, unknown>).partner;
    if (!partner || typeof partner !== "object" || Array.isArray(partner)) return false;
    const status = (partner as Record<string, unknown>).status;
    return isCspPartnerPortalStatusAllowed(status);
  } catch {
    return false;
  }
}

/**
 * True when the auth user has an active APP customer membership (`company_users`).
 * Used so ordinary APP login is not redirected into the seller portal for dual-identity accounts.
 */
export async function authUserHasActiveCustomerMembership(authUserId: string): Promise<boolean> {
  if (!authUserId) return false;
  try {
    const admin = createServiceRoleClient();
    const { data, error } = await admin
      .from("company_users")
      .select("id")
      .eq("auth_user_id", authUserId)
      .eq("status", "active")
      .limit(1)
      .maybeSingle();
    return !error && Boolean(data);
  } catch {
    return false;
  }
}

/**
 * Server-only. Resolves whether a CSP partner auth user is also an active APP customer.
 * Used to block accidental seller approvals of ordinary APP accounts without explicit confirm.
 */
export async function partnerAuthUserHasActiveCustomerMembership(
  authUserId: string | null | undefined,
): Promise<boolean> {
  if (!authUserId) return false;
  return authUserHasActiveCustomerMembership(authUserId);
}

/**
 * Growth Portal membership (legacy) is authoritative only when Core returns has_access=true
 * for an active growth role. Customer company membership alone must never imply this.
 */
export function isGrowthPortalAccessGranted(raw: unknown): boolean {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return false;
  const row = raw as Record<string, unknown>;
  if (row.has_access !== true) return false;
  const role = typeof row.role === "string" ? row.role : "none";
  return role === "growth_partner" || role === "growth_manager" || role === "super_admin";
}
