import { NextResponse } from "next/server";
import { parseEconomySales } from "@/lib/partners-portal/economy-engine";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

export async function GET(request: Request) {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;
    const { searchParams } = new URL(request.url);
    const { data, error } = await gate.access.supabase.rpc("list_growth_partner_economy_sales", {
      p_status: searchParams.get("status") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ sales: parseEconomySales(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load sales history" }, { status: 500 });
  }
}
