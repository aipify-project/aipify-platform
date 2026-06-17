import { NextResponse } from "next/server";
import { parsePersonalizationPreferences } from "@/lib/aipify/companion-personalization-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_companion_personalization_preferences", {
      p_category: searchParams.get("category") || null,
      p_status:   searchParams.get("status")   || null,
      p_search:   searchParams.get("search")   || null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePersonalizationPreferences(data));
  } catch {
    return NextResponse.json({ error: "Failed to load preferences" }, { status: 500 });
  }
}
