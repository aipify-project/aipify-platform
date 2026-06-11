import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      signal_type?: string;
      signal_value?: string;
      source_module?: string;
    };

    if (!body.signal_type) {
      return NextResponse.json({ error: "signal_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_awse_adaptation_signal", {
      p_signal_type: body.signal_type,
      p_signal_value: body.signal_value ?? "",
      p_source_module: body.source_module ?? "awse",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    return NextResponse.json({ id: data });
  } catch {
    return NextResponse.json({ error: "Signal recording failed" }, { status: 500 });
  }
}
