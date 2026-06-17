import { NextResponse } from "next/server";
import { parseICCOverview } from "@/lib/app-portal/intelligence-command-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_app_portal_intelligence_priorities", {
      p_priority_level: searchParams.get("priority_level") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const overview = parseICCOverview({ found: true, priorities: (data as { priorities?: unknown })?.priorities });
    return NextResponse.json({ priorities: overview.priorities ?? [] });
  } catch {
    return NextResponse.json({ error: "Failed to load priorities" }, { status: 500 });
  }
}
