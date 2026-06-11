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
    const body = action === "escalate" ? ((await request.json()) as { reason?: string }) : {};

    if (action === "approve") {
      const { data, error } = await supabase.rpc("approve_support_ai_response", { p_response_id: id });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }
    if (action === "send") {
      const { data, error } = await supabase.rpc("send_support_reply", { p_response_id: id });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }
    if (action === "escalate") {
      const { data, error } = await supabase.rpc("escalate_support_case", {
        p_case_id: id,
        p_reason: body.reason ?? null,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }
    if (action === "close") {
      const { data, error } = await supabase.rpc("close_organization_support_case", { p_case_id: id });
      if (error) return NextResponse.json({ error: error.message }, { status: 403 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process support action" }, { status: 500 });
  }
}
