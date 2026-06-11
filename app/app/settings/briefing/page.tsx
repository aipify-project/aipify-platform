import { BriefingSettingsPanel } from "@/components/app/briefing";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BriefingSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <BriefingSettingsPanel
      labels={{
        title: t("customerApp.briefing.settingsTitle"),
        subtitle: t("customerApp.briefing.settingsSubtitle"),
        loading: t("customerApp.briefing.loading"),
        back: t("customerApp.briefing.back"),
        enabled: t("customerApp.briefing.enabled"),
        sinceLastLogin: t("customerApp.briefing.sinceLastLoginEnabled"),
        dailyBrief: t("customerApp.briefing.dailyBriefEnabled"),
        includeQuality: t("customerApp.briefing.includeQuality"),
        includeKnowledge: t("customerApp.briefing.includeKnowledge"),
        includeGovernance: t("customerApp.briefing.includeGovernance"),
        includeSupport: t("customerApp.briefing.includeSupport"),
        includeAutomation: t("customerApp.briefing.includeAutomation"),
        includeInsights: t("customerApp.briefing.includeInsights"),
        includeIntegrations: t("customerApp.briefing.includeIntegrations"),
        includeMemory: t("customerApp.briefing.includeMemory"),
        maxItems: t("customerApp.briefing.maxItems"),
        dailyTime: t("customerApp.briefing.dailyTime"),
      }}
    />
  );
}
