import { NextResponse } from "next/server";
import { parseValueReportExportPayload } from "@/lib/aipify/value-realization-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get("report_id");

    if (reportId) {
      const { data, error } = await supabase.rpc("export_value_report", { p_report_id: reportId });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(parseValueReportExportPayload(data));
    }

    const reportType = searchParams.get("report_type") ?? "value_realization";
    const { data, error } = await supabase.rpc("generate_value_report", { p_report_type: reportType });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to export value report" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { report_type?: string; report_id?: string };

    if (body.report_id) {
      const { data, error } = await supabase.rpc("export_value_report", { p_report_id: body.report_id });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(parseValueReportExportPayload(data));
    }

    const { data, error } = await supabase.rpc("generate_value_report", {
      p_report_type: body.report_type ?? "value_realization",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to generate value report" }, { status: 500 });
  }
}
