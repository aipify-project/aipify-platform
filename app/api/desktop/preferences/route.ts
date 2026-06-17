import { NextResponse } from "next/server";
import { parseDesktopCompanionProfile } from "@/lib/desktop-companion-foundation";
import { withDesktopToken } from "@/lib/desktop/token-route";

export async function POST(request: Request) {
  try {
    return await withDesktopToken(request, async (token, supabase) => {
      const patch = await request.json().catch(() => ({}));
      const { data, error } = await supabase.rpc("desktop_update_preferences", {
        p_token: token,
        p_patch: patch,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(parseDesktopCompanionProfile(data));
    });
  } catch {
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
