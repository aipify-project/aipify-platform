import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      baseline_type?: string;
      baseline_value?: number;
      unit?: string;
      metadata?: Record<string, unknown>;
    };

    if (!body.baseline_type) {
      return NextResponse.json({ error: "baseline_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("capture_value_baseline", {
      p_baseline_type: body.baseline_type,
      p_baseline_value: body.baseline_value ?? 0,
      p_unit: body.unit ?? "minutes",
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to capture baseline" }, { status: 500 });
  }
}
