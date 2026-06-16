import { NextResponse } from "next/server";
import { parseStrategyMilestone } from "@/lib/app-portal/strategy-execution";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

type MilestoneBody = {
  title?: string;
  target_date?: string;
  notes?: string;
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as MilestoneBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_strategy_milestone", {
      p_initiative_id: id,
      p_title: body.title,
      p_target_date: body.target_date ?? null,
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ created: true, milestone: parseStrategyMilestone(data) });
  } catch {
    return NextResponse.json({ error: "Failed to create milestone" }, { status: 500 });
  }
}
