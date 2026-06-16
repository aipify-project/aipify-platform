import { NextResponse } from "next/server";
import { parsePlaybookItem, parsePlaybookList } from "@/lib/app-portal/playbooks";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const recentlyUpdated = searchParams.get("recently_updated");
    const { data, error } = await supabase.rpc("list_app_portal_playbooks", {
      p_category: searchParams.get("category") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_status: searchParams.get("status") || null,
      p_review_before: searchParams.get("review_before") || null,
      p_recently_updated: recentlyUpdated === "true" ? true : recentlyUpdated === "false" ? false : null,
      p_related_module: searchParams.get("related_module") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePlaybookList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load playbooks" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  category?: string;
  owner_id?: string;
  review_frequency?: string;
  notes?: string;
  related_modules?: string[];
  related_knowledge_articles?: string[];
  steps?: Array<{
    title?: string;
    description?: string;
    responsible_role?: string;
    requires_approval?: boolean;
    related_resources?: string[];
    checklist_items?: string[];
  }>;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_playbook", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_category: body.category ?? "custom",
      p_owner_id: body.owner_id ?? null,
      p_review_frequency: body.review_frequency ?? null,
      p_notes: body.notes ?? "",
      p_related_modules: body.related_modules ?? [],
      p_related_knowledge_articles: body.related_knowledge_articles ?? [],
      p_steps: body.steps ?? [],
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parsePlaybookItem(data);
    return NextResponse.json({ created: true, playbook: item });
  } catch {
    return NextResponse.json({ error: "Failed to create playbook" }, { status: 500 });
  }
}
