import { NextResponse } from "next/server";
import { parseCapacityDetail, parseCapacityRecordItem } from "@/lib/app-portal/capacity-workload";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_capacity_record", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCapacityDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load capacity record" }, { status: 500 });
  }
}

type UpdateBody = {
  title?: string;
  team_name?: string;
  category?: string;
  current_utilization?: number;
  recommended_utilization?: number;
  trend_direction?: string;
  status?: string;
  notes?: string;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_capacity_record", {
      p_id: id,
      p_title: body.title ?? null,
      p_team_name: body.team_name ?? null,
      p_category: body.category ?? null,
      p_current_utilization: body.current_utilization ?? null,
      p_recommended_utilization: body.recommended_utilization ?? null,
      p_trend_direction: body.trend_direction ?? null,
      p_status: body.status ?? null,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ updated: true, record: parseCapacityRecordItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to update capacity record" }, { status: 500 });
  }
}
