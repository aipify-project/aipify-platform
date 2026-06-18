import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseAocReviewResult } from "@/lib/aipify/aoc/parse";

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { review_type?: string };
    const reviewType = body.review_type ?? "daily";
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("generate_aoc_review", { p_review_type: reviewType });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const result = parseAocReviewResult(data);
    if (!result) return NextResponse.json({ error: "Review generation failed" }, { status: 400 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to generate review" }, { status: 500 });
  }
}
