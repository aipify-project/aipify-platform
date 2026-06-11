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
      benchmark_category?: string;
      benchmark_source?: string;
      benchmark_period?: string;
      config?: Record<string, unknown>;
    };

    if (body.action === "update") {
      if (!body.profile_id) {
        return NextResponse.json({ error: "profile_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("update_benchmark_profile", {
        p_profile_id: body.profile_id,
        p_benchmark_source: body.benchmark_source ?? null,
        p_benchmark_period: body.benchmark_period ?? null,
        p_config: body.config ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.benchmark_category) {
      return NextResponse.json({ error: "benchmark_category required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_benchmark_profile", {
      p_benchmark_category: body.benchmark_category,
      p_benchmark_source: body.benchmark_source ?? "custom",
      p_benchmark_period: body.benchmark_period ?? "monthly",
      p_config: body.config ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process profile action" }, { status: 500 });
  }
}
