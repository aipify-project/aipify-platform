import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      learning_type?: string;
      category?: string;
      source_module?: string;
      payload?: Record<string, unknown>;
      confidence?: number;
    };
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("submit_global_learning_signal", {
      p_learning_type: body.learning_type ?? "outcome",
      p_category: body.category ?? "knowledge",
      p_source_module: body.source_module ?? "manual",
      p_payload: body.payload ?? {},
      p_confidence: body.confidence ?? 0.5,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to submit signal" }, { status: 500 });
  }
}
