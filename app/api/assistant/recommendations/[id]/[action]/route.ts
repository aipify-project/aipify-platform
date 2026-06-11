import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; action: string }> }
) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id, action } = await params;
    const body = action === "reject" ? ((await request.json()) as { reason?: string }) : {};

    if (action === "accept") {
      const { data, error } = await supabase.rpc("accept_assistant_recommendation", {
        p_recommendation_id: id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }

    if (action === "reject") {
      const { data, error } = await supabase.rpc("reject_assistant_recommendation", {
        p_recommendation_id: id,
        p_reason: body.reason ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to resolve recommendation" }, { status: 500 });
  }
}
