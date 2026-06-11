import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const purpose = searchParams.get("purpose");

    const { data, error } = await supabase.rpc("get_calendar_events", {
      p_from: from ? new Date(from).toISOString() : null,
      p_to: to ? new Date(to).toISOString() : null,
      p_calendar_purpose: purpose ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Calendar events request failed" }, { status: 500 });
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
      title?: string;
      description?: string;
      event_type?: string;
      calendar_purpose?: string;
      starts_at?: string;
      ends_at?: string;
      all_day?: boolean;
      recurrence_rule?: string;
      connection_id?: string;
      reminder_offsets?: unknown[];
      linked_memory_id?: string;
    };

    if (!body.title?.trim()) {
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_calendar_event", {
      p_title: body.title.trim(),
      p_description: body.description ?? "",
      p_event_type: body.event_type ?? "appointment",
      p_calendar_purpose: body.calendar_purpose ?? "personal",
      p_starts_at: body.starts_at ?? null,
      p_ends_at: body.ends_at ?? null,
      p_all_day: body.all_day ?? false,
      p_recurrence_rule: body.recurrence_rule ?? null,
      p_connection_id: body.connection_id ?? null,
      p_reminder_offsets: body.reminder_offsets ?? [],
      p_linked_memory_id: body.linked_memory_id ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data, created: true });
  } catch {
    return NextResponse.json({ error: "Calendar event creation failed" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      event_id?: string;
      title?: string;
      description?: string;
      starts_at?: string;
      ends_at?: string;
      status?: string;
      calendar_purpose?: string;
    };

    if (!body.event_id) {
      return NextResponse.json({ error: "event_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("update_calendar_event", {
      p_event_id: body.event_id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_starts_at: body.starts_at ?? null,
      p_ends_at: body.ends_at ?? null,
      p_status: body.status ?? null,
      p_calendar_purpose: body.calendar_purpose ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Calendar event update failed" }, { status: 500 });
  }
}
