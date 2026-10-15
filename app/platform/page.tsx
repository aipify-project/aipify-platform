import { PlatformPortalDashboardPanel } from "@/components/platform/platform-portal";
import { buildPlatformNavGroupConfig } from "@/lib/platform/build-nav";
import { buildPlatformPortalLabels } from "@/lib/platform-portal";
import { canRenderPlatformSuperAdminInsight } from "@/lib/super-portal/dashboard-access";
import { buildPlatformSuperAdminInsightLabels } from "@/lib/super-portal/platform-insight-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

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

  return (
    <PlatformPortalDashboardPanel
      labels={labels.dashboard}
      navGroups={navGroups}
      superAdminInsightLabels={superAdminInsightLabels}
    />
  );
}
