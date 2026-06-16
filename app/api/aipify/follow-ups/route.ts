import { NextResponse } from "next/server";
import { parseFollowUpItem, parseFollowUpList } from "@/lib/app-portal/follow-ups";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_follow_ups", {
      p_category: searchParams.get("category") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_status: searchParams.get("status") || null,
      p_priority: searchParams.get("priority") || null,
      p_overdue_only: searchParams.get("overdue_only") === "true",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseFollowUpList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load follow-ups" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  category?: string;
  priority?: string;
  assigned_owner_id?: string;
  due_at?: string;
  related_module?: string;
  suggested_next_action?: string;
  notes?: string;
  is_suggestion?: boolean;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_follow_up", {
      p_title: body.title,
      p_category: body.category ?? "internal_follow_up",
      p_priority: body.priority ?? "medium",
      p_assigned_owner_id: body.assigned_owner_id ?? null,
      p_due_at: body.due_at ?? null,
      p_related_module: body.related_module ?? null,
      p_suggested_next_action: body.suggested_next_action ?? null,
      p_notes: body.notes ?? "",
      p_is_suggestion: body.is_suggestion ?? false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseFollowUpItem(data);
    return NextResponse.json({ created: true, follow_up: item });
  } catch {
    return NextResponse.json({ error: "Failed to create follow-up" }, { status: 500 });
  }
}
