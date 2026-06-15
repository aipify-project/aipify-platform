import { AipifyHostsTrustComplianceDashboardPanel } from "@/components/app/aipify-hosts-trust-compliance";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function AipifyHostsTrustCompliancePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.aipifyHostsTrustCompliance";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <AipifyHostsTrustComplianceDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          errorTitle: t(`${p}.errorTitle`),
          errorMessage: t(`${p}.errorMessage`),
          retry: t(`${p}.retry`),
          trustSnapshot: t(`${p}.trustSnapshot`),
          trustScore: t(`${p}.trustScore`),
          complianceReady: t(`${p}.complianceReady`),
          safetyCompletion: t(`${p}.safetyCompletion`),
          attentionRequired: t(`${p}.attentionRequired`),
          regulatoryAlerts: t(`${p}.regulatoryAlerts`),
          compliant: t(`${p}.compliant`),
          attentionRequiredStatus: t(`${p}.attentionRequiredStatus`),
          actionOverdue: t(`${p}.actionOverdue`),
          suggestedAction: t(`${p}.suggestedAction`),
          executiveMetrics: t(`${p}.executiveMetrics`),
          modules: t(`${p}.modules`),
          included: t(`${p}.included`),
          upgradeRequired: t(`${p}.upgradeRequired`),
          complianceAreas: t(`${p}.complianceAreas`),
          safetyAreas: t(`${p}.safetyAreas`),
          ethicsPrinciples: t(`${p}.ethicsPrinciples`),
          houseRuleCategories: t(`${p}.houseRuleCategories`),
          successMetrics: t(`${p}.successMetrics`),
          backToHosts: t(`${p}.backToHosts`),
          exploreKnowledge: t(`${p}.exploreKnowledge`),
        }}
      />
    </div>
  );
}
