import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { runLegacyFeedbackClose } from "@/lib/website-kompis-feedback/legacy-close-gate";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { id } = await context.params;
    const result = await runLegacyFeedbackClose({
      userId: user?.id ?? null,
      feedbackId: id,
      rpc: async (args) => supabase.rpc("close_website_kompis_answer_feedback_review", args),
    });
    return NextResponse.json(result.body, { status: result.status });
  } catch {
    return NextResponse.json({ error: "Review close failed" }, { status: 500 });
  }
}
