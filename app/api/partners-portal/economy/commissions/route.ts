import { NextResponse } from "next/server";
import { parseEconomyCommissions } from "@/lib/partners-portal/economy-engine";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

export async function GET() {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;
    const { data, error } = await gate.access.supabase.rpc("list_growth_partner_economy_commissions");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ commissions: parseEconomyCommissions(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load commission history" }, { status: 500 });
  }
}
