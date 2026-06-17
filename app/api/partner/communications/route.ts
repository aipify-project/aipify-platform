import { NextResponse } from "next/server";
import {
  getPartnerCommunications,
  processPartnerCommunicationOutbox,
  updatePartnerCommunicationPreferences,
} from "@/lib/core/partner-communications-email";
import { parsePartnerCommunications } from "@/lib/partner-communications-email";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await processPartnerCommunicationOutbox(supabase, 10).catch(() => undefined);
    const data = await getPartnerCommunications(supabase);
    const parsed = parsePartnerCommunications(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load communications";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, boolean>;
    const data = await updatePartnerCommunicationPreferences(supabase, body);
    const parsed = parsePartnerCommunications(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update preferences";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
