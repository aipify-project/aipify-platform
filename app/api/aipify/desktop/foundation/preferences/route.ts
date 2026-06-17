import { NextRequest, NextResponse } from "next/server";
import { parseDesktopCompanionProfile } from "@/lib/desktop-companion-foundation";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_desktop_companion_profile");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDesktopCompanionProfile(data));
  } catch {
    return NextResponse.json({ error: "Failed to load profile" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const patch = await request.json().catch(() => ({}));
    const { data, error } = await supabase.rpc("update_desktop_companion_preferences", {
      p_patch: patch,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDesktopCompanionProfile(data));
  } catch {
    return NextResponse.json({ error: "Failed to update preferences" }, { status: 500 });
  }
}
