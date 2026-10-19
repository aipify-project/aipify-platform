import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWebsiteKompisAnswerFeedbackOverview } from "@/lib/marketing/website-kompis-answer-feedback-server";
import { FEEDBACK_REVIEW_DISPOSITION_READY } from "@/lib/website-kompis-feedback/operations-model";
import { loadOpenReviewQueue } from "@/lib/website-kompis-feedback/disposition-server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const limitRaw = Number(url.searchParams.get("limit") ?? "40");
    const limit = Number.isFinite(limitRaw) ? limitRaw : 40;

    const overview = await getWebsiteKompisAnswerFeedbackOverview(supabase, { limit });
    const reviewQueue = FEEDBACK_REVIEW_DISPOSITION_READY ? await loadOpenReviewQueue(supabase) : null;

    return NextResponse.json({
      ok: true,
      persistenceReady: overview.persistenceReady,
      totals: overview.totals,
      recent: overview.recent,
      reviewQueue: reviewQueue && reviewQueue.ok ? reviewQueue.items : null,
      reuseEnabled: false,
      reuseNote:
        "Helpful votes are prioritization signals only. Automatic answer reuse stays off until source-control gates are applied.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to load feedback overview." }, { status: 500 });
  }
}
