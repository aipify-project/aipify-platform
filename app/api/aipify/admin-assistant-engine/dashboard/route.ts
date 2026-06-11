import { NextResponse } from "next/server";
import { parseAdminAssistantEngineDashboard } from "@/lib/aipify/admin-assistant-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_admin_assistant_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAdminAssistantEngineDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load admin assistant dashboard" }, { status: 500 });
  }
}
