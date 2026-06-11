import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseManifestoActionResult } from "@/lib/aipify/manifesto";

type RouteContext = { params: Promise<{ updateId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { updateId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("complete_vision_update", {
      p_update_id: updateId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseManifestoActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to complete vision update" }, { status: 500 });
  }
}
