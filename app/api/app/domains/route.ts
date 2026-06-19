import { NextResponse } from "next/server";
import { getDomainLicenseCenter, parseDomainLicenseCenter } from "@/lib/domain-license";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getDomainLicenseCenter(supabase);
    return NextResponse.json(parseDomainLicenseCenter(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load domains";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
