import { NextResponse } from "next/server";
import { parseRelationshipReminders } from "@/lib/aipify/companion-relationship-intelligence/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("list_companion_relationship_reminders");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseRelationshipReminders(data));
  } catch {
    return NextResponse.json({ error: "Failed to load reminders" }, { status: 500 });
  }
}
