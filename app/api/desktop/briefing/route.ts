import { NextResponse } from "next/server";
import { parseDesktopCompanionBriefing } from "@/lib/desktop-companion-foundation";
import { withDesktopToken } from "@/lib/desktop/token-route";

export async function GET(request: Request) {
  try {
    return await withDesktopToken(request, async (token, supabase) => {
      const { data, error } = await supabase.rpc("desktop_get_briefing", { p_token: token });
      if (error) return NextResponse.json({ error: error.message }, { status: 401 });
      return NextResponse.json(parseDesktopCompanionBriefing(data));
    });
  } catch {
    return NextResponse.json({ error: "Failed to load briefing" }, { status: 500 });
  }
}
