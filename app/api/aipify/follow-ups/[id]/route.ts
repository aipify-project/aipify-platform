import { NextResponse } from "next/server";
import { parseFollowUpDetail, parseFollowUpItem } from "@/lib/app-portal/follow-ups";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_follow_up", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const parsed = parseFollowUpDetail(data);
    if (!parsed.found) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load follow-up" }, { status: 500 });
  }
}

type PatchBody = {
  status?: string;
  priority?: string;
  assigned_owner_id?: string;
  due_at?: string;
  notes?: string;
  suggested_next_action?: string;
  title?: string;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as PatchBody;
    const { data, error } = await supabase.rpc("update_app_portal_follow_up", {
      p_id: id,
      p_status: body.status ?? null,
      p_priority: body.priority ?? null,
      p_assigned_owner_id: body.assigned_owner_id ?? null,
      p_due_at: body.due_at ?? null,
      p_notes: body.notes ?? null,
      p_suggested_next_action: body.suggested_next_action ?? null,
      p_title: body.title ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseFollowUpItem(data);
    return NextResponse.json({ updated: true, follow_up: item });
  } catch {
    return NextResponse.json({ error: "Failed to update follow-up" }, { status: 500 });
  }
}
