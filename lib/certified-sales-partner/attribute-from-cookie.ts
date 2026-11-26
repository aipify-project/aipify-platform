/**
 * Best-effort first-wins CSP registration attribution from the httpOnly cookie.
 * Never accepts partner_id from the client. Safe to call after org create — no-ops without cookie.
 */
import { isCspLinkCode, isSelfReferral } from "./attribution-policy";
import { callCspRpc } from "./core-rpc";
import { extractOrganizationId } from "./organization-id";
import {
  CSP_ATTRIBUTE_REGISTRATION_RPC,
  CSP_ATTRIBUTION_COOKIE,
  parseCspAttributionCookie,
} from "./public-capture";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

export { extractOrganizationId };

export async function tryAttributeCspRegistrationFromCookie(input: {
  cookieHeader: string | null;
  customerOrgId: string;
  customerAuthUserId: string;
}): Promise<{ attempted: boolean; attributed: boolean; error?: string }> {
  const customerOrgId = String(input.customerOrgId ?? "").trim();
  const customerAuthUserId = String(input.customerAuthUserId ?? "").trim();
  if (!customerOrgId || !customerAuthUserId) {
    return { attempted: false, attributed: false, error: "ids_required" };
  }

  const raw =
    (input.cookieHeader ?? "").match(new RegExp(`${CSP_ATTRIBUTION_COOKIE}=([^;]+)`))?.[1] ?? null;
  const attr = parseCspAttributionCookie(raw ? decodeURIComponent(raw) : null);
  if (!attr || !isCspLinkCode(attr.code)) {
    return { attempted: false, attributed: false, error: "no_attribution_cookie" };
  }

  const admin = createServiceRoleClient();
  const { data: linkRow } = await admin
    .from("csp_attribution_links")
    .select("partner_id")
    .eq("code", attr.code)
    .maybeSingle();
  const partnerId = (linkRow as { partner_id?: string } | null)?.partner_id;
  if (partnerId) {
    const { data: partnerRow } = await admin
      .from("csp_partner_profiles")
      .select("auth_user_id")
      .eq("id", partnerId)
      .maybeSingle();
    const partnerAuth = (partnerRow as { auth_user_id?: string } | null)?.auth_user_id ?? null;
    if (isSelfReferral({ partnerAuthUserId: partnerAuth, customerAuthUserId })) {
      return { attempted: true, attributed: false, error: "self_referral" };
    }
  }

  const result = await callCspRpc(admin, CSP_ATTRIBUTE_REGISTRATION_RPC, {
    p_payload: {
      code: attr.code,
      customerOrgId,
      customerAuthUserId,
    },
  });
  if (!result.ready) {
    return { attempted: true, attributed: false, error: "core_rpc_not_ready" };
  }
  const data = result.data as { attributed?: boolean } | null;
  return { attempted: true, attributed: data?.attributed === true };
}
