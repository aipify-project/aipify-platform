import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      insight_id?: string;
      reason?: string;
      refresh_existing?: boolean;
    };

    if (body.action === "dismiss") {
      if (!body.insight_id) {
        return NextResponse.json({ error: "insight_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("dismiss_predictive_insight", {
        p_insight_id: body.insight_id,
        p_reason: body.reason ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("generate_predictive_insights", {
      p_refresh_existing: body.refresh_existing ?? false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process insight action" }, { status: 500 });
  }
}
