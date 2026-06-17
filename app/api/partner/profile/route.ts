import { NextResponse } from "next/server";
import { getPartnerPortalProfile } from "@/lib/core/partner-portal";
import { parsePartnerPortalProfile } from "@/lib/partner-portal";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getPartnerPortalProfile(supabase);
    const parsed = parsePartnerPortalProfile(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load partner profile" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const data = await import("@/lib/core/partner-portal").then((m) =>
      m.updatePartnerPortalProfile(supabase, body),
    );
    const parsed = parsePartnerPortalProfile(data);
    if (!parsed) return NextResponse.json({ has_access: false }, { status: 403 });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update partner profile";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
