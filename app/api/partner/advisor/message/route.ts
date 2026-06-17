import { NextResponse } from "next/server";
import { schedulePartnerAdvisorIntroduction } from "@/lib/core/partner-advisor";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json()) as { action?: string };
    if (body.action === "schedule_introduction") {
      const result = await schedulePartnerAdvisorIntroduction(supabase);
      if (!result.ok) {
        return NextResponse.json(result, { status: 400 });
      }
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch {
    return NextResponse.json({ error: "Failed to process advisor action" }, { status: 500 });
  }
}
