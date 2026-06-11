import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseGlobalExpansionActionResult } from "@/lib/aipify/global-expansion";

type RouteContext = { params: Promise<{ countryCode: string }> };

export async function POST(_request: Request, context: RouteContext) {
  try {
    const { countryCode } = await context.params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("advance_country_playbook", {
      p_country_code: countryCode,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseGlobalExpansionActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to advance country playbook" }, { status: 500 });
  }
}
