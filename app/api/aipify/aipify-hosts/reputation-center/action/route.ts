import { NextResponse } from "next/server";
import { performAipifyHostsReputationAction } from "@/lib/core/aipify-hosts-reputation-center";
import { parseAipifyHostsReputationCenterActionResult } from "@/lib/aipify/aipify-hosts-reputation-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      review_id?: string;
      recovery_id?: string;
      status?: string;
      owner?: string;
      notes?: string;
      due_date?: string;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performAipifyHostsReputationAction(supabase, {
      actionType: body.action_type,
      reviewId: body.review_id,
      recoveryId: body.recovery_id,
      status: body.status,
      owner: body.owner,
      notes: body.notes,
      dueDate: body.due_date,
    });

    return NextResponse.json(parseAipifyHostsReputationCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
