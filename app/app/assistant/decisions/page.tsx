import { DecisionDashboardPanel } from "@/components/app/assistant";
import {
  BUSINESS_DOMAIN_KEYS,
  CONFIDENCE_LEVELS,
  PRESENTATION_STYLES,
  PROACTIVITY_LEVELS,
} from "@/lib/decision-support-engine";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AppAssistantDecisionsPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["core"]);
  const t = createTranslator(dict);

  const mapKeys = <K extends string>(keys: readonly K[], prefix: string) =>
    Object.fromEntries(keys.map((k) => [k, t(`customerApp.decisionSupport.${prefix}.${k}`)])) as Record<
      K,
      string
    >;

  return (
    <DecisionDashboardPanel
      locale={locale}
      labels={{
        title: t("customerApp.decisionSupport.title"),
        subtitle: t("customerApp.decisionSupport.subtitle"),
        loading: t("customerApp.decisionSupport.loading"),
        back: t("customerApp.decisionSupport.back"),
        save: t("customerApp.decisionSupport.save"),
        saved: t("customerApp.decisionSupport.saved"),
        privacy: t("customerApp.decisionSupport.privacy"),
        analyze: t("customerApp.decisionSupport.analyze"),
        viewAttention: t("customerApp.decisionSupport.viewAttention"),
        acceptGuidance: t("customerApp.decisionSupport.acceptGuidance"),
        defer: t("customerApp.decisionSupport.defer"),
        dismiss: t("customerApp.decisionSupport.dismiss"),
        youDecide: t("customerApp.decisionSupport.youDecide"),
        sections: {
          pending: t("customerApp.decisionSupport.sections.pending"),
          business: t("customerApp.decisionSupport.sections.business"),
          priorities: t("customerApp.decisionSupport.sections.priorities"),
          risks: t("customerApp.decisionSupport.sections.risks"),
          history: t("customerApp.decisionSupport.sections.history"),
          framework: t("customerApp.decisionSupport.sections.framework"),
          ethics: t("customerApp.decisionSupport.sections.ethics"),
          settings: t("customerApp.decisionSupport.sections.settings"),
        },
        settings: {
          enabled: t("customerApp.decisionSupport.settings.enabled"),
          proactivity: t("customerApp.decisionSupport.settings.proactivity"),
          personal: t("customerApp.decisionSupport.settings.personal"),
          historical: t("customerApp.decisionSupport.settings.historical"),
          presentation: t("customerApp.decisionSupport.settings.presentation"),
          storeHistory: t("customerApp.decisionSupport.settings.storeHistory"),
        },
        confidenceLevels: mapKeys(CONFIDENCE_LEVELS, "confidenceLevels"),
        proactivityLevels: mapKeys(PROACTIVITY_LEVELS, "proactivityLevels"),
        presentationStyles: mapKeys(PRESENTATION_STYLES, "presentationStyles"),
        businessDomains: mapKeys(BUSINESS_DOMAIN_KEYS, "businessDomains"),
        empty: t("customerApp.decisionSupport.empty"),
        blueprint: {
          toggle: t("customerApp.decisionSupport.blueprint.toggle"),
          phase: t("customerApp.decisionSupport.blueprint.phase"),
          mission: t("customerApp.decisionSupport.blueprint.mission"),
          philosophy: t("customerApp.decisionSupport.blueprint.philosophy"),
          abosPrinciple: t("customerApp.decisionSupport.blueprint.abosPrinciple"),
          distinction: t("customerApp.decisionSupport.blueprint.distinction"),
          objectives: t("customerApp.decisionSupport.blueprint.objectives"),
          frameworks: t("customerApp.decisionSupport.blueprint.frameworks"),
          decisionTypes: t("customerApp.decisionSupport.blueprint.decisionTypes"),
          examples: t("customerApp.decisionSupport.blueprint.examples"),
          riskAwareness: t("customerApp.decisionSupport.blueprint.riskAwareness"),
          scenarios: t("customerApp.decisionSupport.blueprint.scenarios"),
          selfLove: t("customerApp.decisionSupport.blueprint.selfLove"),
          trust: t("customerApp.decisionSupport.blueprint.trust"),
          dogfooding: t("customerApp.decisionSupport.blueprint.dogfooding"),
          successCriteria: t("customerApp.decisionSupport.blueprint.successCriteria"),
          vision: t("customerApp.decisionSupport.blueprint.vision"),
          integrations: t("customerApp.decisionSupport.blueprint.integrations"),
          met: t("customerApp.decisionSupport.blueprint.met"),
          notMet: t("customerApp.decisionSupport.blueprint.notMet"),
        },
      }}
    />
  );
}
