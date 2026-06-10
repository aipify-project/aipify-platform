import AssistantPanel from "@/components/dashboard/AssistantPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AssistantPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["dashboard", "branding"]);
  const t = createTranslator(dict);

  return (
    <div className="mx-auto max-w-4xl">
      <AssistantPanel
        title={t("dashboard.assistant.title")}
        greeting={t("dashboard.assistant.greeting")}
        subtitle={t("dashboard.assistant.subtitle")}
        online={t("dashboard.assistant.online")}
        todayFound={t("dashboard.assistant.todayFound")}
        items={[
          t("dashboard.assistant.items.tickets"),
          t("dashboard.assistant.items.integration"),
          t("dashboard.assistant.items.trial"),
          t("dashboard.assistant.items.revenue"),
          t("dashboard.assistant.items.recommendation"),
        ]}
        lastAnalyzedLabel={t("dashboard.assistant.lastAnalyzed")}
        lastAnalyzedJustNow={t("dashboard.assistant.lastAnalyzedJustNow")}
        lastAnalyzedMinutesAgo={t("dashboard.assistant.lastAnalyzedMinutesAgo")}
        askAipify={t("dashboard.assistant.askAipify")}
        orbLabel={t("branding.orbLabel")}
      />
    </div>
  );
}
