import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_executive_report_schedules");
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ schedules: data });
  } catch {
    return NextResponse.json({ error: "Failed to load schedules" }, { status: 500 });
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
      enabled?: boolean;
      delivery_channels?: string[];
    };

    const { data, error } = await supabase.rpc("save_executive_report_schedule", {
      p_reporting_period: body.reporting_period ?? "weekly",
      p_enabled: body.enabled ?? true,
      p_delivery_channels: body.delivery_channels ?? ["dashboard"],
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to save schedule" }, { status: 500 });
  }
}
