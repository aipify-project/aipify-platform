import { NextResponse } from "next/server";
import { parseLearningDetail, parseLearningRecordItem } from "@/lib/app-portal/learning-improvement";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_learning_record", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseLearningDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load learning record" }, { status: 500 });
  }
}

type UpdateBody = {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  impact_level?: string;
  date_implemented?: string;
  notes?: string;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_learning_record", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_category: body.category ?? null,
      p_status: body.status ?? null,
      p_impact_level: body.impact_level ?? null,
      p_date_implemented: body.date_implemented ?? null,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ updated: true, record: parseLearningRecordItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to update learning record" }, { status: 500 });
  }
}
