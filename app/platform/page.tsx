import { PlatformPortalDashboardPanel } from "@/components/platform/platform-portal";
import {
  PlatformControlPlaneMetricsStrip,
  PlatformControlPlaneSectionNav,
} from "@/components/platform/control-plane";
import { buildPlatformNavGroupConfig } from "@/lib/platform/build-nav";
import { buildPlatformControlPlaneLabels } from "@/lib/platform-control-plane";
import { buildPlatformPortalLabels } from "@/lib/platform-portal";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function PlatformPortalPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformPortalLabels(t);
  const controlPlaneLabels = buildPlatformControlPlaneLabels(t);
  const navGroups = buildPlatformNavGroupConfig(t);

  return (
    <div className="space-y-2">
      <div className="mx-auto w-full max-w-[1680px] px-6 pt-6">
        <PlatformControlPlaneMetricsStrip labels={controlPlaneLabels} />
      </div>
      <PlatformPortalDashboardPanel labels={labels.dashboard} navGroups={navGroups} />
      <div className="mx-auto w-full max-w-[1680px] px-6 pb-8">
        <PlatformControlPlaneSectionNav labels={controlPlaneLabels} navGroups={navGroups} />
      </div>
    </div>
  );
}
