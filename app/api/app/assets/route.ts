import { NextResponse } from "next/server";
import { getAssetManagementCenter, parseAssetManagementCenter } from "@/lib/asset-management";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getAssetManagementCenter(supabase, {
      category: url.searchParams.get("category") ?? undefined,
      assetType: url.searchParams.get("asset_type") ?? undefined,
    });
    return NextResponse.json(parseAssetManagementCenter(data) ?? { found: false });
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed to load assets" }, { status: 500 });
  }
}
