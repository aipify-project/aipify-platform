import { NextResponse } from "next/server";
import { getCompanionAssetContext } from "@/lib/asset-management";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const data = await getCompanionAssetContext(supabase, url.searchParams.get("query") ?? undefined);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load asset context" },
      { status: 500 },
    );
  }
}
