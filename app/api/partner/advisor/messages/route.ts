import { NextResponse } from "next/server";
import { getPartnerAdvisorMessages, postPartnerAdvisorMessage } from "@/lib/core/partner-advisor";
import { parsePartnerAdvisorMessages } from "@/lib/partner-advisor";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const url = new URL(request.url);
    const data = await getPartnerAdvisorMessages(supabase, {
      message_source: url.searchParams.get("message_source") ?? undefined,
      message_type: url.searchParams.get("message_type") ?? undefined,
      search: url.searchParams.get("search") ?? undefined,
    });

    const parsed = parsePartnerAdvisorMessages(data);
    if (!parsed) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { subject?: string; body?: string };
    const result = await postPartnerAdvisorMessage(
      supabase,
      body.subject ?? "",
      body.body ?? "",
    );
    if (!result.ok) {
      return NextResponse.json(result, { status: 400 });
    }
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
