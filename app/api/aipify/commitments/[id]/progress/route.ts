import { NextResponse } from "next/server";
import { parseCommitmentItem } from "@/lib/app-portal/commitment-tracking";
import { createClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

type ProgressBody = {
  progress_percent?: number;
  milestones_achieved?: string;
  delays_encountered?: string;
  obstacles_identified?: string;
  progress_update?: string;
  completion_evidence?: string;
  lessons_learned?: string;
  status?: string;
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as ProgressBody;
    const { data, error } = await supabase.rpc("record_app_portal_commitment_progress", {
      p_id: id,
      p_progress_percent: body.progress_percent ?? null,
      p_milestones_achieved: body.milestones_achieved ?? null,
      p_delays_encountered: body.delays_encountered ?? null,
      p_obstacles_identified: body.obstacles_identified ?? null,
      p_progress_update: body.progress_update ?? "",
      p_completion_evidence: body.completion_evidence ?? null,
      p_lessons_learned: body.lessons_learned ?? null,
      p_status: body.status ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ recorded: true, commitment: parseCommitmentItem(data) });
  } catch {
    return NextResponse.json({ error: "Failed to record progress" }, { status: 500 });
  }
}
