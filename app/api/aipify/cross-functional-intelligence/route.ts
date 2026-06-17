import { NextResponse } from "next/server";
import { parseCFIOverview } from "@/lib/app-portal/cross-functional-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_cross_functional_intelligence", {
      p_department:      searchParams.get("department")       || null,
      p_team:            searchParams.get("team")             || null,
      p_dependency_type: searchParams.get("dependency_type")  || null,
      p_risk_level:      searchParams.get("risk_level")       || null,
      p_priority:        searchParams.get("priority")         || null,
      p_review_status:   searchParams.get("review_status")    || null,
      p_search:          searchParams.get("search")           || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCFIOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load cross-functional intelligence" }, { status: 500 });
  }
}
