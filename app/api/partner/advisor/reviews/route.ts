import { NextResponse } from "next/server";
import { getPartnerAdvisorReviews } from "@/lib/core/partner-advisor";
import { parsePartnerAdvisorReviews } from "@/lib/partner-advisor";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getPartnerAdvisorReviews(supabase, {
      review_type: url.searchParams.get("review_type") ?? undefined,
      review_status: url.searchParams.get("review_status") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
    });

    const parsed = parsePartnerAdvisorReviews(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load reviews" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { review_type?: string; scheduled_date?: string };
    const { createPartnerAdvisorReview } = await import("@/lib/core/partner-advisor");
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
    return NextResponse.json({ error: "Failed to request review" }, { status: 500 });
  }
}
