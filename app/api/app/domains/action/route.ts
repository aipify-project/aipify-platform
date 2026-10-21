import { NextResponse } from "next/server";
import { performDomainLicenseAction } from "@/lib/domain-license";
import { domainActionRefusal } from "@/lib/domain-license/action-guard";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { action_type?: string; payload?: Record<string, unknown> };
    const actionType = body.action_type ?? "";
    const refusal = domainActionRefusal(actionType);
    if (refusal) {
      return NextResponse.json({ ok: false, error: refusal }, { status: 409 });
    }
    const data = await performDomainLicenseAction(supabase, actionType, body.payload ?? {});
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Domain action failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
