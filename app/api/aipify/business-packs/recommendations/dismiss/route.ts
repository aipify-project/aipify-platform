import { NextResponse } from "next/server";
import { parsePackRecommendationOverview } from "@/lib/app-portal/business-pack-recommendations";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { pack_key?: string };
    if (!body.pack_key) return NextResponse.json({ error: "pack_key required" }, { status: 400 });

    const { data, error } = await supabase.rpc("dismiss_app_portal_business_pack_recommendation", {
      p_pack_key: body.pack_key,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePackRecommendationOverview(data));
  } catch {
    return NextResponse.json({ error: "Failed to dismiss recommendation" }, { status: 500 });
  }
}
