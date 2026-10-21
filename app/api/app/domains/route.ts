import { NextResponse } from "next/server";
import { parseDomainLicenseCenter } from "@/lib/domain-license";
import { DomainCenterAccessError, readOrganizationDomainCenter } from "@/lib/domain-license/read-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await readOrganizationDomainCenter(supabase);
    return NextResponse.json(parseDomainLicenseCenter(data) ?? { found: false });
  } catch (err) {
    if (err instanceof DomainCenterAccessError) {
      return NextResponse.json({ found: false }, { status: 403 });
    }
    const message = err instanceof Error ? err.message : "Failed to load domains";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
