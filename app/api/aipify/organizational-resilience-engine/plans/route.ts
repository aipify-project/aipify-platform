import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      plan_name?: string;
      scenario_type?: string;
      continuity_requirements?: Record<string, unknown>;
      owner_user_id?: string;
      review_frequency?: string;
      plan_id?: string;
      status?: string;
    };

    if (body.action === "approve") {
      if (!body.plan_id) return NextResponse.json({ error: "plan_id required" }, { status: 400 });
      const { data, error } = await supabase.rpc("approve_resilience_plan", {
        p_plan_id: body.plan_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.plan_name || !body.scenario_type) {
      return NextResponse.json({ error: "plan_name and scenario_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_resilience_plan", {
      p_plan_name: body.plan_name,
      p_scenario_type: body.scenario_type,
      p_continuity_requirements: body.continuity_requirements ?? {},
      p_owner_user_id: body.owner_user_id ?? null,
      p_review_frequency: body.review_frequency ?? "quarterly",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process plan action" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { plan_id?: string; status?: string };
    if (!body.plan_id || !body.status) {
      return NextResponse.json({ error: "plan_id and status required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("update_resilience_plan_status", {
      p_plan_id: body.plan_id,
      p_status: body.status,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}
