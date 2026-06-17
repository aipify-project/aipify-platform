import { NextResponse } from "next/server";
import { parseWorkPrioritizationDashboard } from "@/lib/aipify/companion-work-prioritization";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_companion_work_prioritization_dashboard", {
      p_priority:   searchParams.get("priority")   || null,
      p_department: searchParams.get("department") || null,
      p_status:     searchParams.get("status")     || null,
      p_project:    searchParams.get("project")    || null,
      p_owner:      searchParams.get("owner")      || null,
      p_date_from:  searchParams.get("date_from")  || null,
      p_search:     searchParams.get("search")     || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseWorkPrioritizationDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load work prioritization" }, { status: 500 });
  }
}
