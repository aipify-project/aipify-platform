import { NextResponse } from "next/server";
import { scheduleAipifyHostsReport } from "@/lib/core/aipify-hosts-reports";
import { parseAipifyHostsReportScheduleResult } from "@/lib/aipify/aipify-hosts-reports/parse";
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
      cadence?: "daily" | "weekly" | "monthly";
      delivery_method?: "email" | "dashboard";
      export_format?: "pdf" | "excel" | "csv";
    };

    if (!body.category) return NextResponse.json({ error: "category required" }, { status: 400 });

    const data = await scheduleAipifyHostsReport(
      supabase,
      body.category,
      body.cadence ?? "weekly",
      body.delivery_method ?? "dashboard",
      body.export_format ?? "pdf",
    );
    return NextResponse.json(parseAipifyHostsReportScheduleResult(data));
  } catch {
    return NextResponse.json({ error: "Schedule failed" }, { status: 500 });
  }
}
