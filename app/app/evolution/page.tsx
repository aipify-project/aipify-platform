import { OrganizationalEvolutionDashboardPanel } from "@/components/app/organizational-evolution-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalEvolutionPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForModule(locale, "organizationalEvolutionEngine");
  const t = createTranslator(dict);
  const p = "customerApp.organizationalEvolutionEngine";

  const labels: Record<string, string> = {
    loading: t(`${p}.loading`),
    loadFailed: t(`${p}.loadFailed`),
    actionFailed: t(`${p}.actionFailed`),
    accessRequiredTitle: t(`${p}.accessRequiredTitle`),
    accessRequiredBody: t(`${p}.accessRequiredBody`),
    overviewTitle: t(`${p}.overviewTitle`),
    signalsTitle: t(`${p}.signalsTitle`),
    improvementsTitle: t(`${p}.improvementsTitle`),
    operationalLearningTitle: t(`${p}.operationalLearningTitle`),
    patternsTitle: t(`${p}.patternsTitle`),
    knowledgeTitle: t(`${p}.knowledgeTitle`),
    workflowTitle: t(`${p}.workflowTitle`),
    approvedTitle: t(`${p}.approvedTitle`),
    intelligenceTitle: t(`${p}.intelligenceTitle`),
    advisorTitle: t(`${p}.advisorTitle`),
    governanceTitle: t(`${p}.governanceTitle`),
    auditTitle: t(`${p}.auditTitle`),
    executiveTitle: t(`${p}.executiveTitle`),
    metricSignals: t(`${p}.metricSignals`),
    metricOpportunities: t(`${p}.metricOpportunities`),
    metricApproved: t(`${p}.metricApproved`),
    metricLearnings: t(`${p}.metricLearnings`),
    metricKnowledge: t(`${p}.metricKnowledge`),
    metricWorkflows: t(`${p}.metricWorkflows`),
    metricHealth: t(`${p}.metricHealth`),
    metricVelocity: t(`${p}.metricVelocity`),
    noSignals: t(`${p}.noSignals`),
    noImprovements: t(`${p}.noImprovements`),
    noOperationalLearning: t(`${p}.noOperationalLearning`),
    noPatterns: t(`${p}.noPatterns`),
    noKnowledge: t(`${p}.noKnowledge`),
    noWorkflows: t(`${p}.noWorkflows`),
    noApproved: t(`${p}.noApproved`),
    noIntelligence: t(`${p}.noIntelligence`),
    noAdvisor: t(`${p}.noAdvisor`),
    noAudit: t(`${p}.noAudit`),
    recommendation: t(`${p}.recommendation`),
    openLearning: t(`${p}.openLearning`),
    openApprovals: t(`${p}.openApprovals`),
    openKnowledge: t(`${p}.openKnowledge`),
    recordSignal: t(`${p}.recordSignal`),
    suggestImprovement: t(`${p}.suggestImprovement`),
    approve: t(`${p}.approve`),
    reject: t(`${p}.reject`),
    implement: t(`${p}.implement`),
    validate: t(`${p}.validate`),
    refreshAnalytics: t(`${p}.refreshAnalytics`),
    acting: t(`${p}.acting`),
    governanceNoSelfModify: t(`${p}.governanceNoSelfModify`),
    governanceNoPolicyChanges: t(`${p}.governanceNoPolicyChanges`),
    governanceNoPermissionChanges: t(`${p}.governanceNoPermissionChanges`),
    governanceHumanApproval: t(`${p}.governanceHumanApproval`),
    governanceHumanOverride: t(`${p}.governanceHumanOverride`),
    executiveSummary: t(`${p}.executiveSummary`),
    velocityLabel: t(`${p}.velocityLabel`),
    implementedLabel: t(`${p}.implementedLabel`),
    impactLabel: t(`${p}.impactLabel`),
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <OrganizationalEvolutionDashboardPanel labels={labels} />
    </div>
  );
}
