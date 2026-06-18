import { NextResponse } from "next/server";
import { performAipifyHostsExecutiveAction } from "@/lib/core/aipify-hosts-executive-dashboard";
import { parseAipifyHostsExecutiveDashboardActionResult } from "@/lib/aipify/aipify-hosts-executive-dashboard/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action_type?: string;
      preferences?: Record<string, unknown>;
    };

    if (!body.action_type) {
      return NextResponse.json({ error: "action_type required" }, { status: 400 });
    }

    const data = await performAipifyHostsExecutiveAction(supabase, {
      actionType: body.action_type,
      preferences: body.preferences,
    });

    return NextResponse.json(parseAipifyHostsExecutiveDashboardActionResult(data));
  } catch {
    return NextResponse.json({ error: "Action failed" }, { status: 500 });
  }
}
