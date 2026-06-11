import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseDesktopNotifications } from "@/lib/aipify/desktop";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limit = Number(request.nextUrl.searchParams.get("limit") ?? 20);
    const status = request.nextUrl.searchParams.get("status");

    const { data, error } = await supabase.rpc("get_desktop_notifications", {
      p_limit: limit,
      p_status: status,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDesktopNotifications(data));
  } catch {
    return NextResponse.json({ error: "Failed to load notifications" }, { status: 500 });
  }
}
