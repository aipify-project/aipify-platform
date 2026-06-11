import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("approve_action_request", {
      p_request_id: id,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await supabase.rpc("execute_action_request", { p_request_id: id });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to approve action" }, { status: 500 });
  }
}
