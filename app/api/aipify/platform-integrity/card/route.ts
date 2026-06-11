import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePlatformIntegrityCard } from "@/lib/aipify/platform-integrity";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_platform_integrity_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePlatformIntegrityCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load integrity card" }, { status: 500 });
  }
}
