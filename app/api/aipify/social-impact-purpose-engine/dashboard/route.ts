import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSocialImpactPurposeDashboard } from "@/lib/aipify/social-impact-purpose-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_social_impact_purpose_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSocialImpactPurposeDashboard(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to load social impact purpose dashboard" },
      { status: 500 },
    );
  }
}
