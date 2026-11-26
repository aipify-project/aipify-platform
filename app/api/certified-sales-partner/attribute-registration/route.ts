import { NextResponse } from "next/server";
import { tryAttributeCspRegistrationFromCookie } from "@/lib/certified-sales-partner/attribute-from-cookie";
import { createClient } from "@/lib/supabase/server";

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

    const result = await tryAttributeCspRegistrationFromCookie({
      cookieHeader: request.headers.get("cookie"),
      customerOrgId,
      customerAuthUserId: user.id,
    });

    if (!result.attempted && result.error === "no_attribution_cookie") {
      return NextResponse.json({ error: "no_attribution_cookie" }, { status: 400 });
    }
    if (result.error === "self_referral") {
      return NextResponse.json({ error: "self_referral" }, { status: 403 });
    }
    if (!result.attributed) {
      return NextResponse.json(
        { error: result.error ?? "attribution_failed", attributed: false },
        { status: result.error === "core_rpc_not_ready" ? 503 : 400 },
      );
    }
    return NextResponse.json({ attributed: true });
  } catch {
    return NextResponse.json({ error: "attribute_registration_failed" }, { status: 500 });
  }
}
