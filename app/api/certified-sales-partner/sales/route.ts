import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

/** Partner's own qualified sales — fail-closed when CSP Core is inactive. */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await callCspRpc(supabase, "csp_list_qualified_sales");
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    return NextResponse.json(
      Array.isArray(result.data) ? { sales: result.data } : (result.data ?? { sales: [] }),
    );
  } catch {
    return NextResponse.json({ error: "sales_load_failed" }, { status: 500 });
  }
}
