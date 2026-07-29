import { PlatformLicensesOverviewPanel } from "@/components/platform/platform-portal/PlatformLicensesOverviewPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import { buildPlatformLicensesOverviewLabels } from "@/lib/platform-portal/labels";

export default async function PlatformLicensesOverviewPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);
  const labels = buildPlatformLicensesOverviewLabels(t);

  return <PlatformLicensesOverviewPanel labels={labels} locale={locale} />;
}
