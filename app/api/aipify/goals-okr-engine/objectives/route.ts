import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      objective_id?: string;
      key_result_id?: string;
      objective_name?: string;
      description?: string;
      owner_user_id?: string;
      priority?: string;
      hierarchy_level?: string;
      parent_objective_id?: string;
      target_date?: string;
      key_result_name?: string;
      starting_value?: number;
      target_value?: number;
      current_value?: number;
      override_progress?: boolean;
      progress_percentage?: number;
      generate_tasks?: boolean;
      capture_memory?: boolean;
      metadata?: Record<string, unknown>;
    };

    if (body.action === "activate") {
      if (!body.objective_id) {
        return NextResponse.json({ error: "objective_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("activate_organization_objective", {
        p_objective_id: body.objective_id,
        p_generate_tasks: body.generate_tasks ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "create_key_result") {
      if (!body.objective_id || !body.key_result_name) {
        return NextResponse.json({ error: "objective_id and key_result_name required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("create_organization_key_result", {
        p_objective_id: body.objective_id,
        p_key_result_name: body.key_result_name,
        p_description: body.description ?? null,
        p_starting_value: body.starting_value ?? 0,
        p_target_value: body.target_value ?? 100,
        p_current_value: body.current_value ?? 0,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update_progress") {
      if (!body.key_result_id || body.current_value === undefined) {
        return NextResponse.json({ error: "key_result_id and current_value required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_key_result_progress", {
        p_key_result_id: body.key_result_id,
        p_current_value: body.current_value,
        p_override_progress: body.override_progress ?? false,
        p_progress_percentage: body.progress_percentage ?? null,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "approve_completion") {
      if (!body.objective_id) {
        return NextResponse.json({ error: "objective_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("approve_objective_completion", {
        p_objective_id: body.objective_id,
        p_capture_memory: body.capture_memory ?? true,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.objective_name) {
      return NextResponse.json({ error: "objective_name required" }, { status: 400 });
    }
    const { data, error } = await supabase.rpc("create_organization_objective", {
      p_objective_name: body.objective_name,
      p_description: body.description ?? null,
      p_owner_user_id: body.owner_user_id ?? null,
      p_priority: body.priority ?? "medium",
      p_hierarchy_level: body.hierarchy_level ?? "team",
      p_parent_objective_id: body.parent_objective_id ?? null,
      p_target_date: body.target_date ?? null,
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process objective action" }, { status: 500 });
  }
}
