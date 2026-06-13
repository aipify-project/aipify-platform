import { AipifyCompanionBriefingBanner } from "@/components/app/briefing";
import { BillingAdminPanel } from "@/components/app/settings/BillingAdminPanel";
import { buildCompanionBriefingLabels } from "@/lib/app/companion-briefing-labels";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BillingSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <div className="space-y-4">
      <div className="px-6 pt-6">
        <AipifyCompanionBriefingBanner context="billing" labels={buildCompanionBriefingLabels(t)} />
      </div>
      <BillingAdminPanel
      labels={{
        title: t("customerApp.commercialPackages.billing.title"),
        subtitle: t("customerApp.commercialPackages.billing.subtitle"),
        loading: t("customerApp.commercialPackages.billing.loading"),
        back: t("customerApp.commercialPackages.billing.back"),
        viewLicense: t("customerApp.commercialPackages.billing.viewLicense"),
        viewModules: t("customerApp.commercialPackages.billing.viewModules"),
        viewCommercial: t("customerApp.commercialPackages.billing.viewCommercial"),
        viewPackages: t("customerApp.commercialPackages.billing.viewPackages"),
        empty: t("customerApp.commercialPackages.billing.empty"),
        sections: {
          package: t("customerApp.commercialPackages.billing.sections.package"),
          modules: t("customerApp.commercialPackages.billing.sections.modules"),
          usage: t("customerApp.commercialPackages.billing.sections.usage"),
          limits: t("customerApp.commercialPackages.billing.sections.limits"),
          upgrades: t("customerApp.commercialPackages.billing.sections.upgrades"),
          addons: t("customerApp.commercialPackages.billing.sections.addons"),
          recommendations: t("customerApp.commercialPackages.billing.sections.recommendations"),
          history: t("customerApp.commercialPackages.billing.sections.history"),
          suites: t("customerApp.commercialPackages.billing.sections.suites"),
          pricingPhilosophy: t("customerApp.commercialPackages.pricingPhilosophy.title"),
        },
        pricingPhilosophy: {
          principle: t("customerApp.commercialPackages.pricingPhilosophy.principleLead"),
          priceOn: t("customerApp.commercialPackages.pricingPhilosophy.priceOn"),
          avoid: t("customerApp.commercialPackages.pricingPhilosophy.avoid"),
          planGuidance: t("customerApp.commercialPackages.pricingPhilosophy.planGuidance"),
          positioning: t("customerApp.commercialPackages.pricingPhilosophy.positioning"),
          abosPrinciple: t("customerApp.commercialPackages.pricingPhilosophy.abosPrinciple"),
          guidanceNote: t("customerApp.commercialPackages.pricingPhilosophy.guidanceNote"),
          usdRange: t("customerApp.commercialPackages.pricingPhilosophy.usdRange"),
        },
        usage: {
          support_cases_handled: t("customerApp.commercialPackages.billing.usage.supportCases"),
          autonomous_resolutions: t("customerApp.commercialPackages.billing.usage.autonomous"),
          knowledge_searches: t("customerApp.commercialPackages.billing.usage.knowledgeSearches"),
          employee_interactions: t("customerApp.commercialPackages.billing.usage.employeeInteractions"),
          insight_reports_generated: t("customerApp.commercialPackages.billing.usage.insightReports"),
          api_calls: t("customerApp.commercialPackages.billing.usage.apiCalls"),
          ai_usage_volume: t("customerApp.commercialPackages.billing.usage.aiUsage"),
        },
      }}
    />
    </div>
  );
}
