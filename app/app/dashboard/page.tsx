import { WorkspaceDashboardPanel } from "@/components/app/workspace-dashboard/WorkspaceDashboardPanel";
import {
  buildWorkspaceDashboardLabels,
  loadWorkspaceDashboardBundle,
} from "@/lib/app-workspace-dashboard";
import { loadAppMenuCapabilityBundle } from "@/lib/core/app-menu-capability";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { buildWebsiteKompisConnectionAttention } from "@/lib/app/foundation-home-attention";
import { loadWebsiteKompisConnectionSummary } from "@/lib/website-kompis-connection/load-summary";
import { loadWebsiteKompisEntitlementForAppTenant } from "@/lib/marketing/website-kompis-licensed-availability-server";

/** Shared workspace control center — all entitled modules, tickets, partner KPIs. */
export default async function AppWorkspaceDashboardPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "core"]);
  const t = createTranslator(dict);
  const labels = buildWorkspaceDashboardLabels(t);

  const emptyBundle = await (async () => {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return {
        organizationName: null as string | null,
        planLabel: null as string | null,
        licenseStatusLabel: null as string | null,
        generatedAt: new Date().toISOString(),
        modules: [],
        activeModuleCount: 0,
        setupModuleCount: 0,
        tickets: {
          availability: "forbidden" as const,
          counts: {
            open: null,
            waitingAipify: null,
            waitingCustomer: null,
            resolved: null,
          },
          recent: [],
          lastUpdatedAt: null,
          listHref: "/app/support/requests",
          createHref: null,
          createEnabled: false,
          messageKey: "forbidden" as const,
        },
        partner: {
          availability: "not_authorized" as const,
          kpis: {
            registeredSales: null,
            pendingCommission: null,
            earnedCommission: null,
            payableCommission: null,
            currency: null,
          },
          partnerHref: null,
          lastUpdatedAt: null,
          messageKey: "not_authorized" as const,
        },
        attention: [],
      };
    }

    const [{ data: orgRaw }, capabilityBundle] = await Promise.all([
      supabase.rpc("get_app_organization_context"),
      loadAppMenuCapabilityBundle(supabase),
    ]);
    const context = parseAppOrganizationContext(orgRaw);
    let organizationName: string | null = null;
    let planLabel: string | null = null;
    let licenseStatusLabel: string | null = null;
    let webNeedsSetup = false;

    if (context.state === "ready") {
      organizationName = context.workspace_name ?? context.licensed_to ?? null;
      planLabel = context.plan_name ?? null;
      licenseStatusLabel = context.license_status ?? null;
      try {
        const webAvailable = await loadWebsiteKompisEntitlementForAppTenant(
          supabase,
          context.customer_id
        );
        if (webAvailable === true) {
          const connection = await loadWebsiteKompisConnectionSummary(supabase);
          if (!connection.accessDenied) {
            const attention = buildWebsiteKompisConnectionAttention(
              webAvailable,
              connection.summary.aggregate
            );
            webNeedsSetup = attention.length > 0;
          }
        }
      } catch {
        // Setup signal stays false when connection cannot be read.
      }
    }

    return loadWorkspaceDashboardBundle({
      supabase,
      userId: user.id,
      capabilityBundle,
      organizationName,
      planLabel,
      licenseStatusLabel,
      webNeedsSetup,
    });
  })();

  return (
    <WorkspaceDashboardPanel labels={labels} bundle={emptyBundle} locale={locale} />
  );
}
