import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      intervention_id?: string;
      category?: string;
      capture_memory?: boolean;
    };

    if (body.action === "generate_recommendations") {
      const { data, error } = await supabase.rpc("generate_health_recommendations", {
        p_category: body.category ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.intervention_id) {
      return NextResponse.json({ error: "intervention_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("approve_health_intervention", {
      p_intervention_id: body.intervention_id,
      p_capture_memory: body.capture_memory ?? false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process review action" }, { status: 500 });
  }
}
