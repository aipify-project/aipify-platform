import { PlatformPortalDashboardPanel } from "@/components/platform/platform-portal";
import {
  PlatformTrafficStatusBar,
  type PlatformTrafficStatusLabels,
} from "@/components/platform/platform-portal/PlatformTrafficStatusBar";
import { PlatformLayoutClasses } from "@/lib/design";
import { buildPlatformNavGroupConfig } from "@/lib/platform/build-nav";
import { buildPlatformPortalLabels } from "@/lib/platform-portal";
import { loadPlatformTrafficStatus } from "@/lib/platform-portal/load-traffic-status";
import { canRenderPlatformSuperAdminInsight } from "@/lib/super-portal/dashboard-access";
import { buildPlatformSuperAdminInsightLabels } from "@/lib/super-portal/platform-insight-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

function trafficStatusLabels(t: (key: string) => string): PlatformTrafficStatusLabels {
  return {
    region: t("platform.trafficStatus.region"),
    operational: t("platform.trafficStatus.operational"),
    operationalHint: t("platform.trafficStatus.operationalHint"),
    newAppCustomers: t("platform.trafficStatus.newAppCustomers"),
    newAppCustomersHint: t("platform.trafficStatus.newAppCustomersHint"),
    newSellers: t("platform.trafficStatus.newSellers"),
    newSellersHint: t("platform.trafficStatus.newSellersHint"),
    appCustomersOnline: t("platform.trafficStatus.appCustomersOnline"),
    sellersOnline: t("platform.trafficStatus.sellersOnline"),
    signedInUsers: t("platform.trafficStatus.signedInUsers"),
    visitors: t("platform.trafficStatus.visitors"),
    notMeasured: t("platform.trafficStatus.notMeasured"),
    notMeasuredHint: t("platform.trafficStatus.notMeasuredHint"),
    unavailable: t("platform.trafficStatus.unavailable"),
    dayScope: t("platform.trafficStatus.dayScope"),
    lastChecked: t("platform.trafficStatus.lastChecked"),
  };
}

export default async function PlatformPortalPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformPortalLabels(t);
  const navGroups = buildPlatformNavGroupConfig(t);
  const showSuperAdminInsight = await canRenderPlatformSuperAdminInsight();
  const superAdminInsightLabels = showSuperAdminInsight
    ? buildPlatformSuperAdminInsightLabels(t)
    : null;
  const trafficStatus = await loadPlatformTrafficStatus();

  return (
    <div className={PlatformLayoutClasses.page}>
      <PlatformTrafficStatusBar
        status={trafficStatus}
        labels={trafficStatusLabels(t)}
        locale={locale}
      />
      <PlatformPortalDashboardPanel
        labels={labels.dashboard}
        navGroups={navGroups}
        locale={locale}
        superAdminInsightLabels={superAdminInsightLabels}
      />
    </div>
  );
}
