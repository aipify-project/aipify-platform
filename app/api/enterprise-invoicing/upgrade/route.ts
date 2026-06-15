import { NextResponse } from "next/server";
import { parseEnterpriseUpgradeResult } from "@/lib/enterprise-invoicing";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("complete_enterprise_upgrade_with_invoice", {
      p_payload: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseEnterpriseUpgradeResult(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Enterprise upgrade failed" }, { status: 500 });
  }
}
