import { NextResponse } from "next/server";
import {
  evaluateSuperPortalDashboardAccess,
  mapSuperPortalDashboardAccessToResponse,
} from "@/lib/super-portal/dashboard-access";
import { NO_STORE_HEADERS } from "@/lib/super-portal/dashboard-access-constants";
import {
  parsePlatformSuperRoleAccessOverview,
  toPlatformSuperRoleAccessResponseBody,
} from "@/lib/super-portal/platform-role-access";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const access = await evaluateSuperPortalDashboardAccess(supabase);
    if (!access.allowed) {
      return mapSuperPortalDashboardAccessToResponse(access);
    }

    const { data, error } = await supabase.rpc(
      "get_super_admin_role_permission_matrix_overview",
    );
    if (error) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    const overview = parsePlatformSuperRoleAccessOverview(data);
    if (!overview) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }

    return NextResponse.json(toPlatformSuperRoleAccessResponseBody(overview), {
      headers: NO_STORE_HEADERS,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load role access overview" },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
