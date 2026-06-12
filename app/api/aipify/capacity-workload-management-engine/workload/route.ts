import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      profile_id?: string;
      workload_id?: string;
      warning_id?: string;
      user_id?: string;
      team_id?: string;
      available_hours_per_week?: number;
      workload_limit?: number;
      status?: string;
      source_type?: string;
      source_id?: string;
      estimated_effort?: number;
      priority?: string;
      due_date?: string;
      reason?: string;
      capture_memory?: boolean;
      metadata?: Record<string, unknown>;
    };

    if (body.action === "update_profile") {
      if (!body.profile_id) {
        return NextResponse.json({ error: "profile_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_capacity_profile", {
        p_profile_id: body.profile_id,
        p_available_hours_per_week: body.available_hours_per_week ?? null,
        p_workload_limit: body.workload_limit ?? null,
        p_status: body.status ?? null,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "create_workload") {
      if (!body.source_type) {
        return NextResponse.json({ error: "source_type required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("create_workload_item", {
        p_source_type: body.source_type,
        p_estimated_effort: body.estimated_effort ?? 1,
        p_user_id: body.user_id ?? null,
        p_source_id: body.source_id ?? null,
        p_priority: body.priority ?? "medium",
        p_due_date: body.due_date ?? null,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "reassign") {
      if (!body.workload_id || !body.user_id) {
        return NextResponse.json({ error: "workload_id and user_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("reassign_workload_item", {
        p_workload_id: body.workload_id,
        p_user_id: body.user_id,
        p_reason: body.reason ?? null,
        p_capture_memory: body.capture_memory ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "acknowledge_warning") {
      if (!body.warning_id) {
        return NextResponse.json({ error: "warning_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("acknowledge_workload_warning", {
        p_warning_id: body.warning_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("create_capacity_profile", {
      p_user_id: body.user_id ?? null,
      p_team_id: body.team_id ?? null,
      p_available_hours_per_week: body.available_hours_per_week ?? 40,
      p_workload_limit: body.workload_limit ?? 40,
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process capacity action" }, { status: 500 });
  }
}
