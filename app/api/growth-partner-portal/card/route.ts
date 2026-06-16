import { NextResponse } from "next/server";
import { getGrowthPartnerPortalCard } from "@/lib/core/growth-partner-portal";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ has_access: false });

    const data = await getGrowthPartnerPortalCard(supabase);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load portal card" }, { status: 500 });
  }
}
