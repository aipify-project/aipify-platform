import { QualityImagesPanel } from "@/components/app/quality";
import { QUALITY_SEVERITIES } from "@/lib/aipify/quality";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function QualityImagesPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const severityLabels = Object.fromEntries(
    QUALITY_SEVERITIES.map((s) => [s, t(`customerApp.quality.severity.${s}`)])
  );

  return (
    <QualityImagesPanel
      severityLabels={severityLabels}
      labels={{
        title: t("customerApp.quality.images.title"),
        subtitle: t("customerApp.quality.images.subtitle"),
        loading: t("customerApp.quality.loading"),
        back: t("customerApp.quality.back"),
        largestImages: t("customerApp.quality.images.largest"),
        imageIssues: t("customerApp.quality.images.issues"),
        url: t("customerApp.quality.images.url"),
        page: t("customerApp.quality.images.page"),
        size: t("customerApp.quality.images.size"),
        format: t("customerApp.quality.images.format"),
        alt: t("customerApp.quality.images.alt"),
        yes: t("customerApp.quality.images.yes"),
        no: t("customerApp.quality.images.no"),
        noImages: t("customerApp.quality.images.noImages"),
        noIssues: t("customerApp.quality.images.noIssues"),
      }}
    />
  );
}
