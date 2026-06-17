import { NextResponse } from "next/server";
import { parseDesktopCompanionProfile } from "@/lib/desktop-companion-foundation";
import { withDesktopToken } from "@/lib/desktop/token-route";

export async function GET(request: Request) {
  try {
    return await withDesktopToken(request, async (token, supabase) => {
      const { data, error } = await supabase.rpc("desktop_get_profile", { p_token: token });
      if (error) return NextResponse.json({ error: error.message }, { status: 401 });
      return NextResponse.json(parseDesktopCompanionProfile(data));
    });
  } catch {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}
