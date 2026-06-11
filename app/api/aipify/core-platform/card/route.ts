import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseAipifyCorePlatformCard } from "@/lib/aipify/core-platform";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_aipify_core_platform_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAipifyCorePlatformCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load core platform card" }, { status: 500 });
  }
}
