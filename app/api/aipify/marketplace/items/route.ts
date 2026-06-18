import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseMarketplaceItems } from "@/lib/aipify/marketplace/parse";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_marketplace_items", {
      p_item_type: searchParams.get("item_type"),
      p_category: searchParams.get("category"),
      p_industry: searchParams.get("industry"),
      p_risk_level: searchParams.get("risk_level"),
      p_limit: Number(searchParams.get("limit") ?? 50),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ items: parseMarketplaceItems(data) });
  } catch {
    return NextResponse.json({ error: "Failed to list items" }, { status: 500 });
  }
}
