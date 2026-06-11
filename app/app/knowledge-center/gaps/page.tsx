import { KnowledgeGapsPanel } from "@/components/app/knowledge/KnowledgeGapsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function KnowledgeGapsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <KnowledgeGapsPanel
      labels={{
        title: t("customerApp.knowledge.gaps.title"),
        subtitle: t("customerApp.knowledge.gaps.subtitle"),
        loading: t("customerApp.knowledge.gaps.loading"),
        back: t("customerApp.knowledge.gaps.back"),
        empty: t("customerApp.knowledge.gaps.empty"),
        createFromGap: t("customerApp.knowledge.createFromGap"),
        dismiss: t("customerApp.knowledge.dismiss"),
      }}
    />
  );
}
