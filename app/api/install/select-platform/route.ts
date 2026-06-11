import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePlatformInstallActionResult } from "@/lib/aipify/platform-install";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const platform = body.platform as string;
    const otherPlatform = (body.other_platform as string) ?? null;

    if (!platform) return NextResponse.json({ error: "platform is required" }, { status: 400 });

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("select_install_platform", {
      p_platform: platform,
      p_other_platform: otherPlatform,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePlatformInstallActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to select platform" }, { status: 500 });
  }
}
