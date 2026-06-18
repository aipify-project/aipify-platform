import { NextResponse } from "next/server";
import { requestAipifyHostsReportExport } from "@/lib/core/aipify-hosts-reports";
import { parseAipifyHostsReportExportResult } from "@/lib/aipify/aipify-hosts-reports/parse";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      category?: string;
      format?: "pdf" | "excel" | "csv";
      filter?: string;
    };

    if (!body.category) return NextResponse.json({ error: "category required" }, { status: 400 });

    const data = await requestAipifyHostsReportExport(
      supabase,
      body.category,
      body.format ?? "pdf",
      body.filter ?? "last_30_days",
    );
    return NextResponse.json(parseAipifyHostsReportExportResult(data));
  } catch {
    return NextResponse.json({ error: "Export failed" }, { status: 500 });
  }
}
