import { SecurityTrustEngineDashboardPanel } from "@/components/app/security-trust-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function SecurityTrustEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "securityTrustEngine");
  const t = createTranslator(dict);
  const p = "customerApp.securityTrustEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <SecurityTrustEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          complianceScore: t(`${p}.complianceScore`),
          pendingReviews: t(`${p}.pendingReviews`),
          activePolicies: t(`${p}.activePolicies`),
          resiliencePlans: t(`${p}.resiliencePlans`),
          principles: t(`${p}.principles`),
          securityObjectives: t(`${p}.securityObjectives`),
          resilienceObjectives: t(`${p}.resilienceObjectives`),
          accessPrinciples: t(`${p}.accessPrinciples`),
          companionExamples: t(`${p}.companionExamples`),
          blueprintSuccessCriteria: t(`${p}.blueprintSuccessCriteria`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          trustConnectionBlueprint: t(`${p}.trustConnectionBlueprint`),
          engagementSummary: t(`${p}.engagementSummary`),
          complianceChecks: t(`${p}.complianceChecks`),
          openVulnerabilities: t(`${p}.openVulnerabilities`),
          resilienceSimulations: t(`${p}.resilienceSimulations`),
          trustTransparency: t(`${p}.trustTransparency`),
          enabled: t(`${p}.enabled`),
          disabled: t(`${p}.disabled`),
          complianceChecksSection: t(`${p}.complianceChecksSection`),
          passed: t(`${p}.passed`),
          pending: t(`${p}.pending`),
          integrationLinks: t(`${p}.integrationLinks`),
        }}
      />
    </div>
  );
}
