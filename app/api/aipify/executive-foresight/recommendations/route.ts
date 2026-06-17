import { NextResponse } from "next/server";
import { parseExecutiveForesightOverview } from "@/lib/app-portal/executive-foresight";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_executive_foresight_recommendations");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const overview = parseExecutiveForesightOverview({ found: true, recommendations: (data as { recommendations?: unknown })?.recommendations });
    return NextResponse.json({ recommendations: overview.recommendations ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to load foresight recommendations" }, { status: 500 });
  }
}
