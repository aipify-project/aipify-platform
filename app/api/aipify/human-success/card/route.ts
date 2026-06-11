import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseHumanSuccessCard } from "@/lib/aipify/human-success";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_human_success_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseHumanSuccessCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load human success card" }, { status: 500 });
  }
}
