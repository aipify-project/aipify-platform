import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Omnichannel triage entry point — delegates to ASO triage engine. */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      subject?: string;
      body?: string;
      channel?: string;
      customer_name?: string;
      language?: string;
    };

    const { data, error } = await supabase.rpc("triage_support_case", {
      p_subject: body.subject ?? "",
      p_body: body.body ?? "",
      p_channel: body.channel ?? "email",
      p_customer_name: body.customer_name ?? null,
      p_language: body.language ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Support triage failed" }, { status: 500 });
  }
}
