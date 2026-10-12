import { ModulesAdminPanel } from "@/components/app/settings/ModulesAdminPanel";
import { AppHubShell } from "@/components/app/hubs/AppHubShell";
import { FOUNDATION_NAV_BINDINGS } from "@/lib/app-portal/foundation-nav/bindings";
import { hubCommon, hubT } from "@/lib/app-portal/hubs/hub-copy";
import {
  formatHubContextLine,
  resolveHubWorkspaceContext,
} from "@/lib/app-portal/hubs/resolve-workspace-context";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

/** Bedrift modules — read-only presentation via existing modules admin (no activation writes in this job). */
export default async function KompisBedriftModulesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["portalStructure", "settings"]);
  const t = createTranslator(dict);
  const common = hubCommon(t);
  const ctx = await resolveHubWorkspaceContext();

  return (
    <AppHubShell
      breadcrumb={[
        { label: common.home, href: FOUNDATION_NAV_BINDINGS.appHome },
        {
          label: t("customerApp.portalStructure.navGroups.kompisBedrift"),
          href: FOUNDATION_NAV_BINDINGS.kompisBedriftDashboard,
        },
        { label: t("customerApp.portalStructure.nav.kompisBedriftModules") },
      ]}
      eyebrow={t("customerApp.portalStructure.navGroups.kompisBedrift")}
      title={t("customerApp.portalStructure.nav.kompisBedriftModules")}
      description={hubT(t, "bedrift.modulesDescription")}
      contextLabel={formatHubContextLine(common, ctx)}
    >
      <ModulesAdminPanel
        labels={{
          title: t("customerApp.commercialPackages.modules.title"),
          subtitle: t("customerApp.commercialPackages.modules.subtitle"),
          loading: t("customerApp.commercialPackages.modules.loading"),
          back: t("customerApp.commercialPackages.modules.back"),
          viewBilling: t("customerApp.commercialPackages.modules.viewBilling"),
          empty: t("customerApp.commercialPackages.modules.empty"),
          enable: t("customerApp.commercialPackages.modules.enable"),
          disable: t("customerApp.commercialPackages.modules.disable"),
          sections: {
            installed: t("customerApp.commercialPackages.modules.sections.installed"),
            available: t("customerApp.commercialPackages.modules.sections.available"),
            trials: t("customerApp.commercialPackages.modules.sections.trials"),
            recommendations: t("customerApp.commercialPackages.modules.sections.recommendations"),
            packages: t("customerApp.commercialPackages.modules.sections.packages"),
            flags: t("customerApp.commercialPackages.modules.sections.flags"),
          },
        }}
      />
      <p className="text-sm text-aipify-text-secondary">{hubT(t, "bedrift.modulesAccountHint")}</p>
    </AppHubShell>
  );
}
