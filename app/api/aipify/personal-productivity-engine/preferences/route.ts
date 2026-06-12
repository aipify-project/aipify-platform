import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      preferences?: Record<string, unknown>;
      quiet_hours?: Record<string, unknown>;
      reminder_settings?: Record<string, unknown>;
      capture_memory?: boolean;
    };

    const { data, error } = await supabase.rpc("upsert_personal_productivity_profile", {
      p_preferences: body.preferences ?? {},
      p_quiet_hours: body.quiet_hours ?? null,
      p_reminder_settings: body.reminder_settings ?? null,
      p_capture_memory: body.capture_memory ?? false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}
