import { createClient } from "@/lib/supabase/server";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

export type HubWorkspaceContext = {
  organizationName: string | null;
  planLabel: string | null;
  licenseStatusLabel: string | null;
};

/** Read-only org context for hub chrome — never invents license truth. */
export async function resolveHubWorkspaceContext(): Promise<HubWorkspaceContext> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_app_organization_context");
    const context = parseAppOrganizationContext(data);
    if (context.state !== "ready") {
      return { organizationName: null, planLabel: null, licenseStatusLabel: null };
    }
    return {
      organizationName: context.workspace_name ?? context.licensed_to ?? null,
      planLabel: context.plan_name ?? null,
      licenseStatusLabel: context.license_status ?? null,
    };
  } catch {
    return { organizationName: null, planLabel: null, licenseStatusLabel: null };
  }
}

export function formatHubContextLine(
  labels: { orgFallback: string },
  ctx: HubWorkspaceContext
): string {
  const name = ctx.organizationName?.trim() || labels.orgFallback;
  const parts = [name, ctx.planLabel, ctx.licenseStatusLabel].filter(Boolean);
  return parts.join(" · ");
}
