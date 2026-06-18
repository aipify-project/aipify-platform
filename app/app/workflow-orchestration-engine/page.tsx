import { WorkflowOrchestrationEngineDashboardPanel } from "@/components/app/workflow-orchestration-engine";
import { getCustomerAppDictionaryForModule } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function WorkflowOrchestrationEnginePage() {
  const dict = await getCustomerAppDictionaryForModule(await getLocale(), "workflowOrchestrationEngine");
  const t = createTranslator(dict);
  const p = "customerApp.workflowOrchestrationEngine";

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">{t(`${p}.title`)}</h1>
        <p className="mt-2 text-gray-600">{t(`${p}.subtitle`)}</p>
      </div>
      <WorkflowOrchestrationEngineDashboardPanel
        labels={{
          loading: t(`${p}.loading`),
          engineTitle: t(`${p}.engineTitle`),
          summary: t(`${p}.summary`),
          principles: t(`${p}.principles`),
          templates: t(`${p}.templates`),
          templatesHint: t(`${p}.templatesHint`),
          useTemplate: t(`${p}.useTemplate`),
          workflows: t(`${p}.workflows`),
          noWorkflows: t(`${p}.noWorkflows`),
          steps: t(`${p}.steps`),
          activate: t(`${p}.activate`),
          pause: t(`${p}.pause`),
          resume: t(`${p}.resume`),
          templateCreated: t(`${p}.templateCreated`),
          statusUpdated: t(`${p}.statusUpdated`),
          actionFailed: t(`${p}.actionFailed`),
          blueprintTitle: t(`${p}.blueprintTitle`),
          blueprintPhase40: t(`${p}.blueprintPhase40`),
          workflowObjectives: t(`${p}.workflowObjectives`),
          workflowExamples: t(`${p}.workflowExamples`),
          approvalPrinciples: t(`${p}.approvalPrinciples`),
          explainabilityPrinciples: t(`${p}.explainabilityPrinciples`),
          marketplaceConnection: t(`${p}.marketplaceConnection`),
          selfLoveConnection: t(`${p}.selfLoveConnection`),
          dogfooding: t(`${p}.dogfooding`),
          aipifyGroup: t(`${p}.aipifyGroup`),
          unonight: t(`${p}.unonight`),
          successCriteria: t(`${p}.successCriteria`),
          visionPhrases: t(`${p}.visionPhrases`),
          orchestrationSummary: t(`${p}.orchestrationSummary`),
          activeWorkflows: t(`${p}.activeWorkflows`),
          awaitingApproval: t(`${p}.awaitingApproval`),
          totalExecutions: t(`${p}.totalExecutions`),
          orchestrationHealth: t(`${p}.orchestrationHealth`),
          humanOversight: t(`${p}.humanOversight`),
          operationsCenter: t(`${p}.operationsCenter`),
          trustActions: t(`${p}.trustActions`),
          businessPacks: t(`${p}.businessPacks`),
          marketplace: t(`${p}.marketplace`),
          selfLove: t(`${p}.selfLove`),
          integrationLinks: t(`${p}.integrationLinks`),
          actionCenter: t(`${p}.actionCenter`),
          actionHub: t(`${p}.actionHub`),
          operationsCenter79: t(`${p}.operationsCenter79`),
          aoobpTitle: t(`${p}.autonomousOperationsOrchestration.title`),
          aoobpPhase86: t(`${p}.autonomousOperationsOrchestration.phase86`),
          aoobpObjectives: t(`${p}.autonomousOperationsOrchestration.objectives`),
          aoobpAutonomyLevels: t(`${p}.autonomousOperationsOrchestration.autonomyLevels`),
          aoobpApprovalRequired: t(`${p}.autonomousOperationsOrchestration.approvalRequired`),
          aoobpOperationalExamples: t(`${p}.autonomousOperationsOrchestration.operationalExamples`),
          aoobpHumanApproval: t(`${p}.autonomousOperationsOrchestration.humanApproval`),
          aoobpAuditTransparency: t(`${p}.autonomousOperationsOrchestration.auditTransparency`),
          aoobpSafetyPrinciples: t(`${p}.autonomousOperationsOrchestration.safetyPrinciples`),
          aoobpCompanionGuidance: t(`${p}.autonomousOperationsOrchestration.companionGuidance`),
          aoobpTrustConnection: t(`${p}.autonomousOperationsOrchestration.trustConnection`),
          aoobpDogfooding: t(`${p}.autonomousOperationsOrchestration.dogfooding`),
          aoobpSuccessCriteria: t(`${p}.autonomousOperationsOrchestration.successCriteria`),
          aoobpIntegrationLinks: t(`${p}.autonomousOperationsOrchestration.integrationLinks`),
          awobp133Title: t(`${p}.phase133.title`),
          awobp133Phase133: t(`${p}.phase133.phase133`),
          awobp133EngagementSummary: t(`${p}.phase133.engagementSummary`),
          awobp133Objectives: t(`${p}.phase133.objectives`),
          awobp133OrchestrationCenter: t(`${p}.phase133.orchestrationCenter`),
          awobp133SupportedTypes: t(`${p}.phase133.supportedTypes`),
          awobp133TemplateLibraryCount: t(`${p}.phase133.templateLibraryCount`),
          awobp133VisualBuilder: t(`${p}.phase133.visualBuilder`),
          awobp133WorkflowTriggers: t(`${p}.phase133.workflowTriggers`),
          awobp133ApprovalFramework: t(`${p}.phase133.approvalFramework`),
          awobp133CompanionParticipation: t(`${p}.phase133.companionParticipation`),
          awobp133CompanionLimitations: t(`${p}.phase133.companionLimitations`),
          awobp133ExceptionManagement: t(`${p}.phase133.exceptionManagement`),
          awobp133WorkflowAnalytics: t(`${p}.phase133.workflowAnalytics`),
          awobp133TemplateLibrary: t(`${p}.phase133.templateLibrary`),
          awobp133SecurityRequirements: t(`${p}.phase133.securityRequirements`),
          awobp133TwoFactor: t(`${p}.phase133.twoFactor`),
          awobp133SelfLoveConnection: t(`${p}.phase133.selfLoveConnection`),
          awobp133Dogfooding: t(`${p}.phase133.dogfooding`),
          awobp133SuccessCriteria: t(`${p}.phase133.successCriteria`),
          awobp133VisionPhrases: t(`${p}.phase133.visionPhrases`),
          awobp133IntegrationLinks: t(`${p}.phase133.integrationLinks`),
          companionWorkforce: t(`${p}.companionWorkforce`),
          growthPartnerOps: t(`${p}.growthPartnerOps`),
        }}
      />
    </div>
  );
}
