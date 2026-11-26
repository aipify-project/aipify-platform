import { NextResponse } from "next/server";
import {
  CSP_ATTRIBUTE_REGISTRATION_RPC,
  CSP_ATTRIBUTION_COOKIE,
  callCspRpc,
  failClosedJson,
  isCspLinkCode,
  isSelfReferral,
  parseCspAttributionCookie,
} from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Bind a customer organization to the first-touch CSP link from the httpOnly cookie.
 * Partner id is never accepted from the client body — only the opaque link code cookie.
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const body = (await request.json()) as { customerOrgId?: string };
    const customerOrgId = String(body.customerOrgId ?? "").trim();
    if (!customerOrgId) {
      return NextResponse.json({ error: "customer_org_required" }, { status: 400 });
    }

    const cookieHeader = request.headers.get("cookie") ?? "";
    const raw = cookieHeader.match(new RegExp(`${CSP_ATTRIBUTION_COOKIE}=([^;]+)`))?.[1] ?? null;
    const attr = parseCspAttributionCookie(raw ? decodeURIComponent(raw) : null);
    if (!attr || !isCspLinkCode(attr.code)) {
      return NextResponse.json({ error: "no_attribution_cookie" }, { status: 400 });
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
      if (isSelfReferral({ partnerAuthUserId: partnerAuth, customerAuthUserId: user.id })) {
        return NextResponse.json({ error: "self_referral" }, { status: 403 });
      }
    }

    const result = await callCspRpc(admin, CSP_ATTRIBUTE_REGISTRATION_RPC, {
      p_payload: {
        code: attr.code,
        customerOrgId,
        customerAuthUserId: user.id,
      },
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json({ attribution: result.data });
  } catch {
    return NextResponse.json({ error: "attribute_registration_failed" }, { status: 500 });
  }
}
