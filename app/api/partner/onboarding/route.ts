import { NextResponse } from "next/server";
import { advancePartnerPortalOnboarding } from "@/lib/core/partner-portal";
import { parsePartnerPortalProfile } from "@/lib/partner-portal";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as { step?: string };
    const data = await advancePartnerPortalOnboarding(supabase, body.step);
    const parsed = parsePartnerPortalProfile(data);
    if (!parsed) return NextResponse.json({ has_access: false }, { status: 403 });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to advance onboarding";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
