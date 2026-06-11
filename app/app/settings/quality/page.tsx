import { QualitySettingsPanel } from "@/components/app/quality";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function QualitySettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <QualitySettingsPanel
      labels={{
        title: t("customerApp.quality.settingsTitle"),
        subtitle: t("customerApp.quality.settingsSubtitle"),
        loading: t("customerApp.quality.loading"),
        back: t("customerApp.quality.back"),
        observationMode: t("customerApp.quality.observationMode"),
        notifyDevelopers: t("customerApp.quality.notifyDevelopers"),
        openKnowledgeGaps: t("customerApp.quality.openKnowledgeGaps"),
        autoFixDisabled: t("customerApp.quality.autoFixDisabled"),
      }}
    />
  );
}
