import { NextResponse } from "next/server";
import { generateAipifyHostsReferralLink } from "@/lib/core/aipify-hosts-referral";
import { parseGenerateReferralLinkResult } from "@/lib/aipify/aipify-hosts-referral/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { referral_role?: string };
    const role = body.referral_role ?? "host";
    if (!["host", "service_provider", "growth_partner"].includes(role)) {
      return NextResponse.json({ error: "Invalid referral role" }, { status: 400 });
    }

    const data = await generateAipifyHostsReferralLink(
      supabase,
      role as "host" | "service_provider" | "growth_partner",
    );
    return NextResponse.json(parseGenerateReferralLinkResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to generate referral link" }, { status: 500 });
  }
}
