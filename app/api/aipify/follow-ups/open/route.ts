import { NextResponse } from "next/server";
import { parseFollowUpList } from "@/lib/aipify/companion-follow-up";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("list_companion_follow_ups_open");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseFollowUpList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load open follow-ups" }, { status: 500 });
  }
}
