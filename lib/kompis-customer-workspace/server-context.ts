import type { SupabaseClient } from "@supabase/supabase-js";
import { requireReadyAppPortalContext } from "@/lib/tenant/app-portal-route-access";
import { parseKompisCustomerWorkspaceContract } from "./parse";
import { resolveKompisWorkspacePermissions } from "./permissions";
import type { KompisCustomerWorkspaceContract, KompisWorkspacePermissions } from "./types";

export type KompisServerWorkspaceBundle = {
  organizationId: string;
  companyId: string;
  organizationName: string;
  userRole: string;
  accessTier: string;
  contract: KompisCustomerWorkspaceContract | null;
  contractEnabled: boolean;
  contractStatus: string;
  permissions: KompisWorkspacePermissions;
};

export async function loadKompisServerWorkspaceBundle(
  supabase: SupabaseClient,
  opts: { route: string; module?: string; locale: string }
): Promise<
  | { ok: true; bundle: KompisServerWorkspaceBundle }
  | { ok: false; status: number; error: string }
> {
  const access = await requireReadyAppPortalContext(supabase);
  if (!access.ok) {
    return { ok: false, status: 403, error: "Organization context unavailable" };
  }

  const org = access.context;
  const organizationId = org.organization_id ?? org.company_id;
  const companyId = org.company_id ?? org.organization_id;
  if (!organizationId || !companyId) {
    return { ok: false, status: 403, error: "Organization binding missing" };
  }

  const { data, error } = await supabase.rpc("get_kompis_customer_workspace_contract");
  if (error) {
    return { ok: false, status: 403, error: error.message };
  }

  const row = data && typeof data === "object" ? (data as Record<string, unknown>) : {};
  const parsed =
    row.contract && typeof row.contract === "object"
      ? parseKompisCustomerWorkspaceContract(row.contract, { allowDraft: true })
      : null;

  const contract = parsed?.ok ? parsed.contract : null;
  const userRole = org.organization_role ?? org.user_role ?? "member";
  const accessTier = "standard";
  const route = opts.route.startsWith("/") ? opts.route : `/${opts.route}`;

  const permissions = contract
    ? resolveKompisWorkspacePermissions({
        contract,
        context: {
          surface: "authenticated_portal",
          route,
          module: opts.module ?? "account",
          user_role: userRole,
          access_tier: accessTier,
          entity_type: null,
        },
      })
    : {
        enabled: false,
        allowed_knowledge_sources: [],
        allowed_context_fields: [],
        allowed_tools: [],
        confirmation_levels: {},
        denied_reasons: ["contract_missing"],
        escalation_options: [],
        effective_locale_policy: {
          fallback_locale: "en",
          rtl_support: true,
          use_global_locale_list: true as const,
        },
        commercial_guidance_enabled: false,
        support_handoff_enabled: false,
      };

  return {
    ok: true,
    bundle: {
      organizationId,
      companyId,
      organizationName: org.workspace_name ?? org.licensed_to ?? "Organization",
      userRole,
      accessTier,
      contract,
      contractEnabled: row.enabled === true,
      contractStatus: String(row.status ?? "missing"),
      permissions,
    },
  };
}
