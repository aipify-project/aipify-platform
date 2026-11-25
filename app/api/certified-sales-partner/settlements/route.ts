import { NextResponse } from "next/server";
import { callCspRpc, failClosedJson } from "@/lib/certified-sales-partner";
import { createClient } from "@/lib/supabase/server";

/** Partner's own monthly settlements (read-only) — fail-closed when CSP Core is inactive. */
export async function GET() {
  try {
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
    return NextResponse.json(
      Array.isArray(result.data) ? { settlements: result.data } : (result.data ?? { settlements: [] }),
    );
  } catch {
    return NextResponse.json({ error: "settlements_load_failed" }, { status: 500 });
  }
}
