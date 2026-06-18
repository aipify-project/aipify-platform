import { NextResponse } from "next/server";
import { getAipifyHostsReferralCard } from "@/lib/core/aipify-hosts-referral";
import { parseAipifyHostsReferralCard } from "@/lib/aipify/aipify-hosts-referral/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getAipifyHostsReferralCard(supabase);
    return NextResponse.json(parseAipifyHostsReferralCard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load referral card" }, { status: 500 });
  }
}
