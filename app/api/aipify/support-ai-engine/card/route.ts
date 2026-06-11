import { NextResponse } from "next/server";
import { parseSupportAiEngineCard } from "@/lib/aipify/support-ai-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_support_ai_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSupportAiEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load support AI card" }, { status: 500 });
  }
}
