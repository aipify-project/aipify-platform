import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseMarketplaceInstalls } from "@/lib/aipify/marketplace";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("list_marketplace_installed");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ installs: parseMarketplaceInstalls(data) });
  } catch {
    return NextResponse.json({ error: "Failed to list installed items" }, { status: 500 });
  }
}
