import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseValueEvents } from "@/lib/aipify/value-engine";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? 50);
    const { data, error } = await supabase.rpc("list_value_events", { p_limit: limit });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ events: parseValueEvents(data) });
  } catch {
    return NextResponse.json({ error: "Failed to list value events" }, { status: 500 });
  }
}
