import { NextResponse } from "next/server";
import { createPartnerAdvisorReview } from "@/lib/core/partner-advisor";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { review_type?: string; scheduled_date?: string };
    const result = await createPartnerAdvisorReview(
      supabase,
      body.review_type ?? "30_day",
      body.scheduled_date,
    );
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to schedule review" }, { status: 500 });
  }
}
