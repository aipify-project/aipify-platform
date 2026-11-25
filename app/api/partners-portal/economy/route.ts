import { NextResponse } from "next/server";
import { parseEconomyOverview } from "@/lib/partners-portal/economy-engine";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

export async function GET() {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;
    const { data, error } = await gate.access.supabase.rpc("get_growth_partner_economy_overview");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseEconomyOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load settlement portal" }, { status: 500 });
  }
}
