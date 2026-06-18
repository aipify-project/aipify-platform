import { NextResponse } from "next/server";
import { parseExecutiveCompanionPriorities } from "@/lib/aipify/companion-executive-layer/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limit = Number(new URL(request.url).searchParams.get("limit") ?? 5);
    const { data, error } = await supabase.rpc("get_companion_executive_layer_priorities", {
      p_limit: Number.isFinite(limit) ? limit : 5,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseExecutiveCompanionPriorities(data));
  } catch {
    return NextResponse.json({ error: "Failed to load priorities" }, { status: 500 });
  }
}
