import { NextResponse } from "next/server";
import { parseCompanionActionMarketplaceCenter } from "@/lib/companion-action-marketplace";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_action_marketplace_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCompanionActionMarketplaceCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Action Marketplace" }, { status: 500 });
  }
}
