import { NextResponse } from "next/server";
import { getAipifyHostsVendorCenterCard } from "@/lib/core/aipify-hosts-vendor-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getAipifyHostsVendorCenterCard(supabase));
  } catch {
    return NextResponse.json({ error: "Failed to load vendor center card" }, { status: 500 });
  }
}
