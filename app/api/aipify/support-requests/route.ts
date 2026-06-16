import { NextResponse } from "next/server";
import { parseSupportRequestItem, parseSupportRequestList } from "@/lib/app-portal/support-requests";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_support_requests", {
      p_category: searchParams.get("category") || null,
      p_status: searchParams.get("status") || null,
      p_priority: searchParams.get("priority") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseSupportRequestList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load support requests" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  category?: string;
  priority?: string;
  related_module?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_support_request", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_category: body.category ?? "general",
      p_priority: body.priority ?? "medium",
      p_related_module: body.related_module ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseSupportRequestItem(data);
    return NextResponse.json({ created: true, request: item });
  } catch {
    return NextResponse.json({ error: "Failed to create support request" }, { status: 500 });
  }
}
