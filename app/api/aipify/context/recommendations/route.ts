import { NextResponse } from "next/server";
import { parseCompanionContextRecommendations } from "@/lib/aipify/companion-context-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_companion_context_recommendations", {
      p_department: searchParams.get("department") || null,
      p_priority:   searchParams.get("priority")   || null,
      p_search:     searchParams.get("search")     || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCompanionContextRecommendations(data));
  } catch {
    return NextResponse.json({ error: "Failed to load context recommendations" }, { status: 500 });
  }
}
