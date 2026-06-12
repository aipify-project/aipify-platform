import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSocialCohesionCard } from "@/lib/aipify/social-cohesion-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_social_cohesion_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSocialCohesionCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Social Cohesion card" }, { status: 500 });
  }
}
