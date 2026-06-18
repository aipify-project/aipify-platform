import { NextResponse } from "next/server";
import { parseValueImprovementSuggestions } from "@/lib/aipify/value-realization-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("suggest_value_improvements");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseValueImprovementSuggestions(data));
  } catch {
    return NextResponse.json({ error: "Failed to load suggestions" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      milestone_id?: string;
      current_value?: number;
      status?: string;
    };

    if (body.action === "milestone") {
      if (!body.milestone_id) {
        return NextResponse.json({ error: "milestone_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("record_value_milestone", {
        p_milestone_id: body.milestone_id,
        p_current_value: body.current_value ?? null,
        p_status: body.status ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "suggest") {
      const { data, error } = await supabase.rpc("suggest_value_improvements");
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(parseValueImprovementSuggestions(data));
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process review action" }, { status: 500 });
  }
}
