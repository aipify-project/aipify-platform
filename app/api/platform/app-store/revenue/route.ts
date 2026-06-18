import { NextResponse } from "next/server";
import { getPlatformAppStoreRevenueDashboard, parsePlatformAppStoreRevenue } from "@/lib/app-store";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPlatformAppStoreRevenueDashboard(supabase);
    return NextResponse.json(parsePlatformAppStoreRevenue(data) ?? { found: false });
  } catch {
    return NextResponse.json({ error: "Failed to load revenue dashboard" }, { status: 500 });
  }
}
