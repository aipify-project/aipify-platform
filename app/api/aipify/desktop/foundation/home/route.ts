import { NextResponse } from "next/server";
import { parseDesktopCompanionHome } from "@/lib/desktop-companion-foundation";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_desktop_companion_home");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDesktopCompanionHome(data));
  } catch {
    return NextResponse.json({ error: "Failed to load home" }, { status: 500 });
  }
}
