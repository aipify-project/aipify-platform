import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSimulationLabDashboard } from "@/lib/aipify/simulation-lab";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_simulation_lab_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSimulationLabDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load simulation lab dashboard" }, { status: 500 });
  }
}
