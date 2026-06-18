import { NextResponse } from "next/server";
import { parseFollowUpWaiting } from "@/lib/aipify/companion-follow-up/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const direction = new URL(request.url).searchParams.get("direction");
    const { data, error } = await supabase.rpc("list_companion_follow_ups_waiting", {
      p_direction: direction || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseFollowUpWaiting(data));
  } catch {
    return NextResponse.json({ error: "Failed to load waiting follow-ups" }, { status: 500 });
  }
}
