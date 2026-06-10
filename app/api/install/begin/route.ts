import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { INSTALL_PLATFORM_OPTIONS } from "@/lib/install/experience";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const platform = body.platform as string | undefined;
    const name = typeof body.name === "string" ? body.name : null;

    if (
      !platform ||
      !(INSTALL_PLATFORM_OPTIONS as readonly string[]).includes(platform)
    ) {
      return NextResponse.json({ error: "Invalid platform" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("begin_modern_install", {
      p_platform: platform,
      p_name: name,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to begin installation" },
      { status: 500 }
    );
  }
}
