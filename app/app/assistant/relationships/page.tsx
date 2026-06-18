import { RelationshipDashboardPanel } from "@/components/app/assistant";
import { PERSON_TYPES } from "@/lib/relationship-intelligence";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppAssistantRelationshipsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);

  const personTypeLabels = Object.fromEntries(
    PERSON_TYPES.map((pt) => [pt, t(`customerApp.relationships.personTypes.${pt}`)])
  );

  return (
    <RelationshipDashboardPanel
      locale={locale}
      labels={{
        title: t("customerApp.relationships.title"),
        subtitle: t("customerApp.relationships.subtitle"),
        loading: t("customerApp.relationships.loading"),
        back: t("customerApp.relationships.back"),
        save: t("customerApp.relationships.save"),
        saved: t("customerApp.relationships.saved"),
        export: t("customerApp.relationships.export"),
        pause: t("customerApp.relationships.pause"),
        remove: t("customerApp.relationships.remove"),
        addPerson: t("customerApp.relationships.addPerson"),
        personName: t("customerApp.relationships.personName"),
        personType: t("customerApp.relationships.personType"),
        viewLife: t("customerApp.relationships.viewLife"),
        viewMemories: t("customerApp.relationships.viewMemories"),
        sections: {
          people: t("customerApp.relationships.sections.people"),
          milestones: t("customerApp.relationships.sections.milestones"),
          socialReminders: t("customerApp.relationships.sections.socialReminders"),
          followUps: t("customerApp.relationships.sections.followUps"),
          suggestedActions: t("customerApp.relationships.sections.suggestedActions"),
          giftOpportunities: t("customerApp.relationships.sections.giftOpportunities"),
          sharedCommitments: t("customerApp.relationships.sections.sharedCommitments"),
          proactive: t("customerApp.relationships.sections.proactive"),
          settings: t("customerApp.relationships.sections.settings"),
          ethics: t("customerApp.relationships.sections.ethics"),
          sharedMemory: t("customerApp.relationships.sections.sharedMemory"),
        },
        settings: {
          enabled: t("customerApp.relationships.settings.enabled"),
          askBeforeRemembering: t("customerApp.relationships.settings.askBeforeRemembering"),
          giftSuggestions: t("customerApp.relationships.settings.giftSuggestions"),
          followUps: t("customerApp.relationships.settings.followUps"),
        },
        personTypes: personTypeLabels,
      }}
    />
  );
}
