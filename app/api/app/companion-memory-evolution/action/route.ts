import { NextResponse } from "next/server";
import { performCompanionMemoryEvolutionAction } from "@/lib/customer-companion-memory-evolution";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const action_type = String(body.action_type ?? body.action ?? "");
    const payload = (body.payload ?? body) as Record<string, unknown>;
    const data = await performCompanionMemoryEvolutionAction(supabase, action_type, payload);
    return NextResponse.json(data ?? { ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Action failed" },
      { status: 400 }
    );
  }
}
