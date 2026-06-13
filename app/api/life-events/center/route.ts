import { NextResponse } from "next/server";
import { parseLifeEventsCenter } from "@/lib/life-events";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_life_events_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseLifeEventsCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Life Events center" }, { status: 500 });
  }
}
