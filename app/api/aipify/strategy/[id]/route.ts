import { NextResponse } from "next/server";
import { parseStrategyDetail, parseStrategyInitiativeItem } from "@/lib/app-portal/strategy-execution";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_strategy_initiative", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseStrategyDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load strategy initiative" }, { status: 500 });
  }
}

type UpdateBody = {
  title?: string;
  description?: string;
  category?: string;
  status?: string;
  strategic_importance?: string;
  success_definition?: string;
  progress_percent?: number;
  target_date?: string;
  notes?: string;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_strategy_initiative", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_category: body.category ?? null,
      p_status: body.status ?? null,
      p_strategic_importance: body.strategic_importance ?? null,
      p_success_definition: body.success_definition ?? null,
      p_progress_percent: body.progress_percent ?? null,
      p_target_date: body.target_date ?? null,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ updated: true, initiative: parseStrategyInitiativeItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to update strategy initiative" }, { status: 500 });
  }
}
