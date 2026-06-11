import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseLearningEvents } from "@/lib/aipify/learning-engine";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limit = Number(new URL(request.url).searchParams.get("limit") ?? 50);
    const { data, error } = await supabase.rpc("get_learning_events", { p_limit: limit });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ events: parseLearningEvents(data) });
  } catch {
    return NextResponse.json({ error: "Failed to load learning events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      source_module?: string;
      source_id?: string;
      event_type?: string;
      user_decision?: string;
      outcome?: string;
      explanation?: string;
    };
    if (!body.source_module || !body.event_type) {
      return NextResponse.json({ error: "source_module and event_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_learning_event", {
      p_source_module: body.source_module,
      p_source_id: body.source_id ?? null,
      p_event_type: body.event_type,
      p_user_decision: body.user_decision ?? null,
      p_outcome: body.outcome ?? null,
      p_explanation: body.explanation ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ id: data });
  } catch {
    return NextResponse.json({ error: "Failed to record learning event" }, { status: 500 });
  }
}
