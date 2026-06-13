import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { phase?: number };
    if (!body.phase || body.phase < 1 || body.phase > 7) {
      return NextResponse.json({ error: "phase must be 1-7" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("run_business_discovery_phase", {
      p_phase: body.phase,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to run discovery phase" }, { status: 500 });
  }
}
