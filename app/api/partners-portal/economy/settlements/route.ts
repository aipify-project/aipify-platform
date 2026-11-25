import { NextResponse } from "next/server";
import { parseEconomyActionResult } from "@/lib/partners-portal/economy-engine";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

export async function POST() {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;
    const { data, error } = await gate.access.supabase.rpc("create_growth_partner_economy_settlement");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseEconomyActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to create settlement" }, { status: 500 });
  }
}
