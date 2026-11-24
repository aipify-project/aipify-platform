import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

/** Partner qualified sales list — fail-closed; never invent commission figures. */
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
    return NextResponse.json(result.data);
  } catch {
    return NextResponse.json({ error: "sales_load_failed" }, { status: 500 });
  }
}
