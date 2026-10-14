import { AipifyCompanionBriefingBanner } from "@/components/app/briefing";
import { TrustLicenseCenterPanel } from "@/components/app/license";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { buildLicenseCenterLabels } from "@/lib/app/license-labels";
import { AppLayoutClasses } from "@/lib/design/app-layout";
import { getCustomerAppDictionaryForSplits, getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppLicensePage() {
  const locale = await getLocale();
  const dict = {
    ...(await getCustomerAppDictionaryForSplits(locale, ["dashboard", "companion"])),
    ...(await getDictionary(locale, ["license"])),
  };
  const t = createTranslator(dict);

  return (
    <div className={`${AppLayoutClasses.pageWidth} ${AppLayoutClasses.pagePaddingX} ${AppLayoutClasses.sectionGap} pb-10 pt-6`}>
      <AipifyCompanionBriefingBanner context="license" labels={buildCompanionBriefingLabels(t)} />
      <TrustLicenseCenterPanel
        locale={locale}
        labels={buildLicenseCenterLabels(dict)}
      />
    </div>
  );
}
