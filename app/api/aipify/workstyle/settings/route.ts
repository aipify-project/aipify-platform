import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parsePersonalizationSettings } from "@/lib/aipify/workstyle/parse";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_personalization_settings");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePersonalizationSettings(data));
  } catch {
    return NextResponse.json({ error: "Failed to load personalization settings" }, { status: 500 });
  }
}
