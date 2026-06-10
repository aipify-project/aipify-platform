import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { DESKTOP_CLIENT_PLATFORMS } from "@/lib/presence/notifications";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const platform = (body.platform as string) ?? "macos";
    const deviceName = typeof body.device_name === "string" ? body.device_name : null;

    if (!(DESKTOP_CLIENT_PLATFORMS as readonly string[]).includes(platform)) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("create_desktop_client_session", {
      p_platform: platform,
      p_device_name: deviceName,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to create desktop session" },
      { status: 500 }
    );
  }
}
