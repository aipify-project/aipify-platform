import { NextResponse } from "next/server";
import { performCompanionPresenceOperationsAction } from "@/lib/companion-presence-operations";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as { action_type?: string; payload?: Record<string, unknown> };
    return NextResponse.json(await performCompanionPresenceOperationsAction(supabase, body.action_type ?? "", body.payload ?? {}));
  } catch (err) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "Action failed" }, { status: 500 });
  }
}
