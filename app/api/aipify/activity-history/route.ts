import { NextResponse } from "next/server";
import { parseActivityHistory } from "@/lib/app-portal/activity-history";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_activity_history", {
      p_event_type: searchParams.get("event_type") || null,
      p_module: searchParams.get("module") || null,
      p_user_id: searchParams.get("user_id") || null,
      p_severity: searchParams.get("severity") || null,
      p_date_from: searchParams.get("date_from") || null,
      p_date_to: searchParams.get("date_to") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseActivityHistory(data));
  } catch {
    return NextResponse.json({ error: "Failed to load activity history" }, { status: 500 });
  }
}
