import { AppErrorState, AppContentWidth } from "@/components/app/design";
import { AppFoundationDashboard } from "@/components/app/foundation/AppFoundationDashboard";
import { buildFoundationDashboardLabels } from "@/lib/app/foundation-dashboard-labels";
import {
  buildWebsiteKompisConnectionAttention,
  resolveWelcomeGreetingHour,
} from "@/lib/app/foundation-home-attention";
import { createClient } from "@/lib/supabase/server";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { customerFacingPlanLabel } from "@/lib/app/foundation-product-card";
import { isModuleUsableInSnapshot } from "@/lib/core/access-control-plane";
import { loadRequestAccessControlPlaneSnapshot } from "@/lib/core/access-control-plane/load-snapshot-request";
import { loadWebsiteKompisEntitlementForAppTenant } from "@/lib/marketing/website-kompis-licensed-availability-server";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";
import { getDashboardProfile } from "@/lib/tenant/get-profile";
import { isGenericProfileName } from "@/lib/app/profile-display";
import { loadWebsiteKompisConnectionSummary } from "@/lib/website-kompis-connection/load-summary";

/** Authenticated APP Home — personal workspace overview (not Kompis Web). */
export default async function AppPortalHomePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "core"]);
  const t = createTranslator(dict);
  const labels = buildFoundationDashboardLabels(t);

  let organizationName: string | null = null;
  let profileName: string | null = null;
  let planLabel: string | null = null;
  let licenseStatusLabel: string | null = null;
  let websiteKompisAvailable: boolean | null = null;
  let kompisBedriftAvailable: boolean | null = null;
  let attentionItems = buildWebsiteKompisConnectionAttention(null, null);
  let criticalFailure = false;

  const greetingPeriod = resolveWelcomeGreetingHour(new Date().getUTCHours());

  try {
    const supabase = await createClient();
    const [orgResult, profile] = await Promise.all([
      supabase.rpc("get_app_organization_context"),
      getDashboardProfile(supabase),
    ]);

    if (orgResult.error) {
      criticalFailure = true;
    } else {
      const context = parseAppOrganizationContext(orgResult.data);
      if (context.state === "ready") {
        organizationName = context.workspace_name ?? context.licensed_to ?? null;
        planLabel = context.plan_name ?? null;
        licenseStatusLabel = context.license_status ?? null;
        try {
          websiteKompisAvailable = await loadWebsiteKompisEntitlementForAppTenant(
            supabase,
            context.customer_id
          );
        } catch {
          websiteKompisAvailable = null;
        }
        try {
          const snapshot = await loadRequestAccessControlPlaneSnapshot();
          kompisBedriftAvailable = isModuleUsableInSnapshot(snapshot, "kompis_bedrift");
        } catch {
          kompisBedriftAvailable = null;
        }

        if (websiteKompisAvailable === true) {
          try {
            const connection = await loadWebsiteKompisConnectionSummary(supabase);
            if (!connection.accessDenied) {
              attentionItems = buildWebsiteKompisConnectionAttention(
                websiteKompisAvailable,
                connection.summary.aggregate
              );
            }
          } catch {
            // Attention stays empty when connection summary cannot be read.
          }
        }
      }
    }

    const companyName = profile?.company.name ?? organizationName ?? "";
    const fullName = profile?.user.full_name?.trim() ?? "";
    if (fullName && !isGenericProfileName(fullName, companyName)) {
      profileName = fullName;
    }
  } catch {
    criticalFailure = true;
    websiteKompisAvailable = null;
    kompisBedriftAvailable = null;
  }

  if (criticalFailure) {
    return (
      <AppContentWidth className="relative">
        <AppErrorState
          title={labels.loadErrorTitle}
          description={labels.loadErrorDescription}
          retryLabel={labels.retryLabel}
          returnHref="/app"
          returnLabel={labels.retryLabel}
        />
      </AppContentWidth>
    );
  }

  return (
    <AppFoundationDashboard
      labels={labels}
      organizationName={organizationName}
      profileName={profileName}
      greetingPeriod={greetingPeriod}
      websiteKompisAvailable={websiteKompisAvailable}
      kompisBedriftAvailable={kompisBedriftAvailable}
      planLabel={customerFacingPlanLabel(planLabel)}
      licenseStatusLabel={customerFacingPlanLabel(licenseStatusLabel)}
      attentionItems={attentionItems}
      helpHref="/app/support/knowledge"
    />
  );
}
