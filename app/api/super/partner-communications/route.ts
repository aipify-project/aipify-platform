import { NextResponse } from "next/server";
import {
  getSuperPartnerCommunications,
  getSuperPartnerCommunicationTemplates,
  processPartnerCommunicationOutbox,
} from "@/lib/core/partner-communications-email";
import {
  parseSuperPartnerCommunications,
  parseSuperPartnerEmailTemplates,
} from "@/lib/partner-communications-email";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const section = searchParams.get("section");

    if (section === "templates") {
      const category = searchParams.get("category") ?? undefined;
      const data = await getSuperPartnerCommunicationTemplates(supabase, category);
      return NextResponse.json({ templates: parseSuperPartnerEmailTemplates(data) });
    }

    await processPartnerCommunicationOutbox(supabase, 10).catch(() => undefined);
    const overview = await getSuperPartnerCommunications(supabase);
    const templates = await getSuperPartnerCommunicationTemplates(supabase);

    return NextResponse.json({
      overview: parseSuperPartnerCommunications(overview),
      templates: parseSuperPartnerEmailTemplates(templates),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load partner communications";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
