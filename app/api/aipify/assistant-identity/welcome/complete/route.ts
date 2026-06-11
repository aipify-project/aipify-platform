import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseWelcomeComplete } from "@/lib/aipify/assistant-identity";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    const { data, error } = await supabase.rpc("complete_assistant_welcome", { p_profile: body });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseWelcomeComplete(data));
  } catch {
    return NextResponse.json({ error: "Failed to complete welcome" }, { status: 500 });
  }
}
