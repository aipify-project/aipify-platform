import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCivilizationalForesightDashboard } from "@/lib/aipify/civilizational-foresight-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_civilizational_foresight_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCivilizationalForesightDashboard(data));
  } catch {
    return NextResponse.json(
      { error: "Failed to load Civilizational Foresight dashboard" },
      { status: 500 },
    );
  }
}
