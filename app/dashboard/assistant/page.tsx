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
        sinceLogin={t("dashboard.assistant.sinceLogin")}
        items={[
          t("dashboard.assistant.items.tickets"),
          t("dashboard.assistant.items.recommendations"),
          t("dashboard.assistant.items.integration"),
        ]}
        refresh={t("dashboard.assistant.refresh")}
        askAipify={t("dashboard.assistant.askAipify")}
        orbLabel={t("branding.orbLabel")}
      />
    </div>
  );
}
