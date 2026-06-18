import { NextResponse } from "next/server";
import { parseOrganizationalEvolutionCenter } from "@/lib/aipify/organizational-evolution-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_organizational_evolution_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationalEvolutionCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load organizational evolution center" }, { status: 500 });
  }
}
