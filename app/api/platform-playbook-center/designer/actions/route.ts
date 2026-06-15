import { NextResponse } from "next/server";
import { parsePlatformPlaybookDesigner } from "@/lib/platform-playbook-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await request.json();
    const { data, error } = await supabase.rpc("record_platform_playbook_designer_action", {
      p_payload: payload,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parsePlatformPlaybookDesigner(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Designer action failed" }, { status: 500 });
  }
}
