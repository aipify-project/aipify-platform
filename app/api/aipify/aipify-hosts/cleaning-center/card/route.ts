import { NextResponse } from "next/server";
import { getAipifyHostsCleaningCenterCard } from "@/lib/core/aipify-hosts-cleaning-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsCleaningCenterCard(supabase);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load cleaning card" }, { status: 500 });
  }
}
