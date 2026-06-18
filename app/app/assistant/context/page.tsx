import { ContextDashboardPanel } from "@/components/app/assistant";
import { CONTEXT_MODES, PROACTIVE_ASSISTANCE_LEVELS } from "@/lib/context-engine";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppAssistantContextPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);

  const mapKeys = <K extends string>(keys: readonly K[], prefix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`customerApp.contextEngine.${prefix}.${k}`)])) as Record<
      K,
      string
    >;

  return (
    <ContextDashboardPanel
      locale={locale}
      labels={{
        title: t("customerApp.contextEngine.title"),
        subtitle: t("customerApp.contextEngine.subtitle"),
        loading: t("customerApp.contextEngine.loading"),
        back: t("customerApp.contextEngine.back"),
        save: t("customerApp.contextEngine.save"),
        saved: t("customerApp.contextEngine.saved"),
        privacy: t("customerApp.contextEngine.privacy"),
        analyze: t("customerApp.contextEngine.analyze"),
        viewCalendars: t("customerApp.contextEngine.viewCalendars"),
        sections: {
          mode: t("customerApp.contextEngine.sections.mode"),
          calendars: t("customerApp.contextEngine.sections.calendars"),
          briefing: t("customerApp.contextEngine.sections.briefing"),
          evening: t("customerApp.contextEngine.sections.evening"),
          events: t("customerApp.contextEngine.sections.events"),
          tasks: t("customerApp.contextEngine.sections.tasks"),
          conflicts: t("customerApp.contextEngine.sections.conflicts"),
          workload: t("customerApp.contextEngine.sections.workload"),
          suggestions: t("customerApp.contextEngine.sections.suggestions"),
          proactive: t("customerApp.contextEngine.sections.proactive"),
          settings: t("customerApp.contextEngine.sections.settings"),
        },
        settings: {
          contextMode: t("customerApp.contextEngine.settings.contextMode"),
          proactive: t("customerApp.contextEngine.settings.proactive"),
          dailyBriefing: t("customerApp.contextEngine.settings.dailyBriefing"),
          eveningReview: t("customerApp.contextEngine.settings.eveningReview"),
          conflicts: t("customerApp.contextEngine.settings.conflicts"),
          cognitiveLoad: t("customerApp.contextEngine.settings.cognitiveLoad"),
        },
        contextModes: mapKeys(CONTEXT_MODES, "contextModes"),
        proactiveLevels: mapKeys(PROACTIVE_ASSISTANCE_LEVELS, "proactiveLevels"),
        workloadLevels: {
          high: t("customerApp.contextEngine.workloadLevels.high"),
          moderate: t("customerApp.contextEngine.workloadLevels.moderate"),
          low: t("customerApp.contextEngine.workloadLevels.low"),
        },
        empty: t("customerApp.contextEngine.empty"),
      }}
    />
  );
}
