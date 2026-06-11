import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseInnovationLabActionResult } from "@/lib/aipify/innovation-lab";

type RouteContext = { params: Promise<{ experimentId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { experimentId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("advance_innovation_experiment", {
      p_experiment_id: experimentId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseInnovationLabActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to advance experiment" }, { status: 500 });
  }
}
