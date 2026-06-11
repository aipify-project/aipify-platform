import { QualityMobilePanel } from "@/components/app/quality";
import { QUALITY_SEVERITIES } from "@/lib/aipify/quality";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function QualityMobilePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const severityLabels = Object.fromEntries(
    QUALITY_SEVERITIES.map((s) => [s, t(`customerApp.quality.severity.${s}`)])
  );

  return (
    <QualityMobilePanel
      severityLabels={severityLabels}
      labels={{
        title: t("customerApp.quality.mobile.title"),
        subtitle: t("customerApp.quality.mobile.subtitle"),
        loading: t("customerApp.quality.loading"),
        back: t("customerApp.quality.back"),
        suggestedFix: t("customerApp.quality.mobile.suggestedFix"),
        noIssues: t("customerApp.quality.mobile.noIssues"),
      }}
    />
  );
}
