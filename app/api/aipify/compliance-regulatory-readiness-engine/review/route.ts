import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      review_type?: string;
      title?: string;
      scheduled_at?: string;
      metadata?: Record<string, unknown>;
    };

    const { data, error } = await supabase.rpc("schedule_compliance_review", {
      p_review_type: body.review_type,
      p_title: body.title,
      p_scheduled_at: body.scheduled_at ?? null,
      p_metadata: body.metadata ?? {},
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to schedule review" }, { status: 500 });
  }
}
