import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const upcoming = new URL(request.url).searchParams.get("upcoming") !== "false";
    const { data, error } = await supabase.rpc("get_maintenance_windows", {
      p_upcoming_only: upcoming,
      p_limit: 10,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data ?? []);
  } catch {
    return NextResponse.json({ error: "Failed to load maintenance windows" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      title: string;
      description?: string;
      scheduled_start?: string;
      scheduled_end?: string;
      send_notification?: boolean;
    };

    const { data, error } = await supabase.rpc("schedule_maintenance_window", {
      p_title: body.title,
      p_description: body.description ?? null,
      p_scheduled_start: body.scheduled_start ?? null,
      p_scheduled_end: body.scheduled_end ?? null,
      p_send_notification: body.send_notification ?? true,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to schedule maintenance" }, { status: 500 });
  }
}
