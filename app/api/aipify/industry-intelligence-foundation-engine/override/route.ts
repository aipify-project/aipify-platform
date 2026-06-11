import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { insight_id?: string; override_recommendation?: string };
    if (!body.insight_id) return NextResponse.json({ error: "insight_id required" }, { status: 400 });
    if (!body.override_recommendation) return NextResponse.json({ error: "override_recommendation required" }, { status: 400 });

    const { data, error } = await supabase.rpc("override_industry_insight", {
      p_insight_id: body.insight_id,
      p_override_recommendation: body.override_recommendation,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to override insight" }, { status: 500 });
  }
}
