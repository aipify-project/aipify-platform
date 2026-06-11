import { QualityPerformancePanel } from "@/components/app/quality";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function QualityPerformancePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <QualityPerformancePanel
      labels={{
        title: t("customerApp.quality.performance.title"),
        subtitle: t("customerApp.quality.performance.subtitle"),
        loading: t("customerApp.quality.loading"),
        back: t("customerApp.quality.back"),
        page: t("customerApp.quality.performance.page"),
        viewport: t("customerApp.quality.performance.viewport"),
        weight: t("customerApp.quality.performance.weight"),
        loadTime: t("customerApp.quality.performance.loadTime"),
        requests: t("customerApp.quality.performance.requests"),
        jsWeight: t("customerApp.quality.performance.jsWeight"),
        layoutIssues: t("customerApp.quality.performance.layoutIssues"),
        noPages: t("customerApp.quality.performance.noPages"),
      }}
    />
  );
}
