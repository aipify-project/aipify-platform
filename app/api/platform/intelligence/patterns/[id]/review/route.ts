import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { ReviewAction } from "@/lib/platform/intelligence-engine";

type ReviewBody = {
  action: ReviewAction;
  notes?: string;
};

const VALID_ACTIONS: ReviewAction[] = [
  "approve_global",
  "keep_internal",
  "needs_more_evidence",
  "reject",
  "approve",
  "request_more_data",
];

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as ReviewBody;
    if (!body.action || !VALID_ACTIONS.includes(body.action)) {
      return NextResponse.json({ error: "Action required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("review_intelligence_pattern", {
      p_pattern_id: id,
      p_action: body.action,
      p_notes: body.notes ?? null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to review pattern" }, { status: 500 });
  }
}
