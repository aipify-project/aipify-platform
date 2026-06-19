import { NextResponse } from "next/server";
import { performCalendarManagementAction } from "@/lib/calendar-management";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { action_type?: string; payload?: Record<string, unknown> };
    const data = await performCalendarManagementAction(supabase, body.action_type ?? "", body.payload ?? {});
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Calendar action failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
