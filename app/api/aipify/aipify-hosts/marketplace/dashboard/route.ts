import { NextResponse } from "next/server";
import { getAipifyHostsMarketplaceDashboard } from "@/lib/core/aipify-hosts-marketplace";
import { parseAipifyHostsMarketplaceDashboard } from "@/lib/aipify/aipify-hosts-marketplace";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const data = await getAipifyHostsMarketplaceDashboard(supabase, {
      category: searchParams.get("category") ?? undefined,
      query: searchParams.get("query") ?? undefined,
    });
    const parsed = parseAipifyHostsMarketplaceDashboard(data);
    if (!parsed) return NextResponse.json({ has_customer: false });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load hosts marketplace dashboard" }, { status: 500 });
  }
}
