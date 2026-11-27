import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { settlementPreviewResponse } from "@/lib/certified-sales-partner/settlement-preview-response";
import { getLocale } from "@/lib/i18n/get-locale";
import { createClient } from "@/lib/supabase/server";

/** Partner-scoped preview. The list RPC already hides other partners' settlements. */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await callCspRpc(supabase, "csp_list_monthly_settlements");
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return settlementPreviewResponse(result.data, id, await getLocale());
  } catch {
    return NextResponse.json({ error: "settlement_preview_failed" }, { status: 500 });
  }
}
