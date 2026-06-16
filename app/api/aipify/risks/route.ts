import { NextResponse } from "next/server";
import { parseRiskItem, parseRiskList } from "@/lib/app-portal/risks";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const recentlyUpdated = searchParams.get("recently_updated");
    const { data, error } = await supabase.rpc("list_app_portal_risks", {
      p_category: searchParams.get("category") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_status: searchParams.get("status") || null,
      p_overall_level: searchParams.get("overall_level") || null,
      p_review_before: searchParams.get("review_before") || null,
      p_recently_updated: recentlyUpdated === "true" ? true : recentlyUpdated === "false" ? false : null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseRiskList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load risks" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  category?: string;
  owner_id?: string;
  likelihood?: string;
  impact?: string;
  mitigation_strategy?: string;
  contingency_plan?: string;
  review_frequency?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_risk", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_category: body.category ?? "operational",
      p_owner_id: body.owner_id ?? null,
      p_likelihood: body.likelihood ?? "moderate",
      p_impact: body.impact ?? "moderate",
      p_mitigation_strategy: body.mitigation_strategy ?? "",
      p_contingency_plan: body.contingency_plan ?? "",
      p_review_frequency: body.review_frequency ?? null,
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseRiskItem(data);
    return NextResponse.json({ created: true, risk: item });
  } catch {
    return NextResponse.json({ error: "Failed to create risk" }, { status: 500 });
  }
}
