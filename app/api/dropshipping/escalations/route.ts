import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseDropshippingActionResult } from "@/lib/aipify/dropshipping-operations/parse";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supplierId = body.supplier_id as string;
    const issueSummary = body.issue_summary as string;
    if (!supplierId || !issueSummary) {
      return NextResponse.json({ error: "supplier_id and issue_summary are required" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("create_supplier_escalation", {
      p_supplier_id: supplierId,
      p_issue_summary: issueSummary,
      p_alternative_supplier: (body.alternative_supplier as string) ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseDropshippingActionResult(data));
  } catch {
    return NextResponse.json({ error: "Failed to create escalation" }, { status: 500 });
  }
}
