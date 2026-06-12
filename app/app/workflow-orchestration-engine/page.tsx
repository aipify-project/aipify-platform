import { WorkflowOrchestrationEngineDashboardPanel } from "@/components/app/workflow-orchestration-engine";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function WorkflowOrchestrationEnginePage() {
  const dict = await getDictionary(await getLocale(), ["customerApp"]);
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
        }}
      />
    </div>
  );
}
