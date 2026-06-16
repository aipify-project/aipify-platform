import { NextResponse } from "next/server";
import { parseMomentumBottlenecks } from "@/lib/app-portal/momentum";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_app_portal_momentum_bottlenecks", {
      p_team: searchParams.get("team") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ found: true, bottlenecks: parseMomentumBottlenecks(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load bottlenecks" }, { status: 500 });
  }
}
