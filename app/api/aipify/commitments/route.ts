import { NextResponse } from "next/server";
import { parseCommitmentItem, parseCommitmentList } from "@/lib/app-portal/commitment-tracking";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_commitments", {
      p_commitment_type: searchParams.get("commitment_type") || null,
      p_status: searchParams.get("status") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_recipient: searchParams.get("recipient") || null,
      p_priority: searchParams.get("priority") || null,
      p_due_from: searchParams.get("due_from") || null,
      p_due_to: searchParams.get("due_to") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCommitmentList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load commitments" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  commitment_type?: string;
  recipient?: string;
  priority?: string;
  due_date?: string;
  fulfillment_criteria?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_commitment", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_commitment_type: body.commitment_type ?? "operational_commitment",
      p_recipient: body.recipient ?? "",
      p_priority: body.priority ?? "medium",
      p_due_date: body.due_date ?? null,
      p_fulfillment_criteria: body.fulfillment_criteria ?? "",
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ created: true, commitment: parseCommitmentItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to create commitment" }, { status: 500 });
  }
}
