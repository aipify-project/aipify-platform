import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseActionHubCard } from "@/lib/aipify/action-hub";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_action_hub_card");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseActionHubCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load action hub card" }, { status: 500 });
  }
}
