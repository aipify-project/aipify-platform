import { NextResponse } from "next/server";
import { parseResilienceOverview } from "@/lib/app-portal/resilience";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_resilience", {
      p_category: searchParams.get("category") || null,
      p_status: searchParams.get("status") || null,
      p_owner: searchParams.get("owner") || null,
      p_trend: searchParams.get("trend") || null,
      p_priority: searchParams.get("priority") || null,
      p_period_from: searchParams.get("period_from") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseResilienceOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load resilience" }, { status: 500 });
  }
}

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("begin_app_portal_resilience_review");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseResilienceOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to start resilience review" }, { status: 500 });
  }
}
