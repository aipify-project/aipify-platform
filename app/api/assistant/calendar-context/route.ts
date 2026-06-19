import { NextResponse } from "next/server";
import { getCompanionCalendarContext } from "@/lib/calendar-management";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionCalendarContext(supabase);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load calendar context";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
