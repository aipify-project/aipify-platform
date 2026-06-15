import { NextResponse } from "next/server";
import { getAipifyHostsCalendarCenterCard } from "@/lib/core/aipify-hosts-calendar-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getAipifyHostsCalendarCenterCard(supabase));
  } catch {
    return NextResponse.json({ error: "Failed to load calendar center card" }, { status: 500 });
  }
}
