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
      milestone_key?: string;
      status?: string;
    };

    if (!body.milestone_key) {
      return NextResponse.json({ error: "milestone_key is required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("update_pilot_milestone", {
      p_milestone_key: body.milestone_key,
      p_status: body.status ?? "completed",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update pilot milestone" }, { status: 500 });
  }
}
