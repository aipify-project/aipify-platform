import { NextResponse } from "next/server";
import { getCalendarManagementCenter, parseCalendarManagementCenter } from "@/lib/calendar-management";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCalendarManagementCenter(supabase);
    return NextResponse.json(parseCalendarManagementCenter(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load calendar";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
