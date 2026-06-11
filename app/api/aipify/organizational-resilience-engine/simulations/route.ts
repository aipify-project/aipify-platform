import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      plan_id?: string;
      simulation_type?: string;
      status?: string;
      outcomes_metadata?: Record<string, unknown>;
    };

    if (!body.plan_id || !body.simulation_type) {
      return NextResponse.json({ error: "plan_id and simulation_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_resilience_simulation", {
      p_plan_id: body.plan_id,
      p_simulation_type: body.simulation_type,
      p_status: body.status ?? "completed",
      p_outcomes_metadata: body.outcomes_metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to record simulation" }, { status: 500 });
  }
}
