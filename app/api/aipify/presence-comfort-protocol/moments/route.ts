import { NextResponse } from "next/server";
import { parseComfortMomentResult } from "@/lib/aipify/presence-comfort-protocol/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      moment_type?: string;
      comfort_message?: string;
      rose_used?: boolean;
      metadata?: Record<string, unknown>;
    };

    const { data, error } = await supabase.rpc("record_comfort_rose_moment", {
      p_moment_type: body.moment_type ?? "",
      p_comfort_message: body.comfort_message ?? "",
      p_rose_used: body.rose_used ?? false,
      p_metadata: body.metadata ?? {},
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseComfortMomentResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to record comfort moment" }, { status: 500 });
  }
}
