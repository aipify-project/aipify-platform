import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runFeedbackDisposition } from "@/lib/website-kompis-feedback/disposition-server";
import type { DispositionAction } from "@/lib/website-kompis-feedback/disposition";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    const body = (await request.json().catch(() => null)) as {
      action?: DispositionAction;
      faqItemId?: string;
      feedbackInstallId?: string;
      faqInstallId?: string;
      publishStatus?: string;
      confirmation?: boolean;
    } | null;
    if (body?.confirmation !== true || (body.action !== "published" && body.action !== "rejected")) {
      return NextResponse.json({ error: "Confirmation is required.", code: "confirmation_required" }, { status: 400 });
    }

    const result = await runFeedbackDisposition(supabase, {
      feedbackId: id,
      action: body.action,
      faqItemId: body.faqItemId,
      feedbackInstallId: body.feedbackInstallId,
      faqInstallId: body.faqInstallId,
      publishStatus: body.publishStatus,
    });
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    return NextResponse.json({ error: "Review disposition failed", code: "failed" }, { status: 500 });
  }
}
