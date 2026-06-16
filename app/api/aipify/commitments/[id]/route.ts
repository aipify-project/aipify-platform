import { NextResponse } from "next/server";
import { parseCommitmentDetail, parseCommitmentItem } from "@/lib/app-portal/commitment-tracking";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_commitment", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCommitmentDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load commitment" }, { status: 500 });
  }
}

type UpdateBody = {
  title?: string;
  description?: string;
  commitment_type?: string;
  status?: string;
  priority?: string;
  recipient?: string;
  fulfillment_criteria?: string;
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
    const { data, error } = await supabase.rpc("update_app_portal_commitment", {
      p_id: id,
      p_title: body.title ?? null,
      p_description: body.description ?? null,
      p_commitment_type: body.commitment_type ?? null,
      p_status: body.status ?? null,
      p_priority: body.priority ?? null,
      p_recipient: body.recipient ?? null,
      p_fulfillment_criteria: body.fulfillment_criteria ?? null,
      p_due_date: body.due_date ?? null,
      p_notes: body.notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ updated: true, commitment: parseCommitmentItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to update commitment" }, { status: 500 });
  }
}
