import { NextResponse } from "next/server";
import { getBusinessPackLicenseEngineDashboard } from "@/lib/core/business-pack-license-engine";
import { parseBusinessPackLicenseEngineDashboard } from "@/lib/aipify/business-pack-license-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getBusinessPackLicenseEngineDashboard(supabase);
    const parsed = parseBusinessPackLicenseEngineDashboard(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load license engine" }, { status: 500 });
  }
}
