import { NextResponse } from "next/server";
import { parseOrganizationalDecisionReportExport } from "@/lib/aipify/organizational-decision-support-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const decisionId = searchParams.get("decision_id");

    const { data, error } = await supabase.rpc("export_decision_report", {
      p_decision_id: decisionId ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationalDecisionReportExport(data));
  } catch {
    return NextResponse.json({ error: "Failed to export decision report" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { decision_id?: string };

    const { data, error } = await supabase.rpc("export_decision_report", {
      p_decision_id: body.decision_id ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseOrganizationalDecisionReportExport(data));
  } catch {
    return NextResponse.json({ error: "Failed to export decision report" }, { status: 500 });
  }
}
