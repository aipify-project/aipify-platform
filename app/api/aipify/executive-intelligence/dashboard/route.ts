import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseExecutiveIntelligenceDashboard } from "@/lib/aipify/executive-intelligence";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_executive_intelligence_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseExecutiveIntelligenceDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load executive intelligence dashboard" }, { status: 500 });
  }
}
