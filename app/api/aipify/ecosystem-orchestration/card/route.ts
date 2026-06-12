import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseEcosystemOrchestrationCard } from "@/lib/aipify/ecosystem-orchestration";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_ecosystem_orchestration_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEcosystemOrchestrationCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load ecosystem orchestration card" }, { status: 500 });
  }
}
