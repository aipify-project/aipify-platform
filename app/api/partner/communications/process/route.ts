import { NextResponse } from "next/server";
import { processPartnerCommunicationOutbox } from "@/lib/core/partner-communications-email";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const result = await processPartnerCommunicationOutbox(supabase, 25);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process outbox";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
