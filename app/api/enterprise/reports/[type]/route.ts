import { NextResponse } from "next/server";
import { parseEnterpriseReport } from "@/lib/aipify/enterprise-readiness-engine";
import { createClient } from "@/lib/supabase/server";

const REPORT_RPCS: Record<string, string> = {
  executive: "get_enterprise_executive_report",
  operational: "get_enterprise_operational_report",
  governance: "get_enterprise_governance_report",
  "audit-preparation": "get_enterprise_audit_preparation_report",
  audit_preparation: "get_enterprise_audit_preparation_report",
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ type: string }> }
) {
  try {
    const { type } = await context.params;
    const rpc = REPORT_RPCS[type];
    if (!rpc) return NextResponse.json({ error: "Unknown report type" }, { status: 400 });

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc(rpc);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseEnterpriseReport(data));
  } catch {
    return NextResponse.json({ error: "Failed to load report" }, { status: 500 });
  }
}
