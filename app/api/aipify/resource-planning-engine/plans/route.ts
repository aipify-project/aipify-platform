import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      plan_id?: string;
      allocation_id?: string;
      scenario_id?: string;
      plan_name?: string;
      planning_period?: string;
      owner_user_id?: string;
      status?: string;
      resource_type?: string;
      allocated_amount?: number;
      utilized_amount?: number;
      scenario_name?: string;
      allocation_snapshot?: unknown[];
      reason?: string;
      capture_memory?: boolean;
      metadata?: Record<string, unknown>;
    };

    if (body.action === "update_status") {
      if (!body.plan_id || !body.status) {
        return NextResponse.json({ error: "plan_id and status required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_resource_plan_status", {
        p_plan_id: body.plan_id,
        p_status: body.status,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "approve") {
      if (!body.plan_id) {
        return NextResponse.json({ error: "plan_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("approve_resource_plan", {
        p_plan_id: body.plan_id,
        p_capture_memory: body.capture_memory ?? false,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "create_allocation") {
      if (!body.plan_id || !body.resource_type) {
        return NextResponse.json({ error: "plan_id and resource_type required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("create_resource_allocation", {
        p_plan_id: body.plan_id,
        p_resource_type: body.resource_type,
        p_allocated_amount: body.allocated_amount ?? 0,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "update_allocation") {
      if (!body.allocation_id) {
        return NextResponse.json({ error: "allocation_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_resource_allocation", {
        p_allocation_id: body.allocation_id,
        p_allocated_amount: body.allocated_amount ?? null,
        p_utilized_amount: body.utilized_amount ?? null,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "override_utilization") {
      if (!body.allocation_id || body.utilized_amount === undefined) {
        return NextResponse.json({ error: "allocation_id and utilized_amount required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("override_resource_utilization", {
        p_allocation_id: body.allocation_id,
        p_utilized_amount: body.utilized_amount,
        p_reason: body.reason ?? null,
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "create_scenario") {
      if (!body.plan_id || !body.scenario_name) {
        return NextResponse.json({ error: "plan_id and scenario_name required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("create_resource_scenario", {
        p_plan_id: body.plan_id,
        p_scenario_name: body.scenario_name,
        p_allocation_snapshot: body.allocation_snapshot ?? [],
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "compare_scenarios") {
      if (!body.plan_id) {
        return NextResponse.json({ error: "plan_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("compare_resource_scenarios", {
        p_plan_id: body.plan_id,
        p_scenario_id: body.scenario_id ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.plan_name || !body.planning_period) {
      return NextResponse.json({ error: "plan_name and planning_period required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_resource_plan", {
      p_plan_name: body.plan_name,
      p_planning_period: body.planning_period,
      p_owner_user_id: body.owner_user_id ?? null,
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process plan action" }, { status: 500 });
  }
}
