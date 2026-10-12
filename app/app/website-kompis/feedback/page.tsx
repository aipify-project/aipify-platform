import { WebsiteKompisFeedbackOverviewPanel } from "@/components/app/website-kompis/WebsiteKompisFeedbackOverviewPanel";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { buildWebsiteKompisFeedbackLabels } from "@/lib/website-kompis-feedback/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/** Web Q&A — existing feedback overview inside the wide product hub shell. */
export default async function WebsiteKompisFeedbackPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core", "portalStructure"]);
  const t = createTranslator(dict);
  const labels = buildWebsiteKompisFeedbackLabels(t);
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
        { label: t("customerApp.portalStructure.nav.kompisWebQa") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisWeb")}
      title={t("customerApp.portalStructure.nav.kompisWebQa")}
      description={t("customerApp.portalStructure.webHub.qaDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
      primaryAction={{
        label: t("customerApp.portalStructure.nav.kompisWebFaq"),
        href: FOUNDATION_NAV_BINDINGS.kompisWebFaq,
      }}
    >
      <WebsiteKompisFeedbackOverviewPanel labels={labels} embedded />
    </AppHubShell>
  );
}
