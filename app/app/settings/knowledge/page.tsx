import { KnowledgeSettingsPanel } from "@/components/app/settings/KnowledgeSettingsPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function KnowledgeSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <KnowledgeSettingsPanel
      labels={{
        title: t("customerApp.settings.knowledge.title"),
        description: t("customerApp.settings.knowledge.description"),
        privacy: t("customerApp.settings.knowledge.privacy"),
        loading: t("customerApp.settings.knowledge.loading"),
        back: t("customerApp.settings.knowledge.back"),
        save: t("customerApp.settings.knowledge.save"),
        saved: t("customerApp.settings.knowledge.saved"),
        upgradeTitle: t("customerApp.settings.knowledge.upgrade.title"),
        upgradeBody: t("customerApp.settings.knowledge.upgrade.body"),
        upgradeCta: t("customerApp.settings.knowledge.upgrade.cta"),
        centerLink: t("customerApp.settings.knowledge.centerLink"),
        fields: {
          enable: t("customerApp.settings.knowledge.fields.enable"),
          useGlobal: t("customerApp.settings.knowledge.fields.useGlobal"),
          allowTenant: t("customerApp.settings.knowledge.fields.allowTenant"),
          aiDrafts: t("customerApp.settings.knowledge.fields.aiDrafts"),
          requireReview: t("customerApp.settings.knowledge.fields.requireReview"),
          minConfidence: t("customerApp.settings.knowledge.fields.minConfidence"),
          gapConfidence: t("customerApp.settings.knowledge.fields.gapConfidence"),
        },
      }}
    />
  );
}
