import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseMultiStoreOrchestrationCard } from "@/lib/aipify/multi-store-orchestration";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_multi_store_orchestration_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseMultiStoreOrchestrationCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load portfolio card" }, { status: 500 });
  }
}
