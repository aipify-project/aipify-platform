import { NextRequest, NextResponse } from "next/server";
import { parseVocFeedbackCenter } from "@/lib/voice-of-the-customer";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const params = request.nextUrl.searchParams;
    const filters = {
      feedback_type: params.get("feedback_type") ?? undefined,
      workflow_status: params.get("workflow_status") ?? undefined,
      priority: params.get("priority") ?? undefined,
    };

    const { data, error } = await supabase.rpc("get_voc_feedback_center", { p_filters: filters });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const parsed = parseVocFeedbackCenter(data);
    if (!parsed) return NextResponse.json({ error: "Invalid response" }, { status: 500 });

    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json({ error: "Failed to load feedback center" }, { status: 500 });
  }
}
