import { NextResponse } from "next/server";
import {
  processPartnerCommunicationOutbox,
  queueSuperPartnerCommunicationTest,
  updateSuperPartnerCommunicationTemplate,
} from "@/lib/core/partner-communications-email";
import { parseSuperPartnerEmailTemplates } from "@/lib/partner-communications-email";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      template_id?: string;
      patch?: Record<string, unknown>;
    };
    if (!body.template_id || !body.patch) {
      return NextResponse.json({ error: "template_id and patch required" }, { status: 400 });
    }

    const data = await updateSuperPartnerCommunicationTemplate(
      supabase,
      body.template_id,
      body.patch,
    );
    return NextResponse.json({ templates: parseSuperPartnerEmailTemplates(data) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update template";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      template_key?: string;
      recipient_email?: string;
      org_id?: string;
      language?: string;
    };

    if (!body.template_key || !body.recipient_email) {
      return NextResponse.json({ error: "template_key and recipient_email required" }, { status: 400 });
    }

    const data = await queueSuperPartnerCommunicationTest(
      supabase,
      body.template_key,
      body.recipient_email,
      body.org_id,
      body.language,
    );
    await processPartnerCommunicationOutbox(supabase, 5).catch(() => undefined);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send test email";
    return NextResponse.json({ error: message }, { status: 403 });
  }
}
