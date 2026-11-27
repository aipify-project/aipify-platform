import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { settlementPreviewResponse } from "@/lib/certified-sales-partner/settlement-preview-response";
import { getLocale } from "@/lib/i18n/get-locale";
import { createClient } from "@/lib/supabase/server";

/** Read-only preview. Does not issue a number and does not change status. */
export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

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
