import { NextResponse } from "next/server";
import { getAipifyHostsCard } from "@/lib/core/aipify-hosts";
import { parseAipifyHostsCard } from "@/lib/aipify/aipify-hosts";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsCard(supabase);
    return NextResponse.json(parseAipifyHostsCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load Aipify Hosts card" }, { status: 500 });
  }
}
