import { NextResponse } from "next/server";
import { parseEnvironmentRecommendations } from "@/lib/companion-device-environment";
import { getCompanionDeviceEnvironmentRecommendations } from "@/lib/core/companion-device-environment";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const data = await getCompanionDeviceEnvironmentRecommendations(supabase);
    const parsed = parseEnvironmentRecommendations(data);
    if (!parsed?.has_access) return NextResponse.json({ has_access: false });
    return NextResponse.json(parsed);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load recommendations";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
