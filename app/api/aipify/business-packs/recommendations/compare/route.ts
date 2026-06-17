import { NextResponse } from "next/server";
import { parsePackComparison } from "@/lib/app-portal/business-pack-recommendations";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { pack_keys?: string[] };
    if (!body.pack_keys?.length) return NextResponse.json({ error: "pack_keys required" }, { status: 400 });

    const { data, error } = await supabase.rpc("compare_app_portal_business_pack_recommendations", {
      p_pack_keys: body.pack_keys,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json({ comparison: parsePackComparison(data) });
  } catch {
    return NextResponse.json({ error: "Failed to compare recommendations" }, { status: 500 });
  }
}
