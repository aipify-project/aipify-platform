import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_customer_strategic_goals_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Strategic goals request failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    const { data, error } = await supabase.rpc("create_strategic_goal", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_category: body.category ?? "custom",
      p_priority: body.priority ?? "standard",
      p_owner_user_id: body.owner_user_id ?? null,
      p_parent_goal_id: body.parent_goal_id ?? null,
      p_baseline_value: body.baseline_value ?? 0,
      p_target_value: body.target_value ?? 100,
      p_current_value: body.current_value ?? null,
      p_measurement_unit: body.measurement_unit ?? "",
      p_start_date: body.start_date ?? undefined,
      p_target_date: body.target_date ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Create goal failed" }, { status: 500 });
  }
}
