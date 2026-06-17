import { NextResponse } from "next/server";
import { parseEconomyActionResult } from "@/lib/partners-portal/economy-engine";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = (await request.json()) as {
      agreement_type?: string;
      company_profile?: Record<string, unknown>;
    };
    const { data, error } = await supabase.rpc("accept_growth_partner_economy_agreement", {
      p_agreement_type: body.agreement_type ?? null,
      p_company_profile: body.company_profile ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseEconomyActionResult(data));
  } catch {
    return NextResponse.json({ error: "Agreement acceptance failed" }, { status: 500 });
  }
}
