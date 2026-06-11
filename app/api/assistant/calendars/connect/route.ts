import { NextResponse } from "next/server";
import { defaultPurposeForProvider, type CalendarProvider } from "@/lib/context-engine";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      provider?: string;
      display_name?: string;
      calendar_purpose?: string;
      permissions?: Record<string, unknown>;
    };

    const provider = String(body.provider ?? "").trim() as CalendarProvider;
    if (!provider) {
      return NextResponse.json({ error: "Provider required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("connect_calendar", {
      p_provider: provider,
      p_display_name: body.display_name ?? null,
      p_calendar_purpose:
        body.calendar_purpose ?? defaultPurposeForProvider(provider),
      p_permissions: body.permissions ?? null,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Calendar connect failed" }, { status: 500 });
  }
}
