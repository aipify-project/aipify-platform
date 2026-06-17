import { NextRequest, NextResponse } from "next/server";
import { parseDesktopCompanionSearch } from "@/lib/desktop-companion-foundation";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const query = request.nextUrl.searchParams.get("q") ?? "";
    const { data, error } = await supabase.rpc("search_desktop_companion", {
      p_query: query,
      p_limit: 20,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDesktopCompanionSearch(data));
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
