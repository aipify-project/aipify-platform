import { PlatformPortalDashboardPanel } from "@/components/platform/platform-portal";
import { buildPlatformNavGroupConfig } from "@/lib/platform/build-nav";
import { buildPlatformPortalLabels } from "@/lib/platform-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformPortalPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformPortalLabels(t);
  const navGroups = buildPlatformNavGroupConfig(t);

  return (
    <PlatformPortalDashboardPanel labels={labels.dashboard} navGroups={navGroups} />
  );
}
