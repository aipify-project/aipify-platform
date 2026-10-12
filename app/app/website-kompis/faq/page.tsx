import { WebsiteKompisFaqAdminPanel } from "@/components/app/website-kompis/WebsiteKompisFaqAdminPanel";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildWebsiteKompisFaqLabels } from "@/lib/website-kompis-faq/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/** Public Web FAQ admin — existing panel; frozen retrieval runtime untouched. */
export default async function WebsiteKompisFaqPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core", "portalStructure"]);
  const t = createTranslator(dict);
  const labels = buildWebsiteKompisFaqLabels(t);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        {
          label: t("customerApp.portalStructure.navGroups.kompisWeb"),
          href: FOUNDATION_NAV_BINDINGS.kompisWebDashboard,
        },
        { label: t("customerApp.portalStructure.nav.kompisWebFaq") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
      title={t("customerApp.portalStructure.nav.kompisWebFaq")}
      description={t("customerApp.portalStructure.webHub.faqDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
      primaryAction={{
        label: t("customerApp.portalStructure.nav.kompisWebQa"),
        href: FOUNDATION_NAV_BINDINGS.kompisWebQa,
      }}
    >
      <WebsiteKompisFaqAdminPanel labels={labels} embedded />
    </AppHubShell>
  );
}
