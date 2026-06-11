import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type RouteParams = { params: Promise<{ id: string; action: string }> };

export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id, action } = await params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (action === "accept") {
      const { data, error } = await supabase.rpc("accept_quality_recommendation", {
        p_recommendation_id: id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (action === "reject") {
      const { data, error } = await supabase.rpc("reject_quality_recommendation", {
        p_recommendation_id: id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to update recommendation" }, { status: 500 });
  }
}
