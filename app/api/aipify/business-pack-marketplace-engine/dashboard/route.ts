import { NextResponse } from "next/server";
import { getBusinessPackMarketplaceEngineDashboard } from "@/lib/core/business-pack-marketplace-engine";
import { parseBusinessPackMarketplaceEngineDashboard } from "@/lib/aipify/business-pack-marketplace-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getBusinessPackMarketplaceEngineDashboard(supabase);
    const parsed = parseBusinessPackMarketplaceEngineDashboard(data);
    return NextResponse.json(parsed ?? { has_access: false });
  } catch {
    return NextResponse.json({ error: "Failed to load marketplace engine dashboard" }, { status: 500 });
  }
}
