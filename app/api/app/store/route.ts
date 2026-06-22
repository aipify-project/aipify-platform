import { NextResponse } from "next/server";
import { parseAppStoreHome } from "@/lib/app-store";
import {
  appPortalRpcErrorResponse,
  appPortalStableErrorCode,
  requireReadyAppPortalContext,
  rpcErrorStatus,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized", found: false }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const locale = new URL(request.url).searchParams.get("locale") ?? "en";
    const { data, error } = await supabase.rpc("get_app_store_home", { p_locale: locale });
    if (error) {
      return appPortalRpcErrorResponse("[app/store]", error.message);
    }
    return NextResponse.json(parseAppStoreHome(data) ?? { found: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load App Store";
    const access_state = classifyAppPortalError(message);
    return NextResponse.json(
      { error: appPortalStableErrorCode(access_state), access_state, found: false },
      { status: rpcErrorStatus(message, access_state) }
    );
  }
}
