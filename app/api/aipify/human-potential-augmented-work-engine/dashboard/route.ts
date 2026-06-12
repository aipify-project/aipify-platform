import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseHumanPotentialDashboard } from "@/lib/aipify/human-potential-augmented-work-engine";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_human_potential_augmented_work_engine_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseHumanPotentialDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load human potential dashboard" }, { status: 500 });
  }
}
