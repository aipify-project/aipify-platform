import { NextResponse } from "next/server";
import { getBusinessPackMarketplaceEngineCard } from "@/lib/core/business-pack-marketplace-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getBusinessPackMarketplaceEngineCard(supabase);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ has_access: false });
  }
}
