import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Mark an inbound admin message as read — partner own only (enforced in Core). */
export async function POST(request: Request) {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;

    const body = (await request.json().catch(() => null)) as { message_id?: string } | null;
    const messageId = typeof body?.message_id === "string" ? body.message_id.trim() : "";
    if (!messageId) {
      return NextResponse.json({ error: "message_id_required" }, { status: 400, headers: NO_STORE });
    }

    const result = await callCspRpc(gate.access.supabase, "csp_mark_partner_message_read", {
      p_message_id: messageId,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status, headers: NO_STORE });
    }
    return NextResponse.json(result.data, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "messages_read_failed" }, { status: 500, headers: NO_STORE });
  }
}
