import { NextResponse } from "next/server";
import { parseStatusTransparencyEngineDashboard } from "@/lib/aipify/status-transparency-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_status_transparency_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseStatusTransparencyEngineDashboard(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to load status transparency dashboard" },
      { status: 500 }
    );
  }
}
