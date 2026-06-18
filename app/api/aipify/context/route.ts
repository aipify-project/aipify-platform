import { NextResponse } from "next/server";
import { parseCompanionContextDashboard } from "@/lib/aipify/companion-context-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_companion_context_dashboard", {
      p_source:     searchParams.get("source")      || null,
      p_department: searchParams.get("department")  || null,
      p_priority:   searchParams.get("priority")    || null,
      p_user_filter:searchParams.get("user")        || null,
      p_date_from:  searchParams.get("date_from")    || null,
      p_search:     searchParams.get("search")      || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCompanionContextDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load companion context" }, { status: 500 });
  }
}
