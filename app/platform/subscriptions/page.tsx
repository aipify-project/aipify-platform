import { PlatformCustomerAgreementsOverviewPanel } from "@/components/platform/platform-portal/PlatformCustomerAgreementsOverviewPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPlatformCustomerAgreementsLabels } from "@/lib/platform-portal/labels";

export default async function PlatformCustomerAgreementsOverviewPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformCustomerAgreementsLabels(t);

  return <PlatformCustomerAgreementsOverviewPanel labels={labels} locale={locale} />;
}
