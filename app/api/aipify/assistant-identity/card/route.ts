import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseAssistantIdentityCard } from "@/lib/aipify/assistant-identity";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_assistant_identity_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAssistantIdentityCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load assistant identity card" }, { status: 500 });
  }
}
