import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseSimulationLabCard } from "@/lib/aipify/simulation-lab";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_simulation_lab_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSimulationLabCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load simulation lab card" }, { status: 500 });
  }
}
