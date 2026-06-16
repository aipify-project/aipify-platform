import { NextResponse } from "next/server";
import { performAipifyHostsCleaningAction } from "@/lib/core/aipify-hosts-cleaning-center";
import { parseAipifyHostsCleaningCenterActionResult } from "@/lib/aipify/aipify-hosts-cleaning-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      cleaning_task_id?: string;
      cleaner_id?: string;
      notes?: string;
      issue_category?: string;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performAipifyHostsCleaningAction(supabase, {
      actionType: body.action_type,
      cleaningTaskId: body.cleaning_task_id,
      cleanerId: body.cleaner_id,
      notes: body.notes,
      issueCategory: body.issue_category,
    });

    return NextResponse.json(parseAipifyHostsCleaningCenterActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
