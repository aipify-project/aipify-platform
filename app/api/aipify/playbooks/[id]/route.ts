import { NextResponse } from "next/server";
import { parsePlaybookDetail, parsePlaybookItem } from "@/lib/app-portal/playbooks";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_playbook", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePlaybookDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load playbook" }, { status: 500 });
  }
}

type UpdateBody = {
  title?: string;
  description?: string;
  category?: string;
  owner_id?: string | null;
  status?: string;
  review_frequency?: string;
  last_reviewed_date?: string;
  notes?: string;
  change_summary?: string;
  related_modules?: string[];
  related_knowledge_articles?: string[];
  steps?: Array<{
    step_order?: number;
    title?: string;
    description?: string;
    responsible_role?: string;
    requires_approval?: boolean;
    related_resources?: string[];
    checklist_items?: string[];
  }>;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_playbook", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_category: body.category ?? null,
      p_owner_id: body.owner_id === null ? null : body.owner_id ?? null,
      p_status: body.status ?? null,
      p_review_frequency: body.review_frequency ?? null,
      p_last_reviewed_date: body.last_reviewed_date ?? null,
      p_notes: body.notes ?? null,
      p_related_modules: body.related_modules ?? null,
      p_related_knowledge_articles: body.related_knowledge_articles ?? null,
      p_steps: body.steps ?? null,
      p_change_summary: body.change_summary ?? null,
      p_clear_owner: body.owner_id === null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parsePlaybookItem(data);
    return NextResponse.json({ updated: true, playbook: item });
  } catch {
    return NextResponse.json({ error: "Failed to update playbook" }, { status: 500 });
  }
}
