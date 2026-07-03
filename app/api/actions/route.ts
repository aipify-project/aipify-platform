import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseActionRequests } from "@/lib/trust-action";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const { data, error } = await supabase.rpc("list_action_requests", {
      p_status: status,
    });

    if (error) return NextResponse.json({ error: error.message }, { status: 400 });

    const rawRows = Array.isArray(data) ? (data as Record<string, unknown>[]) : [];
    const actions = parseActionRequests(data).map((action) => {
      const row = rawRows.find((entry) => entry.id === action.id) ?? {};
      return {
        ...action,
        core_approval_id:
          typeof row.core_approval_id === "string" ? row.core_approval_id : null,
        correlation_id: typeof row.correlation_id === "string" ? row.correlation_id : null,
        latest_audit_id:
          typeof row.latest_audit_id === "string" ? row.latest_audit_id : null,
        scope_summary: typeof row.scope_summary === "string" ? row.scope_summary : null,
        access_mode: typeof row.access_mode === "string" ? row.access_mode : null,
        target_environment:
          typeof row.target_environment === "string" ? row.target_environment : null,
        execution_result:
          typeof row.execution_result === "string" ? row.execution_result : null,
        unchanged_summary:
          typeof row.unchanged_summary === "string" ? row.unchanged_summary : null,
        approved_by_display:
          typeof row.approved_by_display === "string" ? row.approved_by_display : null,
        approver_role_snapshot:
          typeof row.approver_role_snapshot === "string" ? row.approver_role_snapshot : null,
        expires_at: typeof row.expires_at === "string" ? row.expires_at : null,
      };
    });

    return NextResponse.json({ actions });
  } catch {
    return NextResponse.json({ error: "Failed to load actions" }, { status: 500 });
  }
}
