import { NextResponse } from "next/server";
import { getBusinessPackIdentityEngineDashboard } from "@/lib/core/business-pack-identity-engine";
import { parseBusinessPackIdentityEngineDashboard } from "@/lib/aipify/business-pack-identity-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getBusinessPackIdentityEngineDashboard(supabase);
    const parsed = parseBusinessPackIdentityEngineDashboard(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load identity engine" }, { status: 500 });
  }
}
