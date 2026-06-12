import { AipifyCompanionBriefingBanner } from "@/components/app/briefing";
import { TrustLicenseCenterPanel } from "@/components/app/license";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { buildLicenseCenterLabels } from "@/lib/app/license-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppLicensePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["license", "customerApp"]);
  const t = createTranslator(dict);

  return (
    <div className="space-y-4 p-6">
      <AipifyCompanionBriefingBanner context="license" labels={buildCompanionBriefingLabels(t)} />
      <TrustLicenseCenterPanel
        locale={locale}
        labels={buildLicenseCenterLabels(dict)}
      />
    </div>
  );
}
