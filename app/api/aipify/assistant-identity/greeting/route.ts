import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseAssistantGreeting } from "@/lib/aipify/assistant-identity";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_assistant_greeting", {
      p_context: searchParams.get("context") ?? "daily_greeting",
      p_language: searchParams.get("language"),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAssistantGreeting(data));
  } catch {
    return NextResponse.json({ error: "Failed to load greeting" }, { status: 500 });
  }
}
