import { NextResponse } from "next/server";
import { performAipifyHostsUpgradeSignalAction } from "@/lib/core/aipify-hosts-upgrade-signals";
import { parseAipifyHostsUpgradeSignalActionResult } from "@/lib/aipify/aipify-hosts-upgrade-signals";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      recommendation_key?: string;
      signal_key?: string;
      payload?: Record<string, unknown>;
    };
    if (!body.action_type) return NextResponse.json({ error: "action_type required" }, { status: 400 });

    const data = await performAipifyHostsUpgradeSignalAction(supabase, {
      actionType: body.action_type,
      recommendationKey: body.recommendation_key,
      signalKey: body.signal_key,
      payload: body.payload,
    });
    return NextResponse.json(parseAipifyHostsUpgradeSignalActionResult(data));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Action failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
