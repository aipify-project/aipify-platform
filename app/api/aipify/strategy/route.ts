import { NextResponse } from "next/server";
import { parseStrategyInitiativeItem, parseStrategyList } from "@/lib/app-portal/strategy-execution";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_strategy_initiatives", {
      p_category: searchParams.get("category") || null,
      p_status: searchParams.get("status") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_sponsor_id: searchParams.get("sponsor_id") || null,
      p_importance: searchParams.get("importance") || null,
      p_target_from: searchParams.get("target_from") || null,
      p_target_to: searchParams.get("target_to") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseStrategyList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load strategy initiatives" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  category?: string;
  strategic_importance?: string;
  success_definition?: string;
  target_date?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_strategy_initiative", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_category: body.category ?? "growth_strategy",
      p_strategic_importance: body.strategic_importance ?? "important",
      p_success_definition: body.success_definition ?? "",
      p_target_date: body.target_date ?? null,
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ created: true, initiative: parseStrategyInitiativeItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to create strategy initiative" }, { status: 500 });
  }
}
