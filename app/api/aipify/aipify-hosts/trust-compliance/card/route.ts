import { NextResponse } from "next/server";
import { getAipifyHostsTrustComplianceCard } from "@/lib/core/aipify-hosts-trust-compliance";
import { parseAipifyHostsTrustComplianceCard } from "@/lib/aipify/aipify-hosts-trust-compliance";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsTrustComplianceCard(supabase);
    return NextResponse.json(parseAipifyHostsTrustComplianceCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load trust & compliance card" }, { status: 500 });
  }
}
