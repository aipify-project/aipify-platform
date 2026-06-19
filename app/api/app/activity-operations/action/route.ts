import { NextResponse } from "next/server";
import { performActivityOperationsAction } from "@/lib/activity-operations";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as { action_type?: string; payload?: Record<string, unknown> };
    if (!body.action_type) return NextResponse.json({ error: "action_type required" }, { status: 400 });
    const result = await performActivityOperationsAction(supabase, body.action_type, body.payload ?? {});
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Action failed" }, { status: 500 });
  }
}
