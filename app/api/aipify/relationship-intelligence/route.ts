import { NextResponse } from "next/server";
import { parseRelationshipIntelligenceDashboard } from "@/lib/aipify/companion-relationship-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_companion_relationship_intelligence_dashboard", {
      p_relationship_type: searchParams.get("relationship_type") || null,
      p_health_level:      searchParams.get("health_level")      || null,
      p_engagement_level:  searchParams.get("engagement_level")  || null,
      p_owner:             searchParams.get("owner")             || null,
      p_department:        searchParams.get("department")        || null,
      p_date_from:         searchParams.get("date_from")         || null,
      p_search:            searchParams.get("search")            || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseRelationshipIntelligenceDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load relationship intelligence" }, { status: 500 });
  }
}
