import { NextRequest, NextResponse } from "next/server";
import { parsePlatformPlaybookDesigner } from "@/lib/platform-playbook-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = request.nextUrl.searchParams;
    const playbookId = params.get("playbook_id");
    const surface = params.get("surface") ?? "platform";

    const { data, error } = await supabase.rpc("get_platform_playbook_designer", {
      p_playbook_id: playbookId || null,
      p_surface: surface,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parsePlatformPlaybookDesigner(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load playbook designer" }, { status: 500 });
  }
}
