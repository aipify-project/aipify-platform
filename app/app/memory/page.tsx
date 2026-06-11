import { MemoryEngineHub } from "@/components/app/memory";
import { OrganizationalMemoryPanel } from "@/components/app/organizational-memory/OrganizationalMemoryPanel";
import { MEMORY_CATEGORIES } from "@/lib/aipify/organizational-memory";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalMemoryPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  const categories = Object.fromEntries(
    MEMORY_CATEGORIES.map((c) => [c, t(`customerApp.organizationalMemory.categories.${c}`)])
  );

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-6xl px-6 pt-6">
        <MemoryEngineHub
          labels={{
            engineTitle: t("customerApp.memoryEngine.title"),
            engineSubtitle: t("customerApp.memoryEngine.subtitle"),
            loading: t("customerApp.memoryEngine.loading"),
            empty: t("customerApp.memoryEngine.empty"),
            refresh: t("customerApp.memoryEngine.refresh"),
            preferences: t("customerApp.memoryEngine.preferences"),
            patterns: t("customerApp.memoryEngine.patterns"),
            recommendations: t("customerApp.memoryEngine.recommendations"),
            settingsLink: t("customerApp.memoryEngine.settingsLink"),
            profileCount: t("customerApp.memoryEngine.profileCount"),
            patternCount: t("customerApp.memoryEngine.patternCount"),
            noRecommendations: t("customerApp.memoryEngine.recommendationsEmpty"),
            open: t("customerApp.memoryEngine.open"),
            privacy: t("customerApp.memoryEngine.privacy"),
          }}
        />
      </div>
    <OrganizationalMemoryPanel
      labels={{
        title: t("customerApp.organizationalMemory.title"),
        subtitle: t("customerApp.organizationalMemory.subtitle"),
        loading: t("customerApp.organizationalMemory.loading"),
        back: t("customerApp.organizationalMemory.back"),
        youControl: t("customerApp.organizationalMemory.youControl"),
        privacy: t("customerApp.organizationalMemory.privacy"),
        createEntry: t("customerApp.organizationalMemory.createEntry"),
        saveEntry: t("customerApp.organizationalMemory.saveEntry"),
        cancel: t("customerApp.organizationalMemory.cancel"),
        deleteEntry: t("customerApp.organizationalMemory.deleteEntry"),
        search: t("customerApp.organizationalMemory.search"),
        searchPlaceholder: t("customerApp.organizationalMemory.searchPlaceholder"),
        refresh: t("customerApp.organizationalMemory.refresh"),
        upgradeCta: t("customerApp.organizationalMemory.upgradeCta"),
        starterNote: t("customerApp.organizationalMemory.starterNote"),
        sections: {
          briefing: t("customerApp.organizationalMemory.sections.briefing"),
          timeline: t("customerApp.organizationalMemory.sections.timeline"),
          decisions: t("customerApp.organizationalMemory.sections.decisions"),
          lessons: t("customerApp.organizationalMemory.sections.lessons"),
          search: t("customerApp.organizationalMemory.sections.search"),
          create: t("customerApp.organizationalMemory.sections.create"),
          context: t("customerApp.organizationalMemory.sections.context"),
        },
        categories,
        visibility: {
          personal: t("customerApp.organizationalMemory.visibility.personal"),
          tenant: t("customerApp.organizationalMemory.visibility.tenant"),
          department: t("customerApp.organizationalMemory.visibility.department"),
          executive: t("customerApp.organizationalMemory.visibility.executive"),
        },
        fields: {
          title: t("customerApp.organizationalMemory.fields.title"),
          summary: t("customerApp.organizationalMemory.fields.summary"),
          notes: t("customerApp.organizationalMemory.fields.notes"),
          category: t("customerApp.organizationalMemory.fields.category"),
          date: t("customerApp.organizationalMemory.fields.date"),
          visibility: t("customerApp.organizationalMemory.fields.visibility"),
        },
        emptyTimeline: t("customerApp.organizationalMemory.emptyTimeline"),
        emptyDecisions: t("customerApp.organizationalMemory.emptyDecisions"),
        emptyLessons: t("customerApp.organizationalMemory.emptyLessons"),
        emptySearch: t("customerApp.organizationalMemory.emptySearch"),
        noResults: t("customerApp.organizationalMemory.noResults"),
      }}
    />
    </div>
  );
}
