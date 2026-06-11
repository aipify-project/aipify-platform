import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseMarketplaceInstallResult } from "@/lib/aipify/marketplace";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json().catch(() => ({}));
    const { data, error } = await supabase.rpc("install_marketplace_item", {
      p_item_key: id,
      p_approve: Boolean((body as { approve?: boolean }).approve),
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseMarketplaceInstallResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to install item" }, { status: 500 });
  }
}
