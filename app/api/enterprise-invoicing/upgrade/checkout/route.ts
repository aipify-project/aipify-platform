import { NextResponse } from "next/server";
import { parseEnterpriseUpgradeCheckout } from "@/lib/enterprise-invoicing";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const targetPackage = searchParams.get("target_package");
    if (!targetPackage) {
      return NextResponse.json({ error: "target_package required" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_enterprise_upgrade_checkout", {
      p_target_package: targetPackage,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseEnterpriseUpgradeCheckout(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load enterprise upgrade checkout" }, { status: 500 });
  }
}
