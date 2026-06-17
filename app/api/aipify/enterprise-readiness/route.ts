import { NextResponse } from "next/server";
import { parseEnterpriseReadinessOverview } from "@/lib/app-portal/enterprise-readiness";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_enterprise_readiness", {
      p_category:        searchParams.get("category")         || null,
      p_readiness_level: searchParams.get("readiness_level")  || null,
      p_priority:        searchParams.get("priority")         || null,
      p_department:      searchParams.get("department")       || null,
      p_owner:           searchParams.get("owner")            || null,
      p_review_status:   searchParams.get("review_status")    || null,
      p_period_from:     searchParams.get("period_from")      || null,
      p_search:          searchParams.get("search")           || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseEnterpriseReadinessOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load enterprise readiness" }, { status: 500 });
  }
}
