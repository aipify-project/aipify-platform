import { NextResponse } from "next/server";
import {
  parseOrganizationalAssetItem,
  parseOrganizationalAssetList,
} from "@/lib/app-portal/organizational-assets";
import {
  appPortalAccessDeniedResponse,
  requireReadyAppPortalContext,
} from "@/lib/tenant/app-portal-route-access";
import { classifyAppPortalError } from "@/lib/tenant/resolve-app-organization-context";
import { createClient } from "@/lib/supabase/server";

function isDatabaseExecutionError(message: string): boolean {
  const lower = message.toLowerCase();
  return (
    lower.includes("read-only transaction") ||
    lower.includes("cannot execute insert") ||
    lower.includes("cannot execute update") ||
    lower.includes("cannot execute delete")
  );
}

function rpcErrorStatus(message: string, accessState: string): number {
  if (isDatabaseExecutionError(message)) return 500;
  const lower = message.toLowerCase();
  if (lower.includes("pgrst202") || lower.includes("could not find the function")) {
    return 503;
  }
  if (accessState === "unauthenticated") return 401;
  if (accessState === "subscription_inactive" || accessState === "license_inactive") return 402;
  if (accessState === "organization_missing" || accessState === "membership_missing") return 409;
  if (accessState === "entitlement_missing") return 403;
  if (accessState === "permission_missing") return 403;
  return 403;
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data: hasPermission, error: permissionError } = await supabase.rpc(
      "has_organization_permission",
      { p_permission_key: "organizational_assets.view" }
    );
    if (permissionError) {
      const access_state = classifyAppPortalError(permissionError.message);
      return NextResponse.json(
        { error: permissionError.message, access_state, found: false },
        { status: rpcErrorStatus(permissionError.message, access_state) }
      );
    }
    if (!hasPermission) {
      const { data: canManage } = await supabase.rpc("has_organization_permission", {
        p_permission_key: "organizational_assets.manage",
      });
      if (!canManage) {
        return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
      }
    }

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_organizational_assets", {
      p_asset_type: searchParams.get("asset_type") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_status: searchParams.get("status") || null,
      p_vendor: searchParams.get("vendor") || null,
      p_criticality: searchParams.get("criticality") || null,
      p_renewal_before: searchParams.get("renewal_before") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) {
      const access_state = classifyAppPortalError(error.message);
      console.error("[aipify/assets]", error.message);
      return NextResponse.json(
        { error: error.message, access_state, found: false },
        { status: rpcErrorStatus(error.message, access_state) }
      );
    }

    return NextResponse.json(parseOrganizationalAssetList(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load organizational assets";
    console.error("[aipify/assets]", message);
    return NextResponse.json({ error: message, found: false }, { status: 500 });
  }
}

type CreateBody = {
  asset_name?: string;
  asset_type?: string;
  description?: string;
  vendor?: string;
  purchase_date?: string;
  renewal_date?: string;
  renewal_reminder_date?: string;
  criticality_level?: string;
  internal_notes?: string;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const access = await requireReadyAppPortalContext(supabase);
    if (!access.ok) return access.response;

    const { data: canManage, error: permissionError } = await supabase.rpc(
      "has_organization_permission",
      { p_permission_key: "organizational_assets.manage" }
    );
    if (permissionError) {
      return NextResponse.json({ error: permissionError.message }, { status: 403 });
    }
    if (!canManage) {
      return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
    }

    const body = (await request.json()) as CreateBody;
    if (!body.asset_name?.trim()) return NextResponse.json({ error: "asset_name required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_organizational_asset", {
      p_asset_name: body.asset_name,
      p_asset_type: body.asset_type ?? "software_license",
      p_description: body.description ?? "",
      p_vendor: body.vendor ?? "",
      p_purchase_date: body.purchase_date ?? null,
      p_renewal_date: body.renewal_date ?? null,
      p_renewal_reminder_date: body.renewal_reminder_date ?? null,
      p_criticality_level: body.criticality_level ?? "moderate",
      p_internal_notes: body.internal_notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseOrganizationalAssetItem(data);
    return NextResponse.json({ created: true, asset: item });
  } catch {
    return NextResponse.json({ error: "Failed to create asset" }, { status: 500 });
  }
}
