import { NextResponse } from "next/server";
import { toggleAipifyHostsMarketplaceFavorite } from "@/lib/core/aipify-hosts-marketplace";
import { parseToggleMarketplaceFavoriteResult } from "@/lib/aipify/aipify-hosts-marketplace";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { provider_id?: string };
    if (!body.provider_id) {
      return NextResponse.json({ error: "provider_id is required" }, { status: 400 });
    }

    const data = await toggleAipifyHostsMarketplaceFavorite(supabase, body.provider_id);
    return NextResponse.json(parseToggleMarketplaceFavoriteResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to update favorite" }, { status: 500 });
  }
}
