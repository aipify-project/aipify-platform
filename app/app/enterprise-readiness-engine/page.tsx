import { EnterpriseReadinessEngineDashboardPanel } from "@/components/app/enterprise-readiness-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseReadinessEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "enterpriseReadinessEngine");
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseReadinessEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EnterpriseReadinessEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          governance: t(`${p}.governance`),
          deployments: t(`${p}.deployments`),
          enterpriseDeployment: t(`${p}.enterpriseDeployment`),
          enterpriseFramework: t(`${p}.enterpriseFramework`),
          deviceRollout: t(`${p}.deviceRollout`),
          executiveInsights: t(`${p}.executiveInsights`),
          compliance: t(`${p}.compliance`),
          humanOversight: t(`${p}.humanOversight`),
          selfLove: t(`${p}.selfLove`),
          organizationWorkspace: t(`${p}.organizationWorkspace`),
          overall_score: t(`${p}.overall_score`),
          delegated_admins: t(`${p}.delegated_admins`),
          approval_chains: t(`${p}.approval_chains`),
          pending_milestones: t(`${p}.pending_milestones`),
          security_posture: t(`${p}.security_posture`),
          securityScore: t(`${p}.securityScore`),
          integration_landscape: t(`${p}.integration_landscape`),
          connectedIntegrations: t(`${p}.connectedIntegrations`),
          approval_bottlenecks: t(`${p}.approval_bottlenecks`),
          operational_risks: t(`${p}.operational_risks`),
          onboarding_milestones: t(`${p}.onboarding_milestones`),
          deployment_readiness: t(`${p}.deployment_readiness`),
          deploymentModel: t(`${p}.deploymentModel`),
          openDeploymentEngine: t(`${p}.openDeploymentEngine`),
          reports: t(`${p}.reports`),
          noItems: t(`${p}.noItems`),
          principles: t(`${p}.principles`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintPhase37: t(`${p}.blueprintPhase37`),
          enterpriseObjectives: t(`${p}.enterpriseObjectives`),
          deploymentModels: t(`${p}.deploymentModels`),
          iamCapabilities: t(`${p}.iamCapabilities`),
          multiEntitySupport: t(`${p}.multiEntitySupport`),
          governanceControls: t(`${p}.governanceControls`),
          executiveCapabilities: t(`${p}.executiveCapabilities`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          trustConnection: t(`${p}.trustConnection`),
          dogfooding: t(`${p}.dogfooding`),
          aipifyGroup: t(`${p}.aipifyGroup`),
          unonight: t(`${p}.unonight`),
          successCriteria: t(`${p}.successCriteria`),
          visionPhrases: t(`${p}.visionPhrases`),
          integrationLinks: t(`${p}.integrationLinks`),
          enterpriseSummary: t(`${p}.enterpriseSummary`),
          governanceScore: t(`${p}.governanceScore`),
          ssoScaffold: t(`${p}.ssoScaffold`),
          ssoConnected: t(`${p}.ssoConnected`),
          scaffoldNote: t(`${p}.scaffoldNote`),
          hierarchyLevel: t(`${p}.hierarchyLevel`),
          statusScaffold: t(`${p}.statusScaffold`),
          statusActive: t(`${p}.statusActive`),
        }}
      />
    </div>
  );
}
