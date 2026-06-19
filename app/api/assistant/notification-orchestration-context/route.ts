import { NextRequest, NextResponse } from "next/server";
import { getCompanionNotificationOrchestrationContext } from "@/lib/notification-orchestration";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const q = request.nextUrl.searchParams.get("q") ?? undefined;
    const data = await getCompanionNotificationOrchestrationContext(supabase, q);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to load notification context" },
      { status: 500 },
    );
  }
}
