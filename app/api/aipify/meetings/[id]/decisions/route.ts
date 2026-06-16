import { NextResponse } from "next/server";
import { parseMeetingDecisionItem } from "@/lib/app-portal/meetings";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

type DecisionBody = {
  title?: string;
  rationale?: string;
  owner_id?: string | null;
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as DecisionBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_meeting_decision", {
      p_meeting_id: id,
      p_title: body.title,
      p_rationale: body.rationale ?? "",
      p_owner_id: body.owner_id ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseMeetingDecisionItem(data);
    return NextResponse.json({ created: true, decision: item });
  } catch {
    return NextResponse.json({ error: "Failed to record decision" }, { status: 500 });
  }
}
