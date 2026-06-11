import { QualityIncidentsPanel } from "@/components/app/quality";
import { QUALITY_SEVERITIES } from "@/lib/aipify/quality";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function QualityIncidentsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const severityLabels = Object.fromEntries(
    QUALITY_SEVERITIES.map((s) => [s, t(`customerApp.quality.severity.${s}`)])
  );

  return (
    <QualityIncidentsPanel
      severityLabels={severityLabels}
      labels={{
        title: t("customerApp.quality.incidentsTitle"),
        loading: t("customerApp.quality.loading"),
        empty: t("customerApp.quality.noIncidents"),
        back: t("customerApp.quality.back"),
        resolve: t("customerApp.quality.resolve"),
        falsePositive: t("customerApp.quality.falsePositive"),
      }}
    />
  );
}
