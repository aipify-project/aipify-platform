import { NextResponse } from "next/server";
import {
  parseExternalRelationshipItem,
  parseExternalRelationshipList,
} from "@/lib/app-portal/external-relationships";
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
      { p_permission_key: "external_relationships.view" }
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
        p_permission_key: "external_relationships.manage",
      });
      if (!canManage) {
        return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
      }
    }

    const { searchParams } = new URL(request.url);
    const { data, error } = await supabase.rpc("list_app_portal_external_relationships", {
      p_relationship_type: searchParams.get("relationship_type") || null,
      p_owner_id: searchParams.get("owner_id") || null,
      p_status: searchParams.get("status") || null,
      p_criticality: searchParams.get("criticality") || null,
      p_country: searchParams.get("country") || null,
      p_renewal_before: searchParams.get("renewal_before") || null,
      p_search: searchParams.get("search") || null,
    });
    if (error) {
      const access_state = classifyAppPortalError(error.message);
      console.error("[aipify/external-relationships]", error.message);
      return NextResponse.json(
        { error: error.message, access_state, found: false },
        { status: rpcErrorStatus(error.message, access_state) }
      );
    }

    return NextResponse.json(parseExternalRelationshipList(data));
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to load external relationships";
    console.error("[aipify/external-relationships]", message);
    return NextResponse.json({ error: message, found: false }, { status: 500 });
  }
}

type CreateBody = {
  organization_name?: string;
  relationship_type?: string;
  primary_contact?: string;
  secondary_contact?: string;
  email?: string;
  phone?: string;
  country?: string;
  criticality_level?: string;
  service_description?: string;
  contract_start_date?: string;
  contract_end_date?: string;
  renewal_reminder_date?: string;
  notes?: string;
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
      { p_permission_key: "external_relationships.manage" }
    );
    if (permissionError) {
      return NextResponse.json({ error: permissionError.message }, { status: 403 });
    }
    if (!canManage) {
      return appPortalAccessDeniedResponse("permission_missing", "permission_missing");
    }

    const body = (await request.json()) as CreateBody;
    if (!body.organization_name?.trim()) {
      return NextResponse.json({ error: "organization_name required" }, { status: 400 });
    }

    const { data, error } = await supabase.rpc("create_app_portal_external_relationship", {
      p_organization_name: body.organization_name,
      p_relationship_type: body.relationship_type ?? "supplier",
      p_primary_contact: body.primary_contact ?? "",
      p_secondary_contact: body.secondary_contact ?? "",
      p_email: body.email ?? "",
      p_phone: body.phone ?? "",
      p_country: body.country ?? "",
      p_criticality_level: body.criticality_level ?? "moderate",
      p_service_description: body.service_description ?? "",
      p_contract_start_date: body.contract_start_date ?? null,
      p_contract_end_date: body.contract_end_date ?? null,
      p_renewal_reminder_date: body.renewal_reminder_date ?? null,
      p_notes: body.notes ?? "",
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const item = parseExternalRelationshipItem(data);
    return NextResponse.json({ created: true, relationship: item });
  } catch {
    return NextResponse.json({ error: "Failed to create relationship" }, { status: 500 });
  }
}
