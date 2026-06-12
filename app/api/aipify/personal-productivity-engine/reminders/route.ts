import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      reminder_id?: string;
      title?: string;
      remind_at?: string;
      channel?: string;
      metadata?: Record<string, unknown>;
    };

    if (body.action === "dismiss") {
      if (!body.reminder_id) {
        return NextResponse.json({ error: "reminder_id required" }, { status: 400 });
      }
      const { data, error } = await supabase.rpc("dismiss_productivity_reminder", {
        p_reminder_id: body.reminder_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "sync_calendar") {
      const { data, error } = await supabase.rpc("calendar_sync_hook", {
        p_provider: "aipify_internal",
        p_metadata: body.metadata ?? {},
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (!body.title) {
      return NextResponse.json({ error: "title required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_productivity_reminder", {
      p_title: body.title,
      p_remind_at: body.remind_at ?? null,
      p_channel: body.channel ?? "in_app",
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process reminder action" }, { status: 500 });
  }
}
