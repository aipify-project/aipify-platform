import { NextResponse } from "next/server";
import { parseCommunicationDetail, parseCommunicationItem } from "@/lib/app-portal/communications";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_app_portal_communication", { p_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseCommunicationDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load communication" }, { status: 500 });
  }
}

type UpdateBody = {
  title?: string;
  summary?: string;
  full_message?: string;
  communication_type?: string;
  audience_type?: string;
  audience_target_ids?: string[];
  priority?: string;
  status?: string;
  publish_date?: string;
  expiration_date?: string;
  requires_acknowledgement?: boolean;
};

export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as UpdateBody;
    const { data, error } = await supabase.rpc("update_app_portal_communication", {
      p_id: id,
      p_title: body.title ?? null,
      p_summary: body.summary ?? null,
      p_full_message: body.full_message ?? null,
      p_communication_type: body.communication_type ?? null,
      p_audience_type: body.audience_type ?? null,
      p_audience_target_ids: body.audience_target_ids ?? null,
      p_priority: body.priority ?? null,
      p_status: body.status ?? null,
      p_publish_date: body.publish_date ?? null,
      p_expiration_date: body.expiration_date ?? null,
      p_requires_acknowledgement: body.requires_acknowledgement ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseCommunicationItem(data);
    return NextResponse.json({ updated: true, communication: item });
  } catch {
    return NextResponse.json({ error: "Failed to update communication" }, { status: 500 });
  }
}
