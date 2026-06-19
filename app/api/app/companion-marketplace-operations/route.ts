import { NextResponse } from "next/server";
import {
  getCompanionMarketplaceCenter,
  parseCompanionMarketplaceCenter,
} from "@/lib/customer-companion-marketplace-operations";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getCompanionMarketplaceCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseCompanionMarketplaceCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load Companion Marketplace" },
      { status: 500 }
    );
  }
}
