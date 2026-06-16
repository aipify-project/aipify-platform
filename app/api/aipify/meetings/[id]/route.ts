import { NextResponse } from "next/server";
import { parseMeetingDetail, parseMeetingItem } from "@/lib/app-portal/meetings";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_meeting", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseMeetingDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load meeting" }, { status: 500 });
  }
}

type UpdateBody = {
  title?: string;
  description?: string;
  meeting_type?: string;
  status?: string;
  meeting_at?: string;
  duration_minutes?: number;
  objectives?: string;
  notes?: string;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_meeting", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_meeting_type: body.meeting_type ?? null,
      p_status: body.status ?? null,
      p_meeting_at: body.meeting_at ?? null,
      p_duration_minutes: body.duration_minutes ?? null,
      p_objectives: body.objectives ?? null,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseMeetingItem(data);
    return NextResponse.json({ updated: true, meeting: item });
  } catch {
    return NextResponse.json({ error: "Failed to update meeting" }, { status: 500 });
  }
}
