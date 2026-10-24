import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runFeedbackBulkDisposition } from "@/lib/website-kompis-feedback/disposition-server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => null)) as {
      feedbackIds?: string[];
      action?: "rejected" | "duplicate";
      reason?: string;
      confirmation?: boolean;
    } | null;
    if (body?.confirmation !== true || (body.action !== "rejected" && body.action !== "duplicate")) {
      return NextResponse.json({ error: "Confirmation is required.", code: "confirmation_required" }, { status: 400 });
    }

    const result = await runFeedbackBulkDisposition(supabase, {
      feedbackIds: body.feedbackIds ?? [],
      action: body.action,
      reason: body.reason ?? "",
    });
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Bulk review failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
