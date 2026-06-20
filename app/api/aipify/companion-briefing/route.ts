import { NextResponse } from "next/server";
import { isCompanionBriefingContext } from "@/lib/aipify/briefing/contexts";
import { parseCompanionContextBriefing } from "@/lib/aipify/briefing/parse";
import {
  isDatabaseExecutionError,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const context = searchParams.get("context") ?? "home";

    if (!isCompanionBriefingContext(context)) {
      return NextResponse.json({ error: "Invalid briefing context" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_companion_context_briefing", {
      p_context: context,
    });
    if (error) {
      const access_state = isDatabaseExecutionError(error.message)
        ? "database_execution_error"
        : classifyAppPortalError(error.message);
      console.error("[aipify/companion-briefing]", error.message);
      return NextResponse.json(
        { error: error.message, access_state, found: false },
        { status: rpcErrorStatus(error.message, access_state) }
      );
    }

    return NextResponse.json(parseCompanionContextBriefing(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load companion briefing";
    const access_state = isDatabaseExecutionError(message)
      ? "database_execution_error"
      : classifyAppPortalError(message);
    console.error("[aipify/companion-briefing]", message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
