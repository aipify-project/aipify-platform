import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCompanionMarketplaceCard } from "@/lib/aipify/companion-marketplace";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_companion_marketplace_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCompanionMarketplaceCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load companion marketplace card" }, { status: 500 });
  }
}
