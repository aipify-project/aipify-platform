import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePlatformInstallActionResult } from "@/lib/aipify/platform-install";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const installationId = body.installation_id as string;
    if (!installationId) {
      return NextResponse.json({ error: "installation_id is required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("run_install_health_check", {
      p_installation_id: installationId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePlatformInstallActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to run health check" }, { status: 500 });
  }
}
