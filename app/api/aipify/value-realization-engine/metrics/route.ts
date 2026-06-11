import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      metric_name?: string;
      category?: string;
      baseline_value?: number;
      current_value?: number;
      measurement_period?: string;
    };

    if (!body.metric_name) {
      return NextResponse.json({ error: "metric_name required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_value_metric", {
      p_metric_name: body.metric_name,
      p_category: body.category ?? "workflow_optimization",
      p_baseline_value: body.baseline_value ?? 0,
      p_current_value: body.current_value ?? 0,
      p_measurement_period: body.measurement_period ?? "monthly",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to record metric" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      metric_id?: string;
      current_value?: number;
      baseline_value?: number;
    };

    if (!body.metric_id) {
      return NextResponse.json({ error: "metric_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("update_value_metric", {
      p_metric_id: body.metric_id,
      p_current_value: body.current_value ?? 0,
      p_baseline_value: body.baseline_value ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update metric" }, { status: 500 });
  }
}
