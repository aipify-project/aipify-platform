import { NextResponse } from "next/server";
import { parseEnterpriseBillingProfile } from "@/lib/enterprise-invoicing";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("upsert_enterprise_billing_profile", {
      p_payload: body,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseEnterpriseBillingProfile(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to save billing profile" }, { status: 500 });
  }
}
