import { QualitySettingsPanel } from "@/components/app/quality";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function QualitySettingsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
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
        scanningTitle: t("customerApp.quality.settingsScanningTitle"),
        imageScanning: t("customerApp.quality.imageScanning"),
        performanceScanning: t("customerApp.quality.performanceScanning"),
        mobileScanning: t("customerApp.quality.mobileScanning"),
        seoScanning: t("customerApp.quality.seoScanning"),
        localizationScanning: t("customerApp.quality.localizationScanning"),
        notifyOnHigh: t("customerApp.quality.notifyOnHigh"),
        notifyOnCritical: t("customerApp.quality.notifyOnCritical"),
        autoDeveloperReports: t("customerApp.quality.autoDeveloperReports"),
        imageWarningKb: t("customerApp.quality.imageWarningKb"),
        pageWeightWarningMb: t("customerApp.quality.pageWeightWarningMb"),
        autoFixDisabled: t("customerApp.quality.autoFixDisabled"),
      }}
    />
  );
}
