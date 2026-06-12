import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("upsert_ai_budget", { p_payload: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save budget" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      budget_id?: string;
      status?: string;
      action?: string;
      rationale?: string;
      until?: string;
    };

    if (body.action === "approve_overage" && body.budget_id) {
      const { data, error } = await supabase.rpc("approve_ai_overage", {
        p_budget_id: body.budget_id,
        p_rationale: body.rationale ?? "",
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "emergency_override" && body.budget_id && body.until) {
      const { data, error } = await supabase.rpc("emergency_ai_budget_override", {
        p_budget_id: body.budget_id,
        p_rationale: body.rationale ?? "",
        p_until: body.until,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.budget_id || !body.status) {
      return NextResponse.json({ error: "budget_id and status are required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("update_ai_budget_status", {
      p_budget_id: body.budget_id,
      p_status: body.status,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update budget" }, { status: 500 });
  }
}
