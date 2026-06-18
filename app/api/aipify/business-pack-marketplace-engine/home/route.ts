import { NextResponse } from "next/server";
import { getBusinessPackMarketplaceHome } from "@/lib/core/business-pack-marketplace-engine";
import { parseBusinessPackMarketplaceHome } from "@/lib/aipify/business-pack-marketplace-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const locale = new URL(request.url).searchParams.get("locale") ?? "en";
    const data = await getBusinessPackMarketplaceHome(supabase, locale);
    const parsed = parseBusinessPackMarketplaceHome(data);
    return NextResponse.json(parsed ?? { found: false });
  } catch {
    return NextResponse.json({ error: "Failed to load marketplace home" }, { status: 500 });
  }
}
