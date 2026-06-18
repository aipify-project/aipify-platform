import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePartnerEcosystemActionResult } from "@/lib/aipify/partner-certification/parse";

type RouteContext = { params: Promise<{ partnerId: string }> };

export async function POST(request: Request, context: RouteContext) {
  try {
    const { partnerId } = await context.params;
    const body = (await request.json()) as { compliance_type?: string };
    if (!body.compliance_type) {
      return NextResponse.json({ error: "compliance_type is required" }, { status: 400 });
    }
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("accept_partner_compliance", {
      p_partner_id: partnerId,
      p_compliance_type: body.compliance_type,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePartnerEcosystemActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to accept compliance" }, { status: 500 });
  }
}
