import { NextResponse } from "next/server";
import { getAipifyHostsReputationCenterCard } from "@/lib/core/aipify-hosts-reputation-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsReputationCenterCard(supabase);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load reputation card" }, { status: 500 });
  }
}
