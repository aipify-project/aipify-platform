import { AssistantChatPanel } from "@/components/app/assistant";
import { createClient } from "@/lib/supabase/server";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppAssistantPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp", "branding"]);
  const t = createTranslator(dict);

  const supabase = await createClient();
  const { data: center } = await supabase.rpc("get_customer_assistant_center");
  const suggestions = Array.isArray(center?.proactive_suggestions)
    ? (center.proactive_suggestions as Array<{ id: string; message: string }>)
    : [];

  return (
    <AssistantChatPanel
      proactiveSuggestions={suggestions}
      labels={{
        title: t("customerApp.assistant.title"),
        subtitle: t("customerApp.assistant.subtitle"),
        placeholder: t("customerApp.assistant.placeholder"),
        send: t("customerApp.assistant.send"),
        confirm: t("customerApp.assistant.confirm"),
        decline: t("customerApp.assistant.decline"),
        viewMemories: t("customerApp.assistant.viewMemories"),
        viewLife: t("customerApp.assistant.viewLife"),
        viewRelationships: t("customerApp.assistant.viewRelationships"),
        viewIdentity: t("customerApp.assistant.viewIdentity"),
        viewContext: t("customerApp.assistant.viewContext"),
        viewCalendars: t("customerApp.assistant.viewCalendars"),
        confirmEvent: t("customerApp.assistant.confirmEvent"),
        confirmGoal: t("customerApp.assistant.confirmGoal"),
        viewGoals: t("customerApp.assistant.viewGoals"),
        proactiveTitle: t("customerApp.assistant.proactiveTitle"),
        loading: t("customerApp.assistant.loading"),
        orbLabel: t("branding.orbLabel"),
      }}
    />
  );
}
