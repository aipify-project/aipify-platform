import { NextResponse } from "next/server";
import { parseStatusTransparencyEngineCard } from "@/lib/aipify/status-transparency-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_status_transparency_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseStatusTransparencyEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load status card" }, { status: 500 });
  }
}
