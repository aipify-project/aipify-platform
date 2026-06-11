import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      health_category?: string;
      categories?: string[];
      health_score?: number;
      reason?: string;
    };

    if (body.action === "override") {
      if (!body.health_category || body.health_score === undefined) {
        return NextResponse.json({ error: "health_category and health_score required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("override_health_score", {
        p_health_category: body.health_category,
        p_health_score: body.health_score,
        p_reason: body.reason ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "refresh" && body.health_category) {
      const { data, error } = await supabase.rpc("refresh_health_category", {
        p_health_category: body.health_category,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("measure_organizational_health", {
      p_categories: body.categories ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to measure health" }, { status: 500 });
  }
}
