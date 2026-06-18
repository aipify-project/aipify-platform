import { NextResponse } from "next/server";
import { parsePersonalizationAction } from "@/lib/aipify/companion-personalization-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("reset_companion_personalization");
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    const result = parsePersonalizationAction(data);
    if (!result.ok) return NextResponse.json({ error: result.error ?? "Failed" }, { status: 403 });
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Failed to reset personalization" }, { status: 500 });
  }
}
