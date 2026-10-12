import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { renderAppPortalIntegrationsHubPage } from "@/lib/app-portal/render-pages";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/** Account integrations — reuses connected integrations hub (no connect/disconnect in this job). */
export default async function AccountIntegrationsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();
  const integrations = await renderAppPortalIntegrationsHubPage();

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        {
          label: t("customerApp.portalStructure.navGroups.account"),
          href: FOUNDATION_NAV_BINDINGS.accountHome,
        },
        { label: t("customerApp.portalStructure.nav.accountIntegrations") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.account")}
      title={t("customerApp.portalStructure.nav.accountIntegrations")}
      description={hubT(t, "account.integrationsDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
    >
      {integrations}
    </AppHubShell>
  );
}
