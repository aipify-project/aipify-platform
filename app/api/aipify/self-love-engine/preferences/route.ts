import { NextResponse } from "next/server";
import { parseSelfLoveUserPreferences } from "@/lib/aipify/self-love-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_self_love_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const dashboard = data as Record<string, unknown>;
    return NextResponse.json(parseSelfLoveUserPreferences(dashboard.user_preferences));
  } catch {
    return NextResponse.json({ error: "Failed to load preferences" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("update_user_self_love_preferences", {
      p_payload: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSelfLoveUserPreferences(data));
  } catch {
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}
