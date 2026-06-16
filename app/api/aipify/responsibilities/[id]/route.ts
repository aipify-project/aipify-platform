import { NextResponse } from "next/server";
import { parseResponsibilityDetail, parseResponsibilityItem } from "@/lib/app-portal/responsibilities";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_responsibility", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const parsed = parseResponsibilityDetail(data);
    if (!parsed.found) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load responsibility" }, { status: 500 });
  }
}

type PatchBody = {
  title?: string;
  description?: string;
  area?: string;
  primary_owner_id?: string | null;
  backup_owner_id?: string | null;
  status?: string;
  last_reviewed_date?: string;
  review_frequency?: string;
  notes?: string;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as PatchBody;
    const { data, error } = await supabase.rpc("update_app_portal_responsibility", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_area: body.area ?? null,
      p_primary_owner_id: body.primary_owner_id === null ? null : body.primary_owner_id ?? null,
      p_backup_owner_id: body.backup_owner_id === null ? null : body.backup_owner_id ?? null,
      p_clear_primary_owner: body.primary_owner_id === null,
      p_clear_backup_owner: body.backup_owner_id === null,
      p_status: body.status ?? null,
      p_last_reviewed_date: body.last_reviewed_date ?? null,
      p_review_frequency: body.review_frequency ?? null,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseResponsibilityItem(data);
    return NextResponse.json({ updated: true, responsibility: item });
  } catch {
    return NextResponse.json({ error: "Failed to update responsibility" }, { status: 500 });
  }
}
