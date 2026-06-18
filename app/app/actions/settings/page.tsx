import { ActionHubSettingsPanel } from "@/components/app/action-hub";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function ActionsSettingsPage() {
  const dict = await getCustomerAppDictionaryForSplits(await getLocale(), ["dashboard"]);
  const t = createTranslator(dict);

  return (
    <ActionHubSettingsPanel
      labels={{
        title: t("customerApp.actionHub.settingsTitle"),
        subtitle: t("customerApp.actionHub.settingsSubtitle"),
        loading: t("customerApp.actionHub.loading"),
        back: t("customerApp.actionHub.back"),
        save: t("customerApp.actionHub.save"),
        settings: {
          enabled: t("customerApp.actionHub.settings.enabled"),
          auto_collect: t("customerApp.actionHub.settings.autoCollect"),
          auto_assign: t("customerApp.actionHub.settings.autoAssign"),
          require_approval_high_risk: t("customerApp.actionHub.settings.requireApproval"),
          include_support: t("customerApp.actionHub.settings.includeSupport"),
          include_quality: t("customerApp.actionHub.settings.includeQuality"),
          include_governance: t("customerApp.actionHub.settings.includeGovernance"),
          include_memory: t("customerApp.actionHub.settings.includeMemory"),
          include_knowledge: t("customerApp.actionHub.settings.includeKnowledge"),
          include_briefing: t("customerApp.actionHub.settings.includeBriefing"),
          include_desktop: t("customerApp.actionHub.settings.includeDesktop"),
        },
      }}
    />
  );
}
