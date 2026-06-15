import { NextResponse } from "next/server";
import { getAipifyHostsQualityCenterCard } from "@/lib/core/aipify-hosts-quality-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.json(await getAipifyHostsQualityCenterCard(supabase));
  } catch {
    return NextResponse.json({ error: "Failed to load quality center card" }, { status: 500 });
  }
}
