import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { setting_key: string; setting_value: Record<string, unknown> };
    const { data, error } = await supabase.rpc("save_enterprise_setting", {
      p_setting_key: body.setting_key,
      p_setting_value: body.setting_value ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save enterprise setting" }, { status: 500 });
  }
}
