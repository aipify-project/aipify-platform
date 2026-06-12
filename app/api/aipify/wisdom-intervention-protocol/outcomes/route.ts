import { NextResponse } from "next/server";
import {
  parseWisdomInterventionOutcome,
  parseWisdomInterventionSuggestion,
} from "@/lib/aipify/wisdom-intervention-protocol";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const signalType = searchParams.get("signal_type");

    const { data, error } = await supabase.rpc("suggest_wisdom_intervention", {
      p_signal_type: signalType,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseWisdomInterventionSuggestion(data));
  } catch {
    return NextResponse.json({ error: "Failed to suggest intervention" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      signal_type?: string;
      summary?: string;
      suggested_intervention?: string;
      user_action?: string;
      metadata?: Record<string, unknown>;
    };

    const { data, error } = await supabase.rpc("record_wisdom_intervention_outcome", {
      p_signal_type: body.signal_type,
      p_summary: body.summary,
      p_suggested_intervention: body.suggested_intervention ?? null,
      p_user_action: body.user_action ?? null,
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseWisdomInterventionOutcome(data));
  } catch {
    return NextResponse.json({ error: "Failed to record outcome" }, { status: 500 });
  }
}
