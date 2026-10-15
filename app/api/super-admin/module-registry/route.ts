import { NextResponse } from "next/server";
import {
  evaluateSuperPortalDashboardAccess,
  mapSuperPortalDashboardAccessToResponse,
} from "@/lib/super-portal/dashboard-access";
import { NO_STORE_HEADERS } from "@/lib/super-portal/dashboard-access-constants";
import { parseSuperAdminModuleRegistryCenter } from "@/lib/module-registry";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabase = await createClient();
    const access = await evaluateSuperPortalDashboardAccess(supabase);
    if (!access.allowed) {
      return mapSuperPortalDashboardAccessToResponse(access);
    }

    const { data, error } = await supabase.rpc("get_super_admin_module_registry_center");
    if (error) {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403, headers: NO_STORE_HEADERS },
      );
    }
    return NextResponse.json(parseSuperAdminModuleRegistryCenter(data), {
      headers: NO_STORE_HEADERS,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load module registry" },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const access = await evaluateSuperPortalDashboardAccess(supabase);
    if (!access.allowed) {
      return mapSuperPortalDashboardAccessToResponse(access);
    }

    const body = (await request.json().catch(() => ({}))) as {
      action_type?: string;
      payload?: Record<string, unknown>;
    };
    const { data, error } = await supabase.rpc("perform_super_admin_module_registry_action", {
      p_action_type: body.action_type,
      p_payload: body.payload ?? {},
    });
    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400, headers: NO_STORE_HEADERS },
      );
    }
    return NextResponse.json(data, { headers: NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { error: "Action failed" },
      { status: 500, headers: NO_STORE_HEADERS },
    );
  }
}
