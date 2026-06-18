import { QualityReportsPanel } from "@/components/app/quality";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function QualityReportsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <QualityReportsPanel
      labels={{
        title: t("customerApp.quality.reportsTitle"),
        loading: t("customerApp.quality.loading"),
        empty: t("customerApp.quality.noReports"),
        generateReport: t("customerApp.quality.generateReport"),
        back: t("customerApp.quality.back"),
      }}
    />
  );
}
