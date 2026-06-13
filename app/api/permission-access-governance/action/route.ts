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
      action?:
        | "revoke"
        | "downgrade"
        | "approve_request"
        | "deny_request"
        | "dismiss_recommendation";
      grant_key?: string;
      request_key?: string;
      recommendation_key?: string;
      permission_level?: number;
      reason?: string;
    };

    const { data, error } = await supabase.rpc("process_permission_access_action", {
      p_payload: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to process permission action" }, { status: 500 });
  }
}
