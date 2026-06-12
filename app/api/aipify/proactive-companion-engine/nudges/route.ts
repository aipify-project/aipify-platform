import { NextResponse } from "next/server";
import { parseProactiveCompanionNudges } from "@/lib/aipify/proactive-companion-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") ?? "pending";

    const { data, error } = await supabase.rpc("list_proactive_companion_nudges", { p_status: status });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseProactiveCompanionNudges(data));
  } catch {
    return NextResponse.json({ error: "Failed to list nudges" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: "dismiss" | "snooze";
      nudge_id?: string;
      snoozed_until?: string;
    };

    if (!body.nudge_id || !body.action) {
      return NextResponse.json({ error: "nudge_id and action required" }, { status: 400 });
    }

    if (body.action === "dismiss") {
      const { data, error } = await supabase.rpc("dismiss_proactive_companion_nudge", {
        p_nudge_id: body.nudge_id,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    const { data, error } = await supabase.rpc("snooze_proactive_companion_nudge", {
      p_nudge_id: body.nudge_id,
      p_until: body.snoozed_until ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update nudge" }, { status: 500 });
  }
}
