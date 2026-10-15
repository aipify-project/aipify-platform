import { NextResponse } from "next/server";
import {
  evaluateSuperPortalDashboardAccess,
  mapSuperPortalDashboardAccessToResponse,
} from "@/lib/super-portal/dashboard-access";
import { NO_STORE_HEADERS } from "@/lib/super-portal/dashboard-access-constants";
import { parseSuperGlobalAuditCenter } from "@/lib/super-portal/parse";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const access = await evaluateSuperPortalDashboardAccess(supabase);
    if (!access.allowed) {
      return mapSuperPortalDashboardAccessToResponse(access);
    }

    const { data, error } = await supabase.rpc("get_super_global_audit_center");
    if (error) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const audit_logs = parseSuperGlobalAuditCenter(data);
    return NextResponse.json({ audit_logs }, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { error: "Failed to load global audit center" },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
