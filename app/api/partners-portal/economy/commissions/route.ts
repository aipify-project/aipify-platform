import { NextResponse } from "next/server";
import { parseEconomyCommissions } from "@/lib/partners-portal/economy-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("list_growth_partner_economy_commissions");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ commissions: parseEconomyCommissions(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load commission history" }, { status: 500 });
  }
}
