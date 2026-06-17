import { NextResponse } from "next/server";
import {
  parseStrategicOpportunitiesOverview,
  parseOpportunityActionResult,
} from "@/lib/app-portal/strategic-opportunities";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_strategic_opportunities", {
      p_category:          searchParams.get("category")          || null,
      p_status:            searchParams.get("status")            || null,
      p_department:        searchParams.get("department")        || null,
      p_strategic_priority:searchParams.get("strategic_priority")|| null,
      p_executive_owner:   searchParams.get("executive_owner")   || null,
      p_time_horizon:      searchParams.get("time_horizon")      || null,
      p_period_from:       searchParams.get("period_from")       || null,
      p_search:            searchParams.get("search")            || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseStrategicOpportunitiesOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load strategic opportunities" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      title?: string;
      description?: string;
      category?: string;
      strategic_priority?: string;
      leadership_owner?: string;
      time_horizon?: string;
    };

    const { data, error } = await supabase.rpc("upsert_app_portal_strategic_opportunity", {
      p_opportunity_id:   null,
      p_title:            body.title            ?? null,
      p_description:      body.description      ?? null,
      p_category:         body.category         ?? null,
      p_status:           null,
      p_strategic_priority: body.strategic_priority ?? null,
      p_leadership_owner: body.leadership_owner ?? null,
      p_time_horizon:     body.time_horizon     ?? null,
      p_review_notes:     null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseOpportunityActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to create opportunity" }, { status: 500 });
  }
}
