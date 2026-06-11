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
      action_key?: string;
      payload?: Record<string, unknown>;
      recommendation?: Record<string, unknown>;
    };
    if (!body.action_key) {
      return NextResponse.json({ error: "action_key required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("suggest_ai_action", {
      p_action_key: body.action_key,
      p_payload: body.payload ?? {},
      p_recommendation: body.recommendation ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to suggest action" }, { status: 500 });
  }
}
