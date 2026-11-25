import { NextResponse } from "next/server";
import { parsePartnersPortalDashboard } from "@/lib/partners-portal";
import { requirePartnersPortalApiAccess } from "@/lib/partners-portal/server-access";

export async function GET() {
  try {
    const gate = await requirePartnersPortalApiAccess();
    if (!gate.ok) return gate.response;

    const { data, error } = await gate.access.supabase.rpc("get_growth_portal_dashboard");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const parsed = parsePartnersPortalDashboard(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load GROWTH dashboard" }, { status: 500 });
  }
}
