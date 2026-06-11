import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      custom_terminology?: unknown[];
      priorities?: unknown[];
      metadata?: Record<string, unknown>;
      disable_insights?: boolean;
    };

    if (body.disable_insights !== undefined) {
      const { data: disableData, error: disableError } = await supabase.rpc("disable_organization_industry_insights", {
        p_disabled: body.disable_insights,
      });
      if (disableError) return NextResponse.json({ error: disableError.message }, { status: 400 });
      if (!body.custom_terminology && !body.priorities && !body.metadata) {
        return NextResponse.json(disableData);
      }
    }

    const settings: Record<string, unknown> = {};
    if (body.custom_terminology) settings.custom_terminology = body.custom_terminology;
    if (body.priorities) settings.priorities = body.priorities;
    if (body.metadata) settings.metadata = body.metadata;

    if (Object.keys(settings).length === 0) {
      return NextResponse.json({ error: "No customization provided" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("customize_organization_industry_settings", {
      p_settings: settings,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to customize industry settings" }, { status: 500 });
  }
}
