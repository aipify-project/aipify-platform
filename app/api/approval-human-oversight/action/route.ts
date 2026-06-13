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
      action?: "approve" | "reject" | "delegate" | "snooze" | "request_info" | "dismiss_recommendation";
      request_key?: string;
      recommendation_key?: string;
      reason?: string;
      delegated_to?: string;
      snoozed_until?: string;
    };

    const { data, error } = await supabase.rpc("process_approval_oversight_action", {
      p_payload: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process approval action" }, { status: 500 });
  }
}
