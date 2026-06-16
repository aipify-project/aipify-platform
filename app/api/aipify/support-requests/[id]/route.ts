import { NextResponse } from "next/server";
import { parseSupportRequestDetail, parseSupportRequestItem } from "@/lib/app-portal/support-requests";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_support_request", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const parsed = parseSupportRequestDetail(data);
    if (!parsed.found) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load support request" }, { status: 500 });
  }
}

type PatchBody = {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  status?: string;
  related_module?: string;
  internal_notes?: string;
};

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as PatchBody;
    const { data, error } = await supabase.rpc("update_app_portal_support_request", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_category: body.category ?? null,
      p_priority: body.priority ?? null,
      p_status: body.status ?? null,
      p_related_module: body.related_module ?? null,
      p_internal_notes: body.internal_notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseSupportRequestItem(data);
    return NextResponse.json({ updated: true, request: item });
  } catch {
    return NextResponse.json({ error: "Failed to update support request" }, { status: 500 });
  }
}
