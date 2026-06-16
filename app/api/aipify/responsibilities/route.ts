import { NextResponse } from "next/server";
import { parseResponsibilityItem, parseResponsibilityList } from "@/lib/app-portal/responsibilities";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const hasBackup = searchParams.get("has_backup");
    const { data, error } = await supabase.rpc("list_app_portal_responsibilities", {
      p_area: searchParams.get("area") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_status: searchParams.get("status") || null,
      p_review_before: searchParams.get("review_before") || null,
      p_has_backup: hasBackup === "true" ? true : hasBackup === "false" ? false : null,
      p_related_module: searchParams.get("related_module") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseResponsibilityList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load responsibilities" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  area?: string;
  primary_owner_id?: string;
  backup_owner_id?: string;
  review_frequency?: string;
  notes?: string;
  related_module?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_responsibility", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_area: body.area ?? "operations",
      p_primary_owner_id: body.primary_owner_id ?? null,
      p_backup_owner_id: body.backup_owner_id ?? null,
      p_review_frequency: body.review_frequency ?? null,
      p_notes: body.notes ?? "",
      p_related_module: body.related_module ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseResponsibilityItem(data);
    return NextResponse.json({ created: true, responsibility: item });
  } catch {
    return NextResponse.json({ error: "Failed to create responsibility" }, { status: 500 });
  }
}
