import { NextResponse } from "next/server";
import { parseModerationDashboard } from "@/lib/aipify/moderation";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get("tab") ?? "needs_review";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_aipify_moderation_dashboard", { p_tab: tab });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json(parseModerationDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load moderation dashboard" }, { status: 500 });
  }
}
