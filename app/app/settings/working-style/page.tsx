import { WorkingStyleAdminPanel } from "@/components/app/settings/WorkingStyleAdminPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";
import {
  AWSE_REMINDER_FREQUENCIES,
  DETAIL_LEVELS,
  SUMMARY_TIMES,
  WORKING_PROFILES,
} from "@/lib/adaptive-working-style-engine";

export default async function WorkingStyleSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const profiles = Object.fromEntries(
    WORKING_PROFILES.map((p) => [p, t(`customerApp.workingStyle.profiles.${p}`)])
  );
  const detailLevels = Object.fromEntries(
    DETAIL_LEVELS.map((d) => [d, t(`customerApp.workingStyle.detailLevels.${d}`)])
  );
  const reminderLevels = Object.fromEntries(
    AWSE_REMINDER_FREQUENCIES.map((r) => [r, t(`customerApp.workingStyle.reminderLevels.${r}`)])
  );
  const summaryTimes = Object.fromEntries(
    SUMMARY_TIMES.map((s) => [s, t(`customerApp.workingStyle.summaryTimes.${s}`)])
  );
  const categories = Object.fromEntries(
    ["email", "task", "meeting", "support", "sales", "relationship"].map((c) => [
      c,
      t(`customerApp.workingStyle.categories.${c}`),
    ])
  );

  return (
    <WorkingStyleAdminPanel
      labels={{
        title: t("customerApp.workingStyle.title"),
        subtitle: t("customerApp.workingStyle.subtitle"),
        loading: t("customerApp.workingStyle.loading"),
        back: t("customerApp.workingStyle.back"),
        save: t("customerApp.workingStyle.save"),
        saved: t("customerApp.workingStyle.saved"),
        reset: t("customerApp.workingStyle.reset"),
        resetConfirm: t("customerApp.workingStyle.resetConfirm"),
        youControl: t("customerApp.workingStyle.youControl"),
        transparency: t("customerApp.workingStyle.transparency"),
        adaptationSuggestion: t("customerApp.workingStyle.adaptationSuggestion"),
        starterNote: t("customerApp.workingStyle.starterNote"),
        sections: {
          profile: t("customerApp.workingStyle.sections.profile"),
          detail: t("customerApp.workingStyle.sections.detail"),
          reminders: t("customerApp.workingStyle.sections.reminders"),
          focus: t("customerApp.workingStyle.sections.focus"),
          learning: t("customerApp.workingStyle.sections.learning"),
          categories: t("customerApp.workingStyle.sections.categories"),
          summary: t("customerApp.workingStyle.sections.summary"),
          enterprise: t("customerApp.workingStyle.sections.enterprise"),
        },
        fields: {
          workingProfile: t("customerApp.workingStyle.fields.workingProfile"),
          detailLevel: t("customerApp.workingStyle.fields.detailLevel"),
          reminderFrequency: t("customerApp.workingStyle.fields.reminderFrequency"),
          summaryTime: t("customerApp.workingStyle.fields.summaryTime"),
          focusMode: t("customerApp.workingStyle.fields.focusMode"),
          adaptiveLearning: t("customerApp.workingStyle.fields.adaptiveLearning"),
        },
        profiles,
        detailLevels,
        reminderLevels,
        summaryTimes,
        categories,
        enterpriseEmpty: t("customerApp.workingStyle.enterpriseEmpty"),
      }}
    />
  );
}
