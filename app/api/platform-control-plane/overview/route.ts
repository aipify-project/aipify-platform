import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePlatformControlPlaneOverview } from "@/lib/platform-control-plane";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_platform_control_plane_overview");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }

    return NextResponse.json({
      data: parsePlatformControlPlaneOverview(data),
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to load platform control-plane overview." },
      { status: 500 },
    );
  }
}
