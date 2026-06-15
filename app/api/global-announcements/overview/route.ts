import { NextRequest, NextResponse } from "next/server";
import { parseGlobalAnnouncementCenter } from "@/lib/global-announcements";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = request.nextUrl.searchParams;
    const filters = {
      category: params.get("category") ?? undefined,
      audience: params.get("audience") ?? undefined,
      status: params.get("status") ?? undefined,
      country: params.get("country") ?? undefined,
      language: params.get("language") ?? undefined,
      plan: params.get("plan") ?? undefined,
    };

    const { data, error } = await supabase.rpc("get_global_announcement_center", {
      p_filters: filters,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseGlobalAnnouncementCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to load global announcement center" },
      { status: 500 }
    );
  }
}
