import { NextResponse } from "next/server";
import { getAipifyHostsGuestCenterCard } from "@/lib/core/aipify-hosts-guest-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsGuestCenterCard(supabase);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load guest center card" }, { status: 500 });
  }
}
