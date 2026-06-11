import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { data, error } = await supabase.rpc("get_analytics_reports_list", { p_limit: 20 });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ reports: data });
  } catch {
    return NextResponse.json({ error: "Failed to load analytics reports" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as {
      report_type?: string;
      period_start?: string;
      period_end?: string;
    };

    const { data, error } = await supabase.rpc("create_analytics_report", {
      p_report_type: body.report_type ?? "weekly",
      p_period_start: body.period_start ?? null,
      p_period_end: body.period_end ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create analytics report" }, { status: 500 });
  }
}
