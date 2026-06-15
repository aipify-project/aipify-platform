import { NextResponse } from "next/server";
import { getAipifyHostsCompanionCard } from "@/lib/core/aipify-hosts-companion";
import { parseAipifyHostsCompanionCard } from "@/lib/aipify/aipify-hosts-companion";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsCompanionCard(supabase);
    return NextResponse.json(parseAipifyHostsCompanionCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load hospitality companion card" }, { status: 500 });
  }
}
