import { NextResponse } from "next/server";
import { parseSecureAiActionDashboard } from "@/lib/aipify/secure-ai-action";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_secure_ai_action_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSecureAiActionDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load AI action dashboard" }, { status: 500 });
  }
}
