import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseIncidentModeResult } from "@/lib/aipify/continuity";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      incident_level?: number;
      category?: string;
      summary?: string;
      description?: string;
    };
    if (!body.summary || !body.category || !body.incident_level) {
      return NextResponse.json({ error: "incident_level, category, and summary required" }, { status: 400 });
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("activate_continuity_incident_mode", {
      p_incident_level: body.incident_level,
      p_category: body.category,
      p_summary: body.summary,
      p_description: body.description ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseIncidentModeResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to activate incident mode" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("deactivate_continuity_incident_mode");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseIncidentModeResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to deactivate incident mode" }, { status: 500 });
  }
}
