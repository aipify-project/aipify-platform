import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { milestone_id?: string };
    if (!body.milestone_id) {
      return NextResponse.json({ error: "milestone_id required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("acknowledge_legacy_milestone", {
      p_milestone_id: body.milestone_id,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to acknowledge milestone" }, { status: 500 });
  }
}
