import { NextResponse } from "next/server";
import { updatePartnerComplianceProfile } from "@/lib/core/partner-compliance";
import { parsePartnerComplianceOverview } from "@/lib/partner-compliance";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = (await request.json()) as Record<string, unknown>;
    const data = await updatePartnerComplianceProfile(supabase, payload);
    const parsed = parsePartnerComplianceOverview(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
