import { AppFoundationDashboard } from "@/components/app/foundation/AppFoundationDashboard";
import { buildFoundationDashboardLabels } from "@/lib/app/foundation-dashboard-labels";
import { createClient } from "@/lib/supabase/server";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { isModuleUsableInSnapshot } from "@/lib/core/access-control-plane";
import { loadRequestAccessControlPlaneSnapshot } from "@/lib/core/access-control-plane/load-snapshot-request";
import { loadWebsiteKompisEntitlementForAppTenant } from "@/lib/marketing/website-kompis-licensed-availability-server";
import { parseAppOrganizationContext } from "@/lib/tenant/resolve-app-organization-context";

/** Job 58 — owner foundation dashboard (replaces ECC wall as /app home). */
export default async function AppPortalHomePage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "core"]);
  const t = createTranslator(dict);
  const labels = buildFoundationDashboardLabels(t);

  let organizationName: string | null = null;
  let planLabel: string | null = null;
  let licenseStatusLabel: string | null = null;
  let websiteKompisAvailable: boolean | null = null;
  let kompisBedriftAvailable: boolean | null = null;

  try {
    const supabase = await createClient();
    const { data } = await supabase.rpc("get_app_organization_context");
    const context = parseAppOrganizationContext(data);
    if (context.state === "ready") {
      organizationName = context.workspace_name ?? context.licensed_to ?? null;
      planLabel = context.plan_name ?? null;
      licenseStatusLabel = context.license_status ?? null;
      websiteKompisAvailable = await loadWebsiteKompisEntitlementForAppTenant(
        supabase,
        context.customer_id
      );
      const snapshot = await loadRequestAccessControlPlaneSnapshot();
      kompisBedriftAvailable = isModuleUsableInSnapshot(snapshot, "kompis_bedrift");
    }
  } catch {
    websiteKompisAvailable = null;
    kompisBedriftAvailable = null;
  }

  return (
    <AppFoundationDashboard
      labels={labels}
      organizationName={organizationName}
      websiteKompisAvailable={websiteKompisAvailable}
      kompisBedriftAvailable={kompisBedriftAvailable}
      planLabel={planLabel}
      licenseStatusLabel={licenseStatusLabel}
    />
  );
}
