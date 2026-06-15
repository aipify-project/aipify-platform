import { NextResponse } from "next/server";
import { getAipifyHostsOwnerCenterCard } from "@/lib/core/aipify-hosts-owner-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsOwnerCenterCard(supabase);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load owner center card" }, { status: 500 });
  }
}
