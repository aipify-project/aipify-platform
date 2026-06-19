import { AipifyCompanionBriefingBanner } from "@/components/app/briefing";
import { InstallDiscoveryCenterPanel } from "@/components/app/install-discovery";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { buildInstallDiscoveryLabels } from "@/lib/install-discovery/labels";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppInstallPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["settings", "dashboard"]);
  const t = createTranslator(dict);
  const labels = buildInstallDiscoveryLabels(t);

  return (
    <div className="space-y-4">
      <div className="px-6 pt-6">
        <AipifyCompanionBriefingBanner context="install" labels={buildCompanionBriefingLabels(t)} />
      </div>
      <InstallDiscoveryCenterPanel labels={labels} />
    </div>
  );
}
