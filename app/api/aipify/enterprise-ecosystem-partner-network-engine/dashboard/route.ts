import { NextResponse } from "next/server";
import { parseEnterpriseEcosystemPartnerNetworkCenter } from "@/lib/aipify/enterprise-ecosystem-partner-network-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_enterprise_ecosystem_partner_network_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEnterpriseEcosystemPartnerNetworkCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load ecosystem center" }, { status: 500 });
  }
}
