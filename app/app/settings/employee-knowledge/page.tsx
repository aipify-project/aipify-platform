import { EmployeeKnowledgeAdminPanel } from "@/components/app/settings/EmployeeKnowledgeAdminPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EmployeeKnowledgeSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <EmployeeKnowledgeAdminPanel
      labels={{
        title: t("customerApp.employeeKnowledge.title"),
        subtitle: t("customerApp.employeeKnowledge.subtitle"),
        loading: t("customerApp.employeeKnowledge.loading"),
        back: t("customerApp.employeeKnowledge.back"),
        save: t("customerApp.employeeKnowledge.save"),
        saved: t("customerApp.employeeKnowledge.saved"),
        privacy: t("customerApp.employeeKnowledge.privacy"),
        viewBusinessDna: t("customerApp.employeeKnowledge.viewBusinessDna"),
        youControl: t("customerApp.employeeKnowledge.youControl"),
        empty: t("customerApp.employeeKnowledge.empty"),
        sections: {
          health: t("customerApp.employeeKnowledge.sections.health"),
          coverage: t("customerApp.employeeKnowledge.sections.coverage"),
          gaps: t("customerApp.employeeKnowledge.sections.gaps"),
          onboarding: t("customerApp.employeeKnowledge.sections.onboarding"),
          permissions: t("customerApp.employeeKnowledge.sections.permissions"),
          sources: t("customerApp.employeeKnowledge.sections.sources"),
          pending: t("customerApp.employeeKnowledge.sections.pending"),
          ask: t("customerApp.employeeKnowledge.sections.ask"),
          search: t("customerApp.employeeKnowledge.sections.search"),
          audit: t("customerApp.employeeKnowledge.sections.audit"),
          ethics: t("customerApp.employeeKnowledge.sections.ethics"),
          settings: t("customerApp.employeeKnowledge.sections.settings"),
        },
        settings: {
          assistant: t("customerApp.employeeKnowledge.settings.assistant"),
          gapDetection: t("customerApp.employeeKnowledge.settings.gapDetection"),
          onboarding: t("customerApp.employeeKnowledge.settings.onboarding"),
          improvementLoop: t("customerApp.employeeKnowledge.settings.improvementLoop"),
          adminApproval: t("customerApp.employeeKnowledge.settings.adminApproval"),
          videoSupport: t("customerApp.employeeKnowledge.settings.videoSupport"),
        },
        ask: {
          placeholder: t("customerApp.employeeKnowledge.ask.placeholder"),
          run: t("customerApp.employeeKnowledge.ask.run"),
          confidence: t("customerApp.employeeKnowledge.ask.confidence"),
          escalate: t("customerApp.employeeKnowledge.ask.escalate"),
          steps: t("customerApp.employeeKnowledge.ask.steps"),
        },
        search: {
          placeholder: t("customerApp.employeeKnowledge.search.placeholder"),
          run: t("customerApp.employeeKnowledge.search.run"),
        },
        create: {
          title: t("customerApp.employeeKnowledge.create.title"),
          category: t("customerApp.employeeKnowledge.create.category"),
          content: t("customerApp.employeeKnowledge.create.content"),
          submit: t("customerApp.employeeKnowledge.create.submit"),
        },
      }}
    />
  );
}
