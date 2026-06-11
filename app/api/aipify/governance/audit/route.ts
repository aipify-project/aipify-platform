import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limit = Number(new URL(request.url).searchParams.get("limit") ?? "50");
    const { data, error } = await supabase.rpc("list_governance_audit_timeline", {
      p_limit: Number.isFinite(limit) ? limit : 50,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ entries: data });
  } catch {
    return NextResponse.json({ error: "Audit request failed" }, { status: 500 });
  }
}
