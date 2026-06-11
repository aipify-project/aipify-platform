import { AssistantMemoryPanel } from "@/components/app/assistant";
import { PAME_MEMORY_TYPES, type PameMemoryType } from "@/lib/assistant-memory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppAssistantMemoryPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const categoryLabels = Object.fromEntries(
    PAME_MEMORY_TYPES.map((cat) => [cat, t(`customerApp.assistantMemory.categories.${cat}`)])
  ) as Record<PameMemoryType, string>;

  return (
    <AssistantMemoryPanel
      locale={locale}
      labels={{
        title: t("customerApp.assistantMemory.title"),
        subtitle: t("customerApp.assistantMemory.subtitle"),
        loading: t("customerApp.assistantMemory.loading"),
        empty: t("customerApp.assistantMemory.empty"),
        back: t("customerApp.assistantMemory.back"),
        remove: t("customerApp.assistantMemory.remove"),
        pause: t("customerApp.assistantMemory.pause"),
        complete: t("customerApp.assistantMemory.complete"),
        export: t("customerApp.assistantMemory.export"),
        categories: categoryLabels,
        sections: {
          importantPeople: t("customerApp.assistantMemory.sections.importantPeople"),
          upcomingEvents: t("customerApp.assistantMemory.sections.upcomingEvents"),
          activeTasks: t("customerApp.assistantMemory.sections.activeTasks"),
          recurringReminders: t("customerApp.assistantMemory.sections.recurringReminders"),
          completedItems: t("customerApp.assistantMemory.sections.completedItems"),
          recentlyAdded: t("customerApp.assistantMemory.sections.recentlyAdded"),
        },
        askBeforeRemembering: t("customerApp.assistantMemory.askBeforeRemembering"),
        save: t("customerApp.assistantMemory.save"),
        saved: t("customerApp.assistantMemory.saved"),
        principle: t("customerApp.assistantMemory.principle"),
      }}
    />
  );
}
