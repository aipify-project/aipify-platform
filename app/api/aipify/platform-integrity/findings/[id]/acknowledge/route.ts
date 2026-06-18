import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseIntegrityActionResult } from "@/lib/aipify/platform-integrity/parse";

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("acknowledge_integrity_finding", { p_finding_id: id });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseIntegrityActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to acknowledge finding" }, { status: 500 });
  }
}
