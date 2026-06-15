import { NextResponse } from "next/server";
import { getAipifyHostsMarketplaceCard } from "@/lib/core/aipify-hosts-marketplace";
import { parseAipifyHostsMarketplaceCard } from "@/lib/aipify/aipify-hosts-marketplace";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsMarketplaceCard(supabase);
    return NextResponse.json(parseAipifyHostsMarketplaceCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load hosts marketplace card" }, { status: 500 });
  }
}
