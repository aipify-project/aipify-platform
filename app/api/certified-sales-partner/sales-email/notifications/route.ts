import { NextResponse } from "next/server";
import { callCspRpc } from "@/lib/certified-sales-partner/core-rpc";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Unread sales-email replies for the signed-in seller. Empty when persistence is not applied. */
export async function GET() {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;
    const result = await callCspRpc<{ ready?: boolean; unread?: unknown[] }>(
      gate.access.supabase,
      "csp_sales_email_list_unread",
    );
    if (!result.ready || !result.data || result.data.ready !== true || !Array.isArray(result.data.unread)) {
      return NextResponse.json({ found: false, backend_ready: false, unread: [] }, { headers: NO_STORE });
    }
    return NextResponse.json({ found: true, backend_ready: true, unread: result.data.unread }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ found: false, backend_ready: false, unread: [] }, { headers: NO_STORE });
  }
}

export async function POST(request: Request) {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;
    const body = (await request.json().catch(() => null)) as { notificationId?: unknown } | null;
    const notificationId = typeof body?.notificationId === "string" ? body.notificationId : "";
    if (!notificationId) return NextResponse.json({ error: "notification_id_required" }, { status: 400, headers: NO_STORE });
    const result = await callCspRpc(gate.access.supabase, "csp_sales_email_mark_notification_read", {
      p_notification_id: notificationId,
    });
    if (!result.ready) {
      return NextResponse.json({ ok: false, code: "persistence_not_ready" }, { status: 409, headers: NO_STORE });
    }
    return NextResponse.json({ ok: true }, { headers: NO_STORE });
  } catch {
    return NextResponse.json({ error: "notification_update_failed" }, { status: 500, headers: NO_STORE });
  }
}
