import { NextResponse } from "next/server";
import { parsePrioritizationDetail, parsePrioritizationItem } from "@/lib/app-portal/prioritization-engine";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_prioritization_item", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePrioritizationDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load prioritization item" }, { status: 500 });
  }
}

type UpdateBody = {
  title?: string;
  description?: string;
  category?: string;
  priority_status?: string;
  dependencies?: string;
  capacity_considerations?: string;
  due_date?: string;
  notes?: string;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_prioritization_item", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_category: body.category ?? null,
      p_priority_status: body.priority_status ?? null,
      p_dependencies: body.dependencies ?? null,
      p_capacity_considerations: body.capacity_considerations ?? null,
      p_due_date: body.due_date ?? null,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ updated: true, item: parsePrioritizationItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to update prioritization item" }, { status: 500 });
  }
}
