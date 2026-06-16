import { NextResponse } from "next/server";
import { parseContinuityList, parseContinuityPlanItem } from "@/lib/app-portal/continuity";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_continuity_plans", {
      p_category: searchParams.get("category") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_status: searchParams.get("status") || null,
      p_criticality: searchParams.get("criticality") || null,
      p_review_before: searchParams.get("review_before") || null,
      p_exercise_before: searchParams.get("exercise_before") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseContinuityList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load continuity plans" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  category?: string;
  criticality_level?: string;
  review_frequency?: string;
  recovery_objectives?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_continuity_plan", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_category: body.category ?? "business_continuity",
      p_criticality_level: body.criticality_level ?? "moderate",
      p_review_frequency: body.review_frequency ?? "quarterly",
      p_recovery_objectives: body.recovery_objectives ?? "",
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ created: true, plan: parseContinuityPlanItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to create continuity plan" }, { status: 500 });
  }
}
