import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { isCspPartnerPortalStatusAllowed } from "@/lib/certified-sales-partner/partner-access";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Platform Admin — list partner messages (optional partner filter). */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const partnerId = new URL(request.url).searchParams.get("partner_id");
    const result = await callCspRpc(supabase, "csp_list_partner_messages", {
      p_partner_id: partnerId && partnerId.trim() ? partnerId.trim() : null,
      p_limit: 200,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status, headers: NO_STORE });
    }

    const data = (result.data ?? {}) as { messages?: unknown[] };
    const messages = Array.isArray(data.messages) ? data.messages : [];
    return NextResponse.json(
      { found: true, backend_ready: true, rows: messages, messages },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ error: "messages_load_failed" }, { status: 500, headers: NO_STORE });
  }
}

/** Platform Admin — send admin_to_partner message. */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const body = (await request.json().catch(() => null)) as {
      partner_id?: string;
      body?: string;
      subject?: string;
      thread_id?: string;
      idempotency_key?: string;
      template_key?: string;
    } | null;

    const partnerId = typeof body?.partner_id === "string" ? body.partner_id.trim() : "";
    const text = typeof body?.body === "string" ? body.body.trim() : "";
    if (!partnerId || !text) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400, headers: NO_STORE });
    }

    // Operational messaging targets approved/active portal partners only — not suspended.
    try {
      const admin = createServiceRoleClient();
      const { data: partner, error } = await admin
        .from("csp_partner_profiles")
        .select("id, status")
        .eq("id", partnerId)
        .maybeSingle();
      if (error || !partner) {
        return NextResponse.json({ found: false, error: "partner_not_found" }, { status: 404, headers: NO_STORE });
      }
      if (!isCspPartnerPortalStatusAllowed(partner.status)) {
        return NextResponse.json({ found: false, error: "partner_not_active" }, { status: 403, headers: NO_STORE });
      }
    } catch {
      return NextResponse.json({ error: "messages_send_failed" }, { status: 500, headers: NO_STORE });
    }

    const result = await callCspRpc(supabase, "csp_send_partner_message", {
      p_partner_id: partnerId,
      p_direction: "admin_to_partner",
      p_body: text,
      p_subject: typeof body?.subject === "string" ? body.subject : null,
      p_thread_id: typeof body?.thread_id === "string" ? body.thread_id : null,
      p_idempotency_key: typeof body?.idempotency_key === "string" ? body.idempotency_key : null,
      p_template_key: typeof body?.template_key === "string" ? body.template_key : null,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status, headers: NO_STORE });
    }
    return NextResponse.json(result.data, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "messages_send_failed" }, { status: 500, headers: NO_STORE });
  }
}
