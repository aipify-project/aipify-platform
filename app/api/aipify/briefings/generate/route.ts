import { NextResponse } from "next/server";
import { parseBriefingItemResponse } from "@/lib/app-portal/intelligence-briefings";
import { createClient } from "@/lib/supabase/server";

type GenerateBody = {
  briefing_type?: string;
  audience?: string;
  period_start?: string;
  period_end?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as GenerateBody;
    const { data, error } = await supabase.rpc("generate_app_portal_briefing", {
      p_briefing_type: body.briefing_type ?? "executive_briefing",
      p_audience: body.audience ?? "leadership",
      p_period_start: body.period_start ?? null,
      p_period_end: body.period_end ?? null,
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const briefing = parseBriefingItemResponse(data);
    return NextResponse.json({ generated: true, briefing });
  } catch {
    return NextResponse.json({ error: "Failed to generate briefing" }, { status: 500 });
  }
}
