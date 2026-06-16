import { NextResponse } from "next/server";
import { parseMeetingItem, parseMeetingList } from "@/lib/app-portal/meetings";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_meetings", {
      p_meeting_type: searchParams.get("meeting_type") || null,
      p_organizer_id: searchParams.get("organizer_id") || null,
      p_status: searchParams.get("status") || null,
      p_date_from: searchParams.get("date_from") || null,
      p_date_to: searchParams.get("date_to") || null,
      p_participant_id: searchParams.get("participant_id") || null,
      p_outstanding_actions: searchParams.get("outstanding_actions") === "true" ? true : null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseMeetingList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load meetings" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  meeting_type?: string;
  meeting_at?: string;
  duration_minutes?: number;
  objectives?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_meeting", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_meeting_type: body.meeting_type ?? "team_meeting",
      p_meeting_at: body.meeting_at ?? null,
      p_duration_minutes: body.duration_minutes ?? 60,
      p_objectives: body.objectives ?? "",
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseMeetingItem(data);
    return NextResponse.json({ created: true, meeting: item });
  } catch {
    return NextResponse.json({ error: "Failed to create meeting" }, { status: 500 });
  }
}
