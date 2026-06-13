import { NextResponse } from "next/server";
import { parseAutomationControlCenter } from "@/lib/automation-control-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_automation_control_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAutomationControlCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Automation Control Center" }, { status: 500 });
  }
}
