import { NextResponse } from "next/server";
import { parseBusinessPackReview } from "@/lib/aipify/business-packs-foundation-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const packKey = new URL(request.url).searchParams.get("pack_key");
    if (!packKey) return NextResponse.json({ error: "pack_key required" }, { status: 400 });

    const { data, error } = await supabase.rpc("get_business_pack_review", { p_pack_key: packKey });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseBusinessPackReview(data));
  } catch {
    return NextResponse.json({ error: "Failed to load pack review" }, { status: 500 });
  }
}
