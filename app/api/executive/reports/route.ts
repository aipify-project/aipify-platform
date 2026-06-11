import { NextResponse } from "next/server";
import { parseExecutiveReport } from "@/lib/aipify/executive-insights-engine";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("list_executive_reports", { p_limit: 20 });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ reports: data });
  } catch {
    return NextResponse.json({ error: "Failed to load executive reports" }, { status: 500 });
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
      reporting_period?: string;
    };

    const { data, error } = await supabase.rpc("generate_executive_report", {
      p_reporting_period: body.reporting_period ?? "weekly",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseExecutiveReport(data));
  } catch {
    return NextResponse.json({ error: "Failed to generate executive report" }, { status: 500 });
  }
}
