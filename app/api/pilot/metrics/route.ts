import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      metric_key?: string;
      metric_value?: number;
      measurement_period?: string;
    };

    if (!body.metric_key || body.metric_value === undefined) {
      return NextResponse.json({ error: "metric_key and metric_value are required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_pilot_metric", {
      p_metric_key: body.metric_key,
      p_metric_value: body.metric_value,
      p_measurement_period: body.measurement_period ?? "30d",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to record pilot metric" }, { status: 500 });
  }
}
