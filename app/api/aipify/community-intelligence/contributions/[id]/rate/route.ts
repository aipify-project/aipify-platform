import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseCommunityActionResult } from "@/lib/aipify/community-intelligence";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as { rating?: number };
    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ error: "rating must be between 1 and 5" }, { status: 400 });
    }
    const { data, error } = await supabase.rpc("rate_community_contribution", {
      p_contribution_id: id,
      p_rating: body.rating,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCommunityActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to rate contribution" }, { status: 500 });
  }
}
