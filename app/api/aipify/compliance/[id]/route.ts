import { NextResponse } from "next/server";
import { parseComplianceDetail, parsePolicyItem } from "@/lib/app-portal/compliance";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_compliance_policy", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseComplianceDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load policy" }, { status: 500 });
  }
}

type UpdateBody = {
  title?: string;
  description?: string;
  category?: string;
  owner_id?: string | null;
  status?: string;
  effective_date?: string;
  review_date?: string;
  review_frequency?: string;
  audience?: string;
  notes?: string;
  change_summary?: string;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_compliance_policy", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_category: body.category ?? null,
      p_owner_id: body.owner_id === null ? null : body.owner_id ?? null,
      p_status: body.status ?? null,
      p_effective_date: body.effective_date ?? null,
      p_review_date: body.review_date ?? null,
      p_review_frequency: body.review_frequency ?? null,
      p_audience: body.audience ?? null,
      p_notes: body.notes ?? null,
      p_change_summary: body.change_summary ?? null,
      p_clear_owner: body.owner_id === null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parsePolicyItem(data);
    return NextResponse.json({ updated: true, policy: item });
  } catch {
    return NextResponse.json({ error: "Failed to update policy" }, { status: 500 });
  }
}
