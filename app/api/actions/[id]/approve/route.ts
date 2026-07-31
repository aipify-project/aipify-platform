import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { reason?: string };
    const reason =
      typeof body.reason === "string" && body.reason.trim().length > 0
        ? body.reason.trim().slice(0, 500)
        : null;

    const { data, error } = await supabase.rpc("approve_action_request", {
      p_request_id: id,
      p_reason: reason,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    await supabase.rpc("execute_action_request", { p_request_id: id });

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to approve action" }, { status: 500 });
  }
}
