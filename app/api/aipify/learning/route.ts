import { NextResponse } from "next/server";
import { parseLearningList, parseLearningRecordItem } from "@/lib/app-portal/learning-improvement";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const recentlyImplemented = searchParams.get("recently_implemented");
    const { data, error } = await supabase.rpc("list_app_portal_learning_records", {
      p_category: searchParams.get("category") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_status: searchParams.get("status") || null,
      p_impact_level: searchParams.get("impact_level") || null,
      p_identified_from: searchParams.get("identified_from") || null,
      p_identified_to: searchParams.get("identified_to") || null,
      p_recently_implemented: recentlyImplemented === null ? null : recentlyImplemented === "true",
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseLearningList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load learning records" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  category?: string;
  impact_level?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_learning_record", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_category: body.category ?? "operational_improvement",
      p_impact_level: body.impact_level ?? "moderate_improvement",
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ created: true, record: parseLearningRecordItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to create learning record" }, { status: 500 });
  }
}
