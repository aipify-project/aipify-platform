import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWebsiteKompisAnswerFeedbackOverview } from "@/lib/marketing/website-kompis-answer-feedback-server";
import { FEEDBACK_REVIEW_DISPOSITION_READY } from "@/lib/website-kompis-feedback/operations-model";
import { loadReviewQueuePage } from "@/lib/website-kompis-feedback/disposition-server";

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
    const queueParam = url.searchParams.get("queue");
    const before = url.searchParams.get("before");
    const beforeId = url.searchParams.get("beforeId");
    const queue = queueParam === "review" || queueParam === "history" ? queueParam : null;

    if (FEEDBACK_REVIEW_DISPOSITION_READY && queue && (before || beforeId)) {
      const page = await loadReviewQueuePage(supabase, { queue, limit, before, beforeId });
      if (!page.ok) return NextResponse.json({ ok: false, page: null, code: page.code }, { status: 409 });
      return NextResponse.json({ ok: true, page: page.page });
    }

    const overview = await getWebsiteKompisAnswerFeedbackOverview(supabase, { limit });
    const reviewPage = FEEDBACK_REVIEW_DISPOSITION_READY
      ? await loadReviewQueuePage(supabase, { queue: "review", limit: 100 })
      : null;
    const historyPage = FEEDBACK_REVIEW_DISPOSITION_READY
      ? await loadReviewQueuePage(supabase, { queue: "history", limit: 100 })
      : null;

    return NextResponse.json({
      ok: true,
      persistenceReady: overview.persistenceReady,
      totals: overview.totals,
      recent: overview.recent,
      reviewPage: reviewPage && reviewPage.ok ? reviewPage.page : null,
      historyPage: historyPage && historyPage.ok ? historyPage.page : null,
      reuseEnabled: false,
      reuseNote:
        "Helpful votes are prioritization signals only. Automatic answer reuse stays off until source-control gates are applied.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to load feedback overview." }, { status: 500 });
  }
}
