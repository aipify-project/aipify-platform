import { NextResponse } from "next/server";
import { parsePrioritizationItem, parsePrioritizationList } from "@/lib/app-portal/prioritization-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const alignmentMin = searchParams.get("alignment_min");
    const { data, error } = await supabase.rpc("list_app_portal_prioritization_items", {
      p_category: searchParams.get("category") || null,
      p_priority_status: searchParams.get("priority_status") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_sponsor_id: searchParams.get("sponsor_id") || null,
      p_alignment_min: alignmentMin ? Number(alignmentMin) : null,
      p_due_from: searchParams.get("due_from") || null,
      p_due_to: searchParams.get("due_to") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePrioritizationList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load prioritization items" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  category?: string;
  due_date?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_prioritization_item", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_category: body.category ?? "strategic_initiative",
      p_due_date: body.due_date ?? null,
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ created: true, item: parsePrioritizationItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to create prioritization item" }, { status: 500 });
  }
}
