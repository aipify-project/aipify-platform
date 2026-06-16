import { NextResponse } from "next/server";
import { getBusinessPackLegalEngineDashboard } from "@/lib/core/business-pack-legal-engine";
import { parseBusinessPackLegalEngineDashboard } from "@/lib/aipify/business-pack-legal-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getBusinessPackLegalEngineDashboard(supabase);
    const parsed = parseBusinessPackLegalEngineDashboard(data);
    return NextResponse.json(parsed ?? { has_access: false });
  } catch {
    return NextResponse.json({ error: "Failed to load legal engine dashboard" }, { status: 500 });
  }
}
