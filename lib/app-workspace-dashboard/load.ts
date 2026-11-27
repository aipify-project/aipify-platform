import type { SupabaseClient } from "@supabase/supabase-js";
import { APP_SOFTWARE_MODULE_MANIFESTS } from "@/lib/app-module-manifest";
import { resolveSoftwareModuleAccess } from "@/lib/app-module-manifest/resolve";
import { userHasCspPartnerAccess } from "@/lib/certified-sales-partner/partner-access";
import { callCspRpc } from "@/lib/certified-sales-partner/core-rpc";
import type { AppMenuCapabilityBundle } from "@/lib/core/app-menu-capability";
import { buildWorkspacePartnerSummary } from "./partner-summary";
import { buildWorkspaceTicketSummary } from "./ticket-summary";
import type { WorkspaceDashboardBundle } from "./types";

export async function loadWorkspaceDashboardBundle(input: {
  supabase: SupabaseClient;
  userId: string;
  capabilityBundle: AppMenuCapabilityBundle;
  organizationName: string | null;
  planLabel: string | null;
  licenseStatusLabel: string | null;
  webNeedsSetup?: boolean;
}): Promise<WorkspaceDashboardBundle> {
  const partnerAuthorized = await userHasCspPartnerAccess(
    input.supabase,
    input.userId
  ).catch(() => false);

  const modulesResolved = resolveSoftwareModuleAccess({
    bundle: input.capabilityBundle,
    salesPartnerAuthorized: partnerAuthorized,
    webNeedsSetup: input.webNeedsSetup,
  });

  const modules = modulesResolved
    .filter((m) => m.entitled || m.state === "setup_required")
    .map((m) => {
      const manifest = APP_SOFTWARE_MODULE_MANIFESTS.find(
        (row) => row.moduleKey === m.moduleKey
      )!;
      return {
        moduleKey: m.moduleKey,
        state: m.state,
        openHref: m.openHref,
        labelKey: manifest.labelKey,
      };
    });

  const [{ data: ticketData, error: ticketError }, partnerEconomy, partnerOverview] =
    await Promise.all([
      input.supabase.rpc("list_app_portal_support_requests", {
        p_category: null,
        p_status: null,
        p_priority: null,
        p_search: null,
      }),
      partnerAuthorized
        ? input.supabase.rpc("get_growth_partner_economy_overview").then(
            (result) => result,
            () => ({ data: null, error: { message: "economy_unavailable" } })
          )
        : Promise.resolve({ data: null, error: null }),
      partnerAuthorized
        ? callCspRpc(input.supabase, "csp_get_partner_overview").then(
            (result) => (result.ready ? result.data : null),
            () => null
          )
        : Promise.resolve(null),
    ]);

  const tickets = buildWorkspaceTicketSummary({
    listPayload: ticketError ? null : ticketData,
    listError: ticketError?.message ?? null,
    httpStatus: ticketError ? 403 : 200,
  });

  const partner = buildWorkspacePartnerSummary({
    authorized: partnerAuthorized,
    overviewPayload: partnerOverview,
    economyPayload: partnerEconomy.data,
    economyError: partnerEconomy.error?.message ?? null,
  });

  const attention: WorkspaceDashboardBundle["attention"] = [];
  for (const mod of modules) {
    if (mod.state === "setup_required" && mod.openHref) {
      attention.push({
        id: `setup:${mod.moduleKey}`,
        titleKey: "attentionModuleSetup",
        href: mod.openHref,
      });
    }
  }
  if (
    tickets.availability === "available" &&
    tickets.counts.waitingCustomer != null &&
    tickets.counts.waitingCustomer > 0
  ) {
    attention.push({
      id: "tickets:waiting_customer",
      titleKey: "attentionTicketsWaitingCustomer",
      href: tickets.listHref,
    });
  }

  return {
    organizationName: input.organizationName,
    planLabel: input.planLabel,
    licenseStatusLabel: input.licenseStatusLabel,
    generatedAt: new Date().toISOString(),
    modules,
    activeModuleCount: modules.filter((m) => m.state === "active").length,
    setupModuleCount: modules.filter((m) => m.state === "setup_required").length,
    tickets,
    partner,
    attention,
  };
}
