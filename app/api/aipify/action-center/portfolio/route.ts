import { NextResponse } from "next/server";
import { parseStrategicInitiativePortfolio } from "@/lib/action-center-portfolio";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_action_center_strategic_initiative_portfolio");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseStrategicInitiativePortfolio(data));
  } catch {
    return NextResponse.json({ error: "Failed to load strategic initiative portfolio" }, { status: 500 });
  }
}
