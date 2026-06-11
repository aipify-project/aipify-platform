import { NextResponse } from "next/server";
import { parseSelfSupportEngineCard } from "@/lib/aipify/self-support-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_self_support_engine_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseSelfSupportEngineCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load self-support card" }, { status: 500 });
  }
}
