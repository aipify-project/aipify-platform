import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { resolveCspPartnerScope } from "@/lib/certified-sales-partner/partner-scoped-read";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Partner inbox — own messages only via Core RPC. */
export async function GET() {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;

    const result = await callCspRpc(gate.access.supabase, "csp_list_partner_messages", {
      p_limit: 100,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status, headers: NO_STORE });
    }
    return NextResponse.json(result.data ?? { found: true, messages: [] }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "messages_load_failed" }, { status: 500, headers: NO_STORE });
  }
}

/**
 * Partner reply to Platform Admin.
 * `partner_id` is resolved from the session — never trusted from the client body.
 * Direction is fixed to `partner_to_admin`.
 */
export async function POST(request: Request) {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;

    const scope = await resolveCspPartnerScope(gate.access.userId);
    if (!scope.ok) {
      if (scope.reason === "partner_not_active") {
        return NextResponse.json({ found: false, error: "partner_not_active" }, { status: 403, headers: NO_STORE });
      }
      if (scope.reason === "partner_not_found") {
        return NextResponse.json({ found: false, error: "partner_not_found" }, { status: 404, headers: NO_STORE });
      }
      return NextResponse.json({ error: "messages_send_failed" }, { status: 500, headers: NO_STORE });
    }

    const body = (await request.json().catch(() => null)) as {
      body?: string;
      subject?: string;
      thread_id?: string;
      idempotency_key?: string;
      partner_id?: string;
    } | null;

    // Reject client attempts to spoof another partner id.
    if (typeof body?.partner_id === "string" && body.partner_id.trim() && body.partner_id.trim() !== scope.partnerId) {
      return NextResponse.json({ found: false, error: "forbidden" }, { status: 403, headers: NO_STORE });
    }

    const text = typeof body?.body === "string" ? body.body.trim() : "";
    if (!text) {
      return NextResponse.json({ error: "invalid_payload" }, { status: 400, headers: NO_STORE });
    }

    const result = await callCspRpc(gate.access.supabase, "csp_send_partner_message", {
      p_partner_id: scope.partnerId,
      p_direction: "partner_to_admin",
      p_body: text,
      p_subject: typeof body?.subject === "string" ? body.subject : null,
      p_thread_id: typeof body?.thread_id === "string" ? body.thread_id : null,
      p_idempotency_key: typeof body?.idempotency_key === "string" ? body.idempotency_key : null,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status, headers: NO_STORE });
    }
    const payload = result.data as { found?: boolean; error?: string } | null;
    if (payload && payload.found === false && typeof payload.error === "string") {
      const status = payload.error === "forbidden" || payload.error === "partner_not_active" ? 403 : 400;
      return NextResponse.json(payload, { status, headers: NO_STORE });
    }
    return NextResponse.json(result.data, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "messages_send_failed" }, { status: 500, headers: NO_STORE });
  }
}
