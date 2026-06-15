import { NextResponse } from "next/server";
import { getAipifyHostsCheckinCenterCard } from "@/lib/core/aipify-hosts-checkin-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getAipifyHostsCheckinCenterCard(supabase));
  } catch {
    return NextResponse.json({ error: "Failed to load check-in center card" }, { status: 500 });
  }
}
