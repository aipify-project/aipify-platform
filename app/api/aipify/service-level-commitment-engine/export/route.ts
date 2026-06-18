import { NextResponse } from "next/server";
import { parseServiceCommitmentReportExportPayload } from "@/lib/aipify/service-level-commitment-engine/parse";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const reportType = searchParams.get("report_type") ?? "commitment_compliance";

    const { data, error } = await supabase.rpc("export_service_commitment_report", {
      p_report_type: reportType,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseServiceCommitmentReportExportPayload(data));
  } catch {
    return NextResponse.json({ error: "Failed to export commitment report" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { report_type?: string };

    const { data, error } = await supabase.rpc("export_service_commitment_report", {
      p_report_type: body.report_type ?? "commitment_compliance",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseServiceCommitmentReportExportPayload(data));
  } catch {
    return NextResponse.json({ error: "Failed to export commitment report" }, { status: 500 });
  }
}
