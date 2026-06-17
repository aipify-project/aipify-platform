import { NextResponse } from "next/server";
import { parsePackValueExportResult } from "@/lib/app-portal/business-pack-value";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      format?: "pdf" | "excel" | "csv";
      report_type?: string;
      pack_key?: string;
    };

    const { data, error } = await supabase.rpc("export_app_portal_business_pack_value", {
      p_format: body.format ?? "csv",
      p_report_type: body.report_type ?? "executive",
      p_pack_key: body.pack_key ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parsePackValueExportResult(data));
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
