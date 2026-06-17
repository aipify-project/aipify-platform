import { NextResponse } from "next/server";
import { parseEconomyActionResult } from "@/lib/partners-portal/economy-engine";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("create_growth_partner_economy_settlement");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseEconomyActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to create settlement" }, { status: 500 });
  }
}
