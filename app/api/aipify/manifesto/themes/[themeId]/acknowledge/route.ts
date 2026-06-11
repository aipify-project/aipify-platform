import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseManifestoActionResult } from "@/lib/aipify/manifesto";

type RouteContext = { params: Promise<{ themeId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { themeId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("acknowledge_manifesto_theme", {
      p_theme_id: themeId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseManifestoActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to acknowledge theme" }, { status: 500 });
  }
}
