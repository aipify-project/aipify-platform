import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseIntelligenceFoundation } from "@/lib/platform/intelligence-foundation";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase.rpc("get_customer_intelligence_foundation", {
      p_tenant_id: id,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const foundation = parseIntelligenceFoundation(data);
    return NextResponse.json({ timeline: foundation.timeline });
  } catch {
    return NextResponse.json({ error: "Failed to load timeline" }, { status: 500 });
  }
}
