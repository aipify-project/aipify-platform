import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseComplianceReports } from "@/lib/aipify/security-compliance";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("list_compliance_reports");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ reports: parseComplianceReports(data?.reports ?? data) });
  } catch {
    return NextResponse.json({ error: "Failed to list reports" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const { data, error } = await supabase.rpc("generate_compliance_report", {
      p_report_type: body.report_type ?? "security_posture",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to generate report" }, { status: 500 });
  }
}
