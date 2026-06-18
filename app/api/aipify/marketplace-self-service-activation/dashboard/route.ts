import { NextResponse } from "next/server";
import { getMarketplaceSelfServiceDashboard } from "@/lib/core/marketplace-self-service-activation";
import { parseMarketplaceSelfServiceDashboard } from "@/lib/aipify/marketplace-self-service-activation/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const section = new URL(request.url).searchParams.get("section") ?? "discover";
    const data = await getMarketplaceSelfServiceDashboard(supabase, section);
    const parsed = parseMarketplaceSelfServiceDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load marketplace" }, { status: 500 });
  }
}
