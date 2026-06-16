import { NextResponse } from "next/server";
import { parseAppPortalFeatureAccess } from "@/lib/app-portal";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const feature = searchParams.get("feature") ?? "core";

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_app_portal_feature_access", {
      p_feature: feature,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseAppPortalFeatureAccess(data));
  } catch {
    return NextResponse.json({ error: "Failed to verify feature access" }, { status: 500 });
  }
}
