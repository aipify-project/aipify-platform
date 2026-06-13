import { NextResponse } from "next/server";
import { parseAutomationControlDetail } from "@/lib/automation-control-center";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const entryKey = new URL(request.url).searchParams.get("entry_key");
    if (!entryKey) return NextResponse.json({ error: "entry_key required" }, { status: 400 });

    const { data, error } = await supabase.rpc("get_automation_control_detail", {
      p_entry_key: entryKey,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json(parseAutomationControlDetail(data));
  } catch {
    return NextResponse.json({ error: "Failed to load automation detail" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: "mark_reviewed" | "dismiss_recommendation";
      entry_key?: string;
      recommendation_key?: string;
    };

    if (body.action === "mark_reviewed" && body.entry_key) {
      const { data, error } = await supabase.rpc("mark_automation_control_reviewed", {
        p_entry_key: body.entry_key,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    if (body.action === "dismiss_recommendation" && body.recommendation_key) {
      const { data, error } = await supabase.rpc("dismiss_automation_control_recommendation", {
        p_recommendation_key: body.recommendation_key,
      });
      if (error) return NextResponse.json({ error: error.message }, { status: 400 });
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process automation control action" }, { status: 500 });
  }
}
