import { NextResponse } from "next/server";
import { parseMeetingActionItem } from "@/lib/app-portal/meetings";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

type ActionBody = {
  title?: string;
  description?: string;
  owner_id?: string | null;
  due_date?: string;
  priority?: string;
  status?: string;
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as ActionBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_meeting_action", {
      p_meeting_id: id,
      p_title: body.title,
      p_description: body.description ?? "",
      p_owner_id: body.owner_id ?? null,
      p_due_date: body.due_date ?? null,
      p_priority: body.priority ?? "medium",
      p_status: body.status ?? "open",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseMeetingActionItem(data);
    return NextResponse.json({ created: true, action: item });
  } catch {
    return NextResponse.json({ error: "Failed to create action item" }, { status: 500 });
  }
}
