import { AttentionDashboardPanel } from "@/components/app/assistant";
import {
  ATTENTION_STATES,
  FOCUS_PERIODS,
  INTERRUPTION_HANDLING,
  PROACTIVITY_LEVELS,
} from "@/lib/attention-guardian";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppAssistantAttentionPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const mapKeys = <K extends string>(keys: readonly K[], prefix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`customerApp.attentionGuardian.${prefix}.${k}`)])) as Record<
      K,
      string
    >;

  return (
    <AttentionDashboardPanel
      locale={locale}
      labels={{
        title: t("customerApp.attentionGuardian.title"),
        subtitle: t("customerApp.attentionGuardian.subtitle"),
        loading: t("customerApp.attentionGuardian.loading"),
        back: t("customerApp.attentionGuardian.back"),
        save: t("customerApp.attentionGuardian.save"),
        saved: t("customerApp.attentionGuardian.saved"),
        privacy: t("customerApp.attentionGuardian.privacy"),
        analyze: t("customerApp.attentionGuardian.analyze"),
        activateFocus: t("customerApp.attentionGuardian.activateFocus"),
        endFocus: t("customerApp.attentionGuardian.endFocus"),
        viewContext: t("customerApp.attentionGuardian.viewContext"),
        sections: {
          state: t("customerApp.attentionGuardian.sections.state"),
          briefing: t("customerApp.attentionGuardian.sections.briefing"),
          evening: t("customerApp.attentionGuardian.sections.evening"),
          focus: t("customerApp.attentionGuardian.sections.focus"),
          blocks: t("customerApp.attentionGuardian.sections.blocks"),
          weekly: t("customerApp.attentionGuardian.sections.weekly"),
          meetings: t("customerApp.attentionGuardian.sections.meetings"),
          energy: t("customerApp.attentionGuardian.sections.energy"),
          goals: t("customerApp.attentionGuardian.sections.goals"),
          recovery: t("customerApp.attentionGuardian.sections.recovery"),
          priorities: t("customerApp.attentionGuardian.sections.priorities"),
          activity: t("customerApp.attentionGuardian.sections.activity"),
          settings: t("customerApp.attentionGuardian.sections.settings"),
        },
        settings: {
          focusProtection: t("customerApp.attentionGuardian.settings.focusProtection"),
          proactivity: t("customerApp.attentionGuardian.settings.proactivity"),
          interruptions: t("customerApp.attentionGuardian.settings.interruptions"),
          energy: t("customerApp.attentionGuardian.settings.energy"),
          goalAlignment: t("customerApp.attentionGuardian.settings.goalAlignment"),
          meetings: t("customerApp.attentionGuardian.settings.meetings"),
          recovery: t("customerApp.attentionGuardian.settings.recovery"),
          dailyBriefing: t("customerApp.attentionGuardian.settings.dailyBriefing"),
          endOfDay: t("customerApp.attentionGuardian.settings.endOfDay"),
          tracking: t("customerApp.attentionGuardian.settings.tracking"),
          focusPeriod: t("customerApp.attentionGuardian.settings.focusPeriod"),
        },
        attentionStates: mapKeys(ATTENTION_STATES, "attentionStates"),
        focusPeriods: mapKeys(FOCUS_PERIODS, "focusPeriods"),
        interruptionHandling: mapKeys(INTERRUPTION_HANDLING, "interruptionHandling"),
        proactivityLevels: mapKeys(PROACTIVITY_LEVELS, "proactivityLevels"),
        empty: t("customerApp.attentionGuardian.empty"),
        focusActive: t("customerApp.attentionGuardian.focusActive"),
      }}
    />
  );
}
