import { NextResponse } from "next/server";
import { parseFollowUpDashboard } from "@/lib/aipify/companion-follow-up";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_companion_follow_up_dashboard", {
      p_status:     searchParams.get("status")     || null,
      p_priority:   searchParams.get("priority")   || null,
      p_owner:      searchParams.get("owner")      || null,
      p_department: searchParams.get("department") || null,
      p_category:   searchParams.get("category")   || null,
      p_due_from:   searchParams.get("due_from")   || null,
      p_due_to:     searchParams.get("due_to")     || null,
      p_search:     searchParams.get("search")     || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseFollowUpDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load follow-ups" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      title?: string;
      description?: string;
      explanation?: string;
      category?: string;
      source_type?: string;
      priority?: string;
      assigned_to?: string;
      due_date?: string;
      recommended_action?: string;
      department?: string;
    };

    const { data, error } = await supabase.rpc("create_companion_follow_up", {
      p_title:              body.title ?? "",
      p_description:        body.description ?? "",
      p_explanation:        body.explanation ?? "",
      p_category:           body.category ?? "personal_tasks",
      p_source_type:        body.source_type ?? "tasks",
      p_priority:           body.priority ?? "medium",
      p_assigned_to:        body.assigned_to ?? "",
      p_due_date:           body.due_date ?? null,
      p_recommended_action: body.recommended_action ?? "review_today",
      p_department:         body.department ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create follow-up" }, { status: 500 });
  }
}
