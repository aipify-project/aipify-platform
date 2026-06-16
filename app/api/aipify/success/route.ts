import { NextResponse } from "next/server";
import { parseSuccessInitiativeItem, parseSuccessList } from "@/lib/app-portal/success-value";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_success_initiatives", {
      p_category: searchParams.get("category") || null,
      p_status: searchParams.get("status") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_sponsor_id: searchParams.get("sponsor_id") || null,
      p_value_level: searchParams.get("value_level") || null,
      p_review_from: searchParams.get("review_from") || null,
      p_review_to: searchParams.get("review_to") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseSuccessList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load success initiatives" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  category?: string;
  value_level?: string;
  expected_outcomes?: string;
  value_hypothesis?: string;
  measurement_method?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_success_initiative", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_category: body.category ?? "operational_value",
      p_value_level: body.value_level ?? "moderate_value",
      p_expected_outcomes: body.expected_outcomes ?? "",
      p_value_hypothesis: body.value_hypothesis ?? "",
      p_measurement_method: body.measurement_method ?? "",
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ created: true, initiative: parseSuccessInitiativeItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to create success initiative" }, { status: 500 });
  }
}
