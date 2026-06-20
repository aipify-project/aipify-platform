import { NextResponse } from "next/server";
import { parseResponsibilityItem, parseResponsibilityList } from "@/lib/app-portal/responsibilities";
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
      { p_permission_key: "responsibilities.view" }
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
        p_permission_key: "responsibilities.manage",
      });
      if (!canManage) {
        return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
      }
    }

    const { searchParams } = new URL(request.url);
    const hasBackup = searchParams.get("has_backup");
    const { data, error } = await supabase.rpc("list_app_portal_responsibilities", {
      p_area: searchParams.get("area") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_status: searchParams.get("status") || null,
      p_review_before: searchParams.get("review_before") || null,
      p_has_backup: hasBackup === "true" ? true : hasBackup === "false" ? false : null,
      p_related_module: searchParams.get("related_module") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) {
      const access_state = classifyAppPortalError(error.message);
      console.error("[aipify/responsibilities]", error.message);
      return NextResponse.json(
        { error: error.message, access_state, found: false },
        { status: rpcErrorStatus(error.message, access_state) }
      );
    }

    return NextResponse.json(parseResponsibilityList(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load responsibilities";
    console.error("[aipify/responsibilities]", message);
    return NextResponse.json({ error: message, found: false }, { status: 500 });
  }
}

type CreateBody = {
  title?: string;
  description?: string;
  area?: string;
  primary_owner_id?: string;
  backup_owner_id?: string;
  review_frequency?: string;
  notes?: string;
  related_module?: string;
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
      { p_permission_key: "responsibilities.manage" }
    );
    if (permissionError) {
      return NextResponse.json({ error: permissionError.message }, { status: 403 });
    }
    if (!canManage) {
      return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
    }

    const body = (await request.json()) as CreateBody;
    if (!body.title?.trim()) return NextResponse.json({ error: "title required" }, { status: 400 });

    const { data, error } = await supabase.rpc("create_app_portal_responsibility", {
      p_title: body.title,
      p_description: body.description ?? "",
      p_area: body.area ?? "operations",
      p_primary_owner_id: body.primary_owner_id ?? null,
      p_backup_owner_id: body.backup_owner_id ?? null,
      p_review_frequency: body.review_frequency ?? null,
      p_notes: body.notes ?? "",
      p_related_module: body.related_module ?? null,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseResponsibilityItem(data);
    return NextResponse.json({ created: true, responsibility: item });
  } catch {
    return NextResponse.json({ error: "Failed to create responsibility" }, { status: 500 });
  }
}
