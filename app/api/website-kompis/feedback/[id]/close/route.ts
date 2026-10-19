import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await context.params;
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
      return NextResponse.json({ error: "Invalid feedback id" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("close_website_kompis_answer_feedback_review", {
      p_feedback_id: id.toLowerCase(),
      p_confirmation: true,
    });

    if (error) {
      const missing =
        error.code === "42883" ||
        (/close_website_kompis_answer_feedback_review/i.test(error.message) &&
          /does not exist/i.test(error.message));
      if (missing) {
        return NextResponse.json(
          { error: "Review close is not available.", code: "review_close_unavailable" },
          { status: 501 },
        );
      }
      if (/owner or admin|forbidden/i.test(error.message)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
      if (/not found/i.test(error.message)) {
        return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Review close failed" }, { status: 400 });
    }

    const row = data && typeof data === "object" ? (data as { review_status?: string }) : null;
    if (row?.review_status !== "closed") {
      return NextResponse.json({ error: "Review close was not confirmed" }, { status: 400 });
    }

    return NextResponse.json({ ok: true, id: id.toLowerCase(), reviewStatus: "closed", faqPublished: false });
  } catch {
    return NextResponse.json({ error: "Review close failed" }, { status: 500 });
  }
}
