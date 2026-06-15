import { NextResponse } from "next/server";
import { getAipifyHostsAccessCenterCard } from "@/lib/core/aipify-hosts-access-center";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsAccessCenterCard(supabase);
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to load access center card" }, { status: 500 });
  }
}
