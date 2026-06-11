import { QualityScansPanel } from "@/components/app/quality";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function QualityScansPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <QualityScansPanel
      labels={{
        title: t("customerApp.quality.scansTitle"),
        loading: t("customerApp.quality.loading"),
        empty: t("customerApp.quality.noScans"),
        back: t("customerApp.quality.back"),
      }}
    />
  );
}
