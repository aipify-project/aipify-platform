import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseDropshippingBriefingResult } from "@/lib/aipify/dropshipping-operations/parse";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("generate_dropshipping_operations_briefing");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDropshippingBriefingResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to generate operations briefing" }, { status: 500 });
  }
}
