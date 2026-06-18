import { createClient } from "@/lib/supabase/server";
import { parseImprovementSuggestions } from "@/lib/aipify/continuous-improvement-engine/parse";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("suggest_improvement_initiatives");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ suggestions: parseImprovementSuggestions(data) });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as {
      action?: string;
      initiative_id?: string;
      status?: string;
      findings_summary?: string;
      initiative_title?: string;
      source?: string;
      priority?: string;
      description?: string;
    };

    if (body.action === "create") {
      const { data, error } = await supabase.rpc("create_improvement_initiative", {
        p_initiative_title: body.initiative_title ?? "Untitled initiative",
        p_source: body.source ?? "feedback",
        p_priority: body.priority ?? "medium",
        p_description: body.description ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }

    if (body.action === "review" && body.initiative_id && body.status) {
      const { data, error } = await supabase.rpc("review_improvement_initiative", {
        p_initiative_id: body.initiative_id,
        p_status: body.status,
        p_findings_summary: body.findings_summary ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
