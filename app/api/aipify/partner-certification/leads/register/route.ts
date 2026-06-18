import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePartnerEcosystemActionResult } from "@/lib/aipify/partner-certification/parse";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as {
      opportunity_name?: string;
      company_name?: string;
      country?: string;
      estimated_value?: number;
    };
    if (!body.opportunity_name) {
      return NextResponse.json({ error: "opportunity_name is required" }, { status: 400 });
    }
    const { data, error } = await supabase.rpc("register_partner_lead", {
      p_opportunity_name: body.opportunity_name,
      p_company_name: body.company_name ?? null,
      p_country: body.country ?? null,
      p_estimated_value: body.estimated_value ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePartnerEcosystemActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to register lead" }, { status: 500 });
  }
}
