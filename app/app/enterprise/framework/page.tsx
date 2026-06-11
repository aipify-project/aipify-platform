import { EnterpriseDeploymentFrameworkPanel } from "@/components/app/enterprise/EnterpriseDeploymentFrameworkPanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function EnterpriseFrameworkPage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.enterpriseDeploymentFramework";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <EnterpriseDeploymentFrameworkPanel
        labels={{
          loading: t(`${p}.loading`),
          frameworkScore: t(`${p}.frameworkScore`),
          generateBriefing: t(`${p}.generateBriefing`),
          deploymentReadiness: t(`${p}.deploymentReadiness`),
          userAdoption: t(`${p}.userAdoption`),
          governanceActive: t(`${p}.governanceActive`),
          securityControls: t(`${p}.securityControls`),
          pilotRecommended: t(`${p}.pilotRecommended`),
          backToEnterprise: t(`${p}.backToEnterprise`),
          deploymentSettings: t(`${p}.deploymentSettings`),
          auditCompliance: t(`${p}.auditCompliance`),
          readiness: t(`${p}.readiness`),
          advanceStage: t(`${p}.advanceStage`),
          deploymentStages: t(`${p}.deploymentStages`),
          readinessAssessment: t(`${p}.readinessAssessment`),
          deploymentModels: t(`${p}.deploymentModels`),
          iamCapabilities: t(`${p}.iamCapabilities`),
          enterpriseRoles: t(`${p}.enterpriseRoles`),
          governancePolicies: t(`${p}.governancePolicies`),
          activatePolicy: t(`${p}.activatePolicy`),
          securityControlsTitle: t(`${p}.securityControlsTitle`),
          enabled: t(`${p}.enabled`),
          disabled: t(`${p}.disabled`),
          integrationFramework: t(`${p}.integrationFramework`),
          changeManagement: t(`${p}.changeManagement`),
          successMetrics: t(`${p}.successMetrics`),
          businessContinuity: t(`${p}.businessContinuity`),
          supportModel: t(`${p}.supportModel`),
          currentTier: t(`${p}.currentTier`),
        }}
      />
    </div>
  );
}
