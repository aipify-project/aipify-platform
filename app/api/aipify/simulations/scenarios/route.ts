import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      title?: string;
      category?: string;
      description?: string;
      current_state?: Record<string, unknown>;
      proposed_change?: Record<string, unknown>;
      constraints?: Record<string, unknown>;
      objectives?: string[];
    };
    if (!body.title || !body.category) {
      return NextResponse.json({ error: "title and category required" }, { status: 400 });
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("create_simulation_scenario", {
      p_title: body.title,
      p_category: body.category,
      p_description: body.description ?? null,
      p_current_state: body.current_state ?? {},
      p_proposed_change: body.proposed_change ?? {},
      p_constraints: body.constraints ?? {},
      p_objectives: body.objectives ?? [],
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create scenario" }, { status: 500 });
  }
}
