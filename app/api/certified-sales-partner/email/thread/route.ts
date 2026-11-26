import { NextResponse } from "next/server";
import { callCspRpc } from "@/lib/certified-sales-partner";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

const NO_STORE = { "Cache-Control": "no-store" } as const;

/** Conversation for the signed-in seller. Another seller's lead id is forbidden. */
export async function GET(request: Request) {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;
    const leadId = new URL(request.url).searchParams.get("lead") ?? "";
    if (!/^[0-9a-f-]{36}$/i.test(leadId)) {
      return NextResponse.json({ found: false, error: "invalid_payload" }, { status: 400, headers: NO_STORE });
    }
    const result = await callCspRpc<{ ok?: boolean; code?: string; lead?: unknown; messages?: unknown[] }>(
      gate.access.supabase,
      "csp_sales_email_list_thread",
      { p_lead_id: leadId },
    );
    if (!result.ready) {
      return NextResponse.json({ found: false, backend_ready: false }, { status: 503, headers: NO_STORE });
    }
    if (result.data.ok !== true) {
      const status = result.data.code === "forbidden" ? 403 : 404;
      return NextResponse.json({ found: false, code: result.data.code ?? "not_found" }, { status, headers: NO_STORE });
    }
    return NextResponse.json(
      { found: true, backend_ready: true, lead: result.data.lead ?? null, messages: result.data.messages ?? [] },
      { headers: NO_STORE },
    );
  } catch {
    return NextResponse.json({ error: "thread_load_failed" }, { status: 500, headers: NO_STORE });
  }
}
