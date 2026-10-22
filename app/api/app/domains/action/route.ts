import { NextResponse } from "next/server";
import { performDomainLicenseAction } from "@/lib/domain-license";
import { domainActionPayload, domainActionRefusal } from "@/lib/domain-license/action-guard";
import { organizationMembershipCanManageDomains } from "@/lib/domain-license/membership-role";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { domainActionHttpError } from "@/lib/website-kompis-connection/provision-state";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { data: contextData, error: contextError } = await supabase.rpc(
      "get_app_organization_context",
    );
    if (contextError) {
      return NextResponse.json({ ok: false, code: "organization_context_required" }, { status: 403 });
    }
    const context = parseAppOrganizationContext(contextData);
    if (!organizationMembershipCanManageDomains(context)) {
      return NextResponse.json({ ok: false, code: "management_role_required" }, { status: 403 });
    }

    const body = (await request.json()) as { action_type?: string; payload?: Record<string, unknown> };
    const actionType = body.action_type ?? "";
    const refusal = domainActionRefusal(actionType);
    if (refusal) {
      return NextResponse.json({ ok: false, code: refusal }, { status: 409 });
    }
    const data = await performDomainLicenseAction(
      supabase,
      actionType,
      domainActionPayload(actionType, body.payload ?? {}),
    );
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    const mapped = domainActionHttpError(message);
    return NextResponse.json({ ok: false, code: mapped.code }, { status: mapped.status });
  }
}
