import { NextResponse } from "next/server";
import { parseCommunicationItem, parseCommunicationList } from "@/lib/app-portal/communications";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_communications", {
      p_communication_type: searchParams.get("communication_type") || null,
      p_author_id: searchParams.get("author_id") || null,
      p_status: searchParams.get("status") || null,
      p_priority: searchParams.get("priority") || null,
      p_audience_type: searchParams.get("audience_type") || null,
      p_publish_from: searchParams.get("publish_from") || null,
      p_publish_to: searchParams.get("publish_to") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCommunicationList(data));
  } catch {
    return NextResponse.json({ error: "Failed to load communications" }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  summary?: string;
  full_message?: string;
  communication_type?: string;
  audience_type?: string;
  priority?: string;
  publish_date?: string;
  expiration_date?: string;
  requires_acknowledgement?: boolean;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_communication", {
      p_title: body.title,
      p_summary: body.summary ?? "",
      p_full_message: body.full_message ?? "",
      p_communication_type: body.communication_type ?? "company_announcement",
      p_audience_type: body.audience_type ?? "entire_organization",
      p_priority: body.priority ?? "informational",
      p_publish_date: body.publish_date ?? null,
      p_expiration_date: body.expiration_date ?? null,
      p_requires_acknowledgement: body.requires_acknowledgement ?? false,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseCommunicationItem(data);
    return NextResponse.json({ created: true, communication: item });
  } catch {
    return NextResponse.json({ error: "Failed to create communication" }, { status: 500 });
  }
}
