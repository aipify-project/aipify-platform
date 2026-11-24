import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc, failClosedJson, type CspPartnerStatus } from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

const ALLOWED: readonly CspPartnerStatus[] = [
  "under_review",
  "needs_information",
  "approved",
  "rejected",
  "suspended",
];

/** Platform Admin partner list / status transitions — fail-closed without Core. */
export async function GET() {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const result = await callCspRpc(supabase, "csp_get_platform_overview");
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "partners_load_failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const body = (await request.json()) as {
      partner_id?: string;
      status?: string;
      reason?: string;
    };
    if (!body.partner_id || !body.status) {
      return NextResponse.json({ error: "partner_id_and_status_required" }, { status: 400 });
    }
    if (!(ALLOWED as readonly string[]).includes(body.status)) {
      return NextResponse.json({ error: "invalid_partner_status" }, { status: 400 });
    }
    if (
      (body.status === "rejected" || body.status === "needs_information" || body.status === "suspended") &&
      !(typeof body.reason === "string" && body.reason.trim().length >= 3)
    ) {
      return NextResponse.json({ error: "reason_required" }, { status: 400 });
    }

    const result = await callCspRpc(supabase, "csp_set_partner_status", {
      p_partner_id: body.partner_id,
      p_status: body.status,
      p_reason: body.reason ?? null,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "partner_status_update_failed" }, { status: 500 });
  }
}
