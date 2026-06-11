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
      metric_keys?: string[];
      comparison_id?: string;
      benchmark_value?: number;
      reason?: string;
    };

    if (body.action === "override") {
      if (!body.comparison_id || body.benchmark_value === undefined) {
        return NextResponse.json(
          { error: "comparison_id and benchmark_value required" },
          { status: 400 }
        );
      }
      const { data, error } = await supabase.rpc("override_benchmark", {
        p_comparison_id: body.comparison_id,
        p_benchmark_value: body.benchmark_value,
        p_reason: body.reason ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "recommendations") {
      const { data, error } = await supabase.rpc("generate_benchmark_recommendations", {
        p_profile_id: body.profile_id ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.profile_id) {
      return NextResponse.json({ error: "profile_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("generate_benchmark_comparison", {
      p_profile_id: body.profile_id,
      p_metric_keys: body.metric_keys ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process comparison action" }, { status: 500 });
  }
}
