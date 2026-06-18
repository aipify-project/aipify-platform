import { NextResponse } from "next/server";
import { parseCommunicationPreferences } from "@/lib/aipify/notification-communication-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_communication_preferences");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseCommunicationPreferences(data));
  } catch {
    return NextResponse.json({ error: "Failed to load preferences" }, { status: 500 });
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
      preferred_channels?: string[];
      frequency?: string;
      quiet_hours?: Record<string, unknown>;
      category_subscriptions?: Record<string, boolean>;
      critical_bypass_quiet_hours?: boolean;
    };

    const { data, error } = await supabase.rpc("save_communication_preferences", {
      p_preferred_channels: body.preferred_channels ?? null,
      p_frequency: body.frequency ?? null,
      p_quiet_hours: body.quiet_hours ?? null,
      p_category_subscriptions: body.category_subscriptions ?? null,
      p_critical_bypass_quiet_hours: body.critical_bypass_quiet_hours ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save preferences" }, { status: 500 });
  }
}
