import { NextResponse } from "next/server";
import { parseComplianceList, parsePolicyItem } from "@/lib/app-portal/compliance";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const recentlyUpdated = searchParams.get("recently_updated");
    const { data, error } = await supabase.rpc("list_app_portal_compliance_policies", {
      p_category: searchParams.get("category") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_status: searchParams.get("status") || null,
      p_review_before: searchParams.get("review_before") || null,
      p_audience: searchParams.get("audience") || null,
      p_recently_updated: recentlyUpdated === "true" ? true : recentlyUpdated === "false" ? false : null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseComplianceList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load compliance policies" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  category?: string;
  owner_id?: string;
  status?: string;
  effective_date?: string;
  review_date?: string;
  review_frequency?: string;
  audience?: string;
  notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_compliance_policy", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_category: body.category ?? "custom",
      p_owner_id: body.owner_id ?? null,
      p_status: body.status ?? "draft",
      p_effective_date: body.effective_date ?? null,
      p_review_date: body.review_date ?? null,
      p_review_frequency: body.review_frequency ?? null,
      p_audience: body.audience ?? "all_organization_members",
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parsePolicyItem(data);
    return NextResponse.json({ created: true, policy: item });
  } catch {
    return NextResponse.json({ error: "Failed to create policy" }, { status: 500 });
  }
}
