import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      profile_id?: string;
      signal_type?: string;
      signal_value?: number;
      metadata?: Record<string, unknown>;
    };

    if (!body.profile_id || !body.signal_type) {
      return NextResponse.json({ error: "profile_id and signal_type required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("record_trust_reputation_signal", {
      p_profile_id: body.profile_id,
      p_signal_type: body.signal_type,
      p_signal_value: body.signal_value ?? 0,
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to record signal" }, { status: 500 });
  }
}
