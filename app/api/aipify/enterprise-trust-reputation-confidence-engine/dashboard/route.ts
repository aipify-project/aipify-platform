import { NextResponse } from "next/server";
import { parseEnterpriseTrustConfidenceCenter } from "@/lib/aipify/enterprise-trust-reputation-confidence-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_enterprise_trust_confidence_center");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEnterpriseTrustConfidenceCenter(data));
  } catch {
    return NextResponse.json({ error: "Failed to load trust center" }, { status: 500 });
  }
}
