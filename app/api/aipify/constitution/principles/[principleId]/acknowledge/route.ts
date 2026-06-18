import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseConstitutionActionResult } from "@/lib/aipify/constitution/parse";

type RouteContext = { params: Promise<{ principleId: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { principleId } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("acknowledge_constitution_principle", {
      p_principle_id: principleId,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseConstitutionActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to acknowledge principle" }, { status: 500 });
  }
}
