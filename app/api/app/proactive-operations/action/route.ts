import { NextResponse } from "next/server";
import { performProactiveAction } from "@/lib/customer-proactive-operations";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as Record<string, unknown>;
    const action_type = String(body.action_type ?? body.action ?? "");
    const { action_type: _a, action: _b, ...payload } = body;
    const result = await performProactiveAction(supabase, action_type, payload);
    return NextResponse.json(result ?? { ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Action failed" },
      { status: 400 }
    );
  }
}
