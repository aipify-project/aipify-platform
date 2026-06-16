import { NextResponse } from "next/server";
import { parseCapacityList, parseCapacityRecordItem } from "@/lib/app-portal/capacity-workload";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_capacity_records", {
      p_team: searchParams.get("team") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_category: searchParams.get("category") || null,
      p_status: searchParams.get("status") || null,
      p_workload_level: searchParams.get("workload_level") || null,
      p_trend_direction: searchParams.get("trend_direction") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCapacityList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load capacity records" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  team_name?: string;
  category?: string;
  current_utilization?: number;
  recommended_utilization?: number;
  trend_direction?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_capacity_record", {
      p_title: body.title,
      p_team_name: body.team_name ?? "",
      p_category: body.category ?? "team_capacity",
      p_current_utilization: body.current_utilization ?? 0,
      p_recommended_utilization: body.recommended_utilization ?? 75,
      p_trend_direction: body.trend_direction ?? "stable",
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ created: true, record: parseCapacityRecordItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to create capacity record" }, { status: 500 });
  }
}
