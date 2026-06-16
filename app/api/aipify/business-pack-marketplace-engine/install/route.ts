import { NextResponse } from "next/server";
import { getBusinessPackMarketplaceInstall } from "@/lib/core/business-pack-marketplace-engine";
import { parseBusinessPackMarketplaceInstall } from "@/lib/aipify/business-pack-marketplace-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const packKey = new URL(request.url).searchParams.get("packKey");
    if (!packKey) return NextResponse.json({ error: "packKey required" }, { status: 400 });

    const data = await getBusinessPackMarketplaceInstall(supabase, packKey);
    const parsed = parseBusinessPackMarketplaceInstall(data);
    return NextResponse.json(parsed ?? { found: false });
  } catch {
    return NextResponse.json({ error: "Failed to load install workflow" }, { status: 500 });
  }
}
