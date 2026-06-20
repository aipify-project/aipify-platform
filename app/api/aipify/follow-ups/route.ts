import { NextResponse } from "next/server";
import { parseFollowUpList } from "@/lib/app-portal/follow-ups";
import {
  appPortalRpcErrorResponse,
  isDatabaseExecutionError,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { searchParams } = new URL(request.url);
    const ownerId = searchParams.get("owner_id");
    const { data, error } = await supabase.rpc("list_app_portal_follow_ups", {
      p_category: searchParams.get("category") || null,
      p_owner_id: ownerId || null,
      p_status: searchParams.get("status") || null,
      p_priority: searchParams.get("priority") || null,
      p_overdue_only: searchParams.get("overdue_only") === "true",
    });
    if (error) {
      if (isDatabaseExecutionError(error.message)) {
        return NextResponse.json(
          { error: error.message, access_state: "database_execution_error", found: false },
          { status: 500 }
        );
      }
      return appPortalRpcErrorResponse("[aipify/follow-ups]", error.message);
    }
    return NextResponse.json(parseFollowUpList(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load follow-ups";
    const access_state = classifyAppPortalError(message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const body = (await request.json()) as {
      title?: string;
      category?: string;
      priority?: string;
      assigned_owner_id?: string;
      due_at?: string;
      related_module?: string;
      suggested_next_action?: string;
      notes?: string;
      is_suggestion?: boolean;
    };

    const { data, error } = await supabase.rpc("create_app_portal_follow_up", {
      p_title: body.title ?? "",
      p_category: body.category ?? "internal_follow_up",
      p_priority: body.priority ?? "medium",
      p_assigned_owner_id: body.assigned_owner_id ?? null,
      p_due_at: body.due_at ?? null,
      p_related_module: body.related_module ?? null,
      p_suggested_next_action: body.suggested_next_action ?? null,
      p_notes: body.notes ?? "",
      p_is_suggestion: body.is_suggestion ?? false,
    });
    if (error) return appPortalRpcErrorResponse("[aipify/follow-ups]", error.message);
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to create follow-up";
    const access_state = classifyAppPortalError(message);
    return NextResponse.json(
      { error: message, access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
