import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      recommendation_id?: string;
      decision?: "approved" | "rejected" | "corrected";
      correction_note?: string;
    };

    if (!body.recommendation_id || !body.decision) {
      return NextResponse.json({ error: "recommendation_id and decision required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("decide_customer_zero_recommendation", {
      p_payload: {
        recommendation_id: body.recommendation_id,
        decision: body.decision,
        correction_note: body.correction_note ?? null,
      },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process recommendation" }, { status: 500 });
  }
}
