import { NextResponse } from "next/server";
import { parseWorkPrioritizationAction } from "@/lib/aipify/companion-work-prioritization/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { force?: boolean };
    const { data, error } = await supabase.rpc("recalculate_companion_work_prioritization", {
      p_force: body.force === true,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const result = parseWorkPrioritizationAction(data);
    if (!result.ok) return NextResponse.json({ error: result.error ?? "Failed" }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to recalculate priorities" }, { status: 500 });
  }
}
