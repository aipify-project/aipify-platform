import { NextResponse } from "next/server";
import { parsePackageFeatureAccess } from "@/lib/package-access";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { feature_key?: string };
    if (!body.feature_key) {
      return NextResponse.json({ error: "feature_key required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("check_package_feature_access", {
      p_feature_key: body.feature_key,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parsePackageFeatureAccess(data));
  } catch {
    return NextResponse.json({ error: "Failed to check feature access" }, { status: 500 });
  }
}
