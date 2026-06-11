import { BillingAdminPanel } from "@/components/app/settings/BillingAdminPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function BillingSettingsPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);

  return (
    <BillingAdminPanel
      labels={{
        title: t("customerApp.commercialPackages.billing.title"),
        subtitle: t("customerApp.commercialPackages.billing.subtitle"),
        loading: t("customerApp.commercialPackages.billing.loading"),
        back: t("customerApp.commercialPackages.billing.back"),
        viewLicense: t("customerApp.commercialPackages.billing.viewLicense"),
        viewModules: t("customerApp.commercialPackages.billing.viewModules"),
        viewCommercial: t("customerApp.commercialPackages.billing.viewCommercial"),
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
  );
}
