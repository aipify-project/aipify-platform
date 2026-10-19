import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getWebsiteKompisAnswerFeedbackOverview } from "@/lib/marketing/website-kompis-answer-feedback-server";

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
    const queue = queueParam === "review" || queueParam === "history" ? queueParam : null;

    const overview = await getWebsiteKompisAnswerFeedbackOverview(supabase, {
      limit,
      queue,
      before: url.searchParams.get("before"),
      beforeId: url.searchParams.get("beforeId"),
    });

    return NextResponse.json({
      ok: true,
      persistenceReady: overview.persistenceReady,
      reviewCloseReady: overview.reviewCloseReady,
      reviewPageReady: overview.reviewPageReady,
      totals: overview.totals,
      recent: overview.recent,
      reviewPage: overview.reviewPage,
      historyPage: overview.historyPage,
      reuseEnabled: false,
      reuseNote:
        "Helpful votes are prioritization signals only. Automatic answer reuse stays off until source-control gates are applied.",
    });
  } catch {
    return NextResponse.json({ error: "Failed to load feedback overview." }, { status: 500 });
  }
}
