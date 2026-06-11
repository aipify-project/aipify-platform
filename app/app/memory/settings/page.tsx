import { MemorySettingsPanel } from "@/components/app/memory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function MemorySettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <MemorySettingsPanel
      labels={{
        title: t("customerApp.memoryEngine.settingsTitle"),
        subtitle: t("customerApp.memoryEngine.settingsSubtitle"),
        loading: t("customerApp.memoryEngine.loading"),
        back: t("customerApp.memoryEngine.back"),
        enabled: t("customerApp.memoryEngine.settings.enabled"),
        autoLearn: t("customerApp.memoryEngine.settings.autoLearn"),
        includeUserPrefs: t("customerApp.memoryEngine.settings.includeUserPrefs"),
        includeTeamPatterns: t("customerApp.memoryEngine.settings.includeTeamPatterns"),
        includeTenantRules: t("customerApp.memoryEngine.settings.includeTenantRules"),
        explainability: t("customerApp.memoryEngine.settings.explainability"),
        governanceReview: t("customerApp.memoryEngine.settings.governanceReview"),
        retentionDays: t("customerApp.memoryEngine.settings.retentionDays"),
        neverStoreTitle: t("customerApp.memoryEngine.settings.neverStoreTitle"),
        neverStoreItems: t("customerApp.memoryEngine.settings.neverStoreItems"),
        privacy: t("customerApp.memoryEngine.privacy"),
      }}
    />
  );
}
