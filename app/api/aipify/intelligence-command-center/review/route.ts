import { NextResponse } from "next/server";
import { parseICCActionResult } from "@/lib/app-portal/intelligence-command-center";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as {
      action?: string;
      priority_id?: string;
      review_notes?: string;
    };

    const { data, error } = await supabase.rpc("review_app_portal_intelligence_command_center", {
      p_priority_id:  body.priority_id  ?? null,
      p_action:       body.action       ?? null,
      p_review_notes: body.review_notes ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 403 });
    return NextResponse.json(parseICCActionResult(data));
  } catch {
    return NextResponse.json({ error: "Review failed" }, { status: 500 });
  }
}
