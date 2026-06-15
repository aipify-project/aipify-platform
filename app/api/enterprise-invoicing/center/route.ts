import { NextResponse } from "next/server";
import { parseEnterpriseInvoiceBillingCenter } from "@/lib/enterprise-invoicing";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const scope = searchParams.get("scope") === "platform" ? "platform" : "tenant";

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_enterprise_invoice_billing_center", {
      p_scope: scope,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseEnterpriseInvoiceBillingCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load enterprise billing center" }, { status: 500 });
  }
}
