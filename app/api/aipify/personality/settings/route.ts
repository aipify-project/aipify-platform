import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePersonalitySettingsResult } from "@/lib/aipify/personality/parse";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("update_personality_settings", {
      p_settings: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePersonalitySettingsResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to update personality settings" }, { status: 500 });
  }
}
