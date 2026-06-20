import { NextResponse } from "next/server";
import {
  getNotificationOrchestrationCenter,
  parseNotificationOrchestrationCenter,
} from "@/lib/notification-orchestration";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const url = new URL(request.url);
    const data = await getNotificationOrchestrationCenter(supabase, url.searchParams.get("section") ?? undefined);
    return NextResponse.json(parseNotificationOrchestrationCenter(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load notification center";
    const access_state = classifyAppPortalError(message);
    return NextResponse.json(
      {
        error: message,
        access_state,
        found: false,
      },
      { status: 403 }
    );
  }
}
