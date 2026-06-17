import { NextResponse } from "next/server";
import { parseFutureStateMilestones } from "@/lib/app-portal/future-state-planning";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_future_state_milestones", {
      p_plan_id: searchParams.get("plan_id") || null,
      p_status:  searchParams.get("status")  || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseFutureStateMilestones(data));
  } catch {
    return NextResponse.json({ error: "Failed to load milestones" }, { status: 500 });
  }
}
