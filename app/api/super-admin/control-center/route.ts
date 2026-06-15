import { NextResponse } from "next/server";
import {
  buildEmptySuperAdminControlCenter,
  enrichSuperAdminControlCenterResponse,
  isSuperAdminAuthorizationError,
  isSuperAdminControlCenterRpcError,
} from "@/lib/super-admin/control-center-response";
import { parseSuperAdminControlCenter } from "@/lib/super-admin/parse";
import { buildSuperAdminSystemServices } from "@/lib/super-admin/system-services";
import { createClient } from "@/lib/supabase/server";

function buildResponse(center: ReturnType<typeof parseSuperAdminControlCenter>) {
  if (!center) return null;

  const enriched = enrichSuperAdminControlCenterResponse(center);
  return {
    ...enriched,
    system_services: buildSuperAdminSystemServices(),
    checked_at: new Date().toISOString(),
  };
}

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase.rpc("get_super_admin_control_center");

    if (error) {
      if (isSuperAdminAuthorizationError(error.message)) {
        return NextResponse.json({ error: "Super Admin access required" }, { status: 403 });
      }

      if (isSuperAdminControlCenterRpcError(error.message)) {
        const fallback = buildEmptySuperAdminControlCenter({
          setup_notice: true,
          data_state: "degraded",
        });
        return NextResponse.json({
          ...fallback,
          system_services: buildSuperAdminSystemServices(),
          checked_at: new Date().toISOString(),
        });
      }

      const fallback = buildEmptySuperAdminControlCenter({ data_state: "degraded" });
      return NextResponse.json({
        ...fallback,
        system_services: buildSuperAdminSystemServices(),
        checked_at: new Date().toISOString(),
      });
    }

    const parsed = parseSuperAdminControlCenter(data);
    if (!parsed) {
      return NextResponse.json({ error: "Super Admin access required" }, { status: 403 });
    }

    const payload = buildResponse(parsed);
    if (!payload) {
      return NextResponse.json({ error: "Super Admin access required" }, { status: 403 });
    }

    return NextResponse.json(payload);
  } catch {
    const fallback = buildEmptySuperAdminControlCenter({ data_state: "degraded" });
    return NextResponse.json({
      ...fallback,
      system_services: buildSuperAdminSystemServices(),
      checked_at: new Date().toISOString(),
    });
  }
}
