import { NextResponse } from "next/server";
import { parsePersonalizationDashboard } from "@/lib/aipify/companion-personalization-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("get_companion_personalization_dashboard", {
      p_category:   searchParams.get("category")   || null,
      p_source:     searchParams.get("source")     || null,
      p_confidence: searchParams.get("confidence") || null,
      p_status:     searchParams.get("status")     || null,
      p_date_from:  searchParams.get("date_from")  || null,
      p_search:     searchParams.get("search")     || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePersonalizationDashboard(data));
  } catch {
    return NextResponse.json({ error: "Failed to load personalization" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as Record<string, unknown>;
    const { data, error } = await supabase.rpc("update_companion_personalization", {
      p_briefing_style:        body.briefing_style        ?? null,
      p_notification_style:    body.notification_style    ?? null,
      p_companion_personality: body.companion_personality ?? null,
      p_adaptation_level:      body.adaptation_level      ?? null,
      p_preferred_language:    body.preferred_language    ?? null,
      p_secondary_language:    body.secondary_language    ?? null,
      p_report_language:       body.report_language       ?? null,
      p_notification_language: body.notification_language ?? null,
      p_learning_preference:   body.learning_preference   ?? null,
      p_notify_email:          typeof body.notify_email === "boolean" ? body.notify_email : null,
      p_notify_desktop:        typeof body.notify_desktop === "boolean" ? body.notify_desktop : null,
      p_notify_mobile:         typeof body.notify_mobile === "boolean" ? body.notify_mobile : null,
      p_notify_in_app:         typeof body.notify_in_app === "boolean" ? body.notify_in_app : null,
      p_communication_styles:  Array.isArray(body.communication_styles) ? body.communication_styles as string[] : null,
      p_pref_id:               body.pref_id               ?? null,
      p_pref_status:           body.pref_status           ?? null,
      p_pref_value:            body.pref_value            ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to update personalization" }, { status: 500 });
  }
}
