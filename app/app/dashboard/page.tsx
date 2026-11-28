import { AppContentWidth, AppErrorState } from "@/components/app/design";
import { WorkspaceDashboardPanel } from "@/components/app/workspace-dashboard/WorkspaceDashboardPanel";
import {
  buildWorkspaceDashboardLabels,
  loadWorkspaceDashboardBundle,
  presentWorkspaceLicenseStatusLabel,
  type WorkspaceDashboardBundle,
} from "@/lib/app-workspace-dashboard";
import { loadAppMenuCapabilityBundle } from "@/lib/core/app-menu-capability";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { createClient } from "@/lib/supabase/server";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { buildWebsiteKompisConnectionAttention } from "@/lib/app/foundation-home-attention";
import { loadWebsiteKompisConnectionSummary } from "@/lib/website-kompis-connection/load-summary";
import { loadWebsiteKompisEntitlementForAppTenant } from "@/lib/marketing/website-kompis-licensed-availability-server";

function emptyForbiddenBundle(): WorkspaceDashboardBundle {
  return {
    organizationName: null,
    planLabel: null,
    licenseStatusLabel: null,
    generatedAt: new Date().toISOString(),
    modules: [],
    activeModuleCount: 0,
    setupModuleCount: 0,
    tickets: {
      availability: "forbidden",
      countsPartial: false,
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
      messageKey: "forbidden",
    },
    partner: {
      availability: "not_authorized",
      kpis: {
        registeredSales: null,
        pendingCommission: null,
        earnedCommission: null,
        payableCommission: null,
        currency: null,
      },
      partnerHref: null,
      lastUpdatedAt: null,
      messageKey: "not_authorized",
    },
    attention: [],
  };
}

/** Shared workspace control center — modules, tickets, and authorized partner KPIs. */
export default async function AppWorkspaceDashboardPage() {
  const locale = await getLocale();
  const [customerDict, licenseDict] = await Promise.all([
    getCustomerAppDictionaryForSplits(locale, ["portalStructure", "core"]),
    getDictionary(locale, ["license"]),
  ]);
  const dict = { ...customerDict, ...licenseDict };
  const t = createTranslator(dict);
  const labels = buildWorkspaceDashboardLabels(t);

  let bundle: WorkspaceDashboardBundle | null = null;
  let criticalFailure = false;

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      bundle = emptyForbiddenBundle();
    } else {
      const [{ data: orgRaw, error: orgError }, capabilityBundle] = await Promise.all([
        supabase.rpc("get_app_organization_context"),
        loadAppMenuCapabilityBundle(supabase),
      ]);

      if (orgError) {
        criticalFailure = true;
      } else {
        const context = parseAppOrganizationContext(orgRaw);
        let organizationName: string | null = null;
        let planLabel: string | null = null;
        let licenseStatusLabel: string | null = null;
        let webNeedsSetup = false;

        if (context.state === "ready") {
          organizationName = context.workspace_name ?? context.licensed_to ?? null;
          planLabel = context.plan_name ?? null;
          licenseStatusLabel = presentWorkspaceLicenseStatusLabel(context.license_status, t);
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

        bundle = await loadWorkspaceDashboardBundle({
          supabase,
          userId: user.id,
          capabilityBundle,
          organizationName,
          planLabel,
          licenseStatusLabel,
          webNeedsSetup,
        });
      }
    }
  } catch {
    criticalFailure = true;
  }

  if (criticalFailure || !bundle) {
    return (
      <AppContentWidth className="relative">
        <AppErrorState
          title={labels.loadErrorTitle}
          description={labels.loadErrorDescription}
          retryLabel={labels.retryLabel}
          returnHref="/app/dashboard"
          returnLabel={labels.retryLabel}
        />
      </AppContentWidth>
    );
  }

  return (
    <WorkspaceDashboardPanel labels={labels} bundle={bundle} locale={locale} />
  );
}
