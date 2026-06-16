import { NextResponse } from "next/server";
import { parseBoardInvestorIntelligenceCenter } from "@/lib/board-investor-intelligence";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_executive_board_investor_intelligence_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseBoardInvestorIntelligenceCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load board intelligence" }, { status: 500 });
  }
}
