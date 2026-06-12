import { IntegrationEngineDashboardPanel } from "@/components/app/integration-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntegrationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.integrationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <IntegrationEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          aipifyCore: t(`${p}.aipifyCore`),
          supportAi: t(`${p}.supportAi`),
          auditAccountability: t(`${p}.auditAccountability`),
          integrationEngine: t(`${p}.integrationEngine`),
          platformPriorities: t(`${p}.platformPriorities`),
          successCriteria: t(`${p}.successCriteria`),
          trustConnection: t(`${p}.trustConnection`),
          connectorArchitecture: t(`${p}.connectorArchitecture`),
          integrationPrinciples: t(`${p}.integrationPrinciples`),
          activeIntegrations: t(`${p}.activeIntegrations`),
          failedIntegrations: t(`${p}.failedIntegrations`),
          pendingIntegrations: t(`${p}.pendingIntegrations`),
          disabledIntegrations: t(`${p}.disabledIntegrations`),
          unonightPilot: t(`${p}.unonightPilot`),
          unonightConnected: t(`${p}.unonightConnected`),
          unonightNotConnected: t(`${p}.unonightNotConnected`),
          connectUnonight: t(`${p}.connectUnonight`),
          connectedIntegrations: t(`${p}.connectedIntegrations`),
          lastSync: t(`${p}.lastSync`),
          credentialsStored: t(`${p}.credentialsStored`),
          sync: t(`${p}.sync`),
          disable: t(`${p}.disable`),
          pendingActions: t(`${p}.pendingActions`),
          recentFailures: t(`${p}.recentFailures`),
          recentWebhooks: t(`${p}.recentWebhooks`),
          futureIntegrations: t(`${p}.futureIntegrations`),
          principles: t(`${p}.principles`),
          noIntegrations: t(`${p}.noIntegrations`),
          noFailures: t(`${p}.noFailures`),
          noWebhooks: t(`${p}.noWebhooks`),
          financialOperations: t(`${p}.financialOperations`),
          primaryStrategy: t(`${p}.primaryStrategy`),
          financialPrinciples: t(`${p}.financialPrinciples`),
          aipifyMay: t(`${p}.aipifyMay`),
          blueprintBoundaries: t(`${p}.blueprintBoundaries`),
          executiveExamples: t(`${p}.executiveExamples`),
          engagementSummary: t(`${p}.engagementSummary`),
          stripeActive: t(`${p}.stripeActive`),
          stripeWebhooks: t(`${p}.stripeWebhooks`),
          fikenScaffold: t(`${p}.fikenScaffold`),
          financialWebhooks: t(`${p}.financialWebhooks`),
          yes: t(`${p}.yes`),
          no: t(`${p}.no`),
          blueprintIntegrationLinks: t(`${p}.blueprintIntegrationLinks`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          financialTrust: t(`${p}.financialTrust`),
          financialSuccessCriteria: t(`${p}.financialSuccessCriteria`),
          visionPhrases: t(`${p}.visionPhrases`),
        }}
      />
    </div>
  );
}
