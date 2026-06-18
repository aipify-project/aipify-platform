import { OrganizationalDigitalTwinCenterPanel } from "@/components/app/organizational-digital-twin-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalDigitalTwinCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalDigitalTwinCenter";

  return (
    <OrganizationalDigitalTwinCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        digitalTwinEngineLink: t(`${p}.digitalTwinEngineLink`),
        changeManagementLink: t(`${p}.changeManagementLink`),
        organizationalHealthLink: t(`${p}.organizationalHealthLink`),
        simulationsLink: t(`${p}.simulationsLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        domainsTitle: t(`${p}.domainsTitle`),
        nodesTitle: t(`${p}.nodesTitle`),
        relationshipsTitle: t(`${p}.relationshipsTitle`),
        dependenciesTitle: t(`${p}.dependenciesTitle`),
        visualizationsTitle: t(`${p}.visualizationsTitle`),
        impactTitle: t(`${p}.impactTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        comparisonsTitle: t(`${p}.comparisonsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        captureSnapshot: t(`${p}.captureSnapshot`),
        completeReview: t(`${p}.completeReview`),
        generateSummary: t(`${p}.generateSummary`),
        exportMap: t(`${p}.exportMap`),
        generateDiagram: t(`${p}.generateDiagram`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        domains: {
          organizational: t(`${p}.domains.organizational`),
          workflow: t(`${p}.domains.workflow`),
          automation: t(`${p}.domains.automation`),
          technology: t(`${p}.domains.technology`),
          knowledge: t(`${p}.domains.knowledge`),
        },
        nodeTypes: {
          department: t(`${p}.nodeTypes.department`),
          team: t(`${p}.nodeTypes.team`),
          workflow: t(`${p}.nodeTypes.workflow`),
          automation: t(`${p}.nodeTypes.automation`),
          integration: t(`${p}.nodeTypes.integration`),
          knowledge: t(`${p}.nodeTypes.knowledge`),
        },
        relationshipTypes: {
          handoff: t(`${p}.relationshipTypes.handoff`),
          approval: t(`${p}.relationshipTypes.approval`),
          dependency: t(`${p}.relationshipTypes.dependency`),
          knowledge: t(`${p}.relationshipTypes.knowledge`),
          system: t(`${p}.relationshipTypes.system`),
        },
        vizTypes: {
          org_map: t(`${p}.vizTypes.org_map`),
          workflow_diagram: t(`${p}.vizTypes.workflow_diagram`),
          dependency_network: t(`${p}.vizTypes.dependency_network`),
          escalation_structure: t(`${p}.vizTypes.escalation_structure`),
          automation_map: t(`${p}.vizTypes.automation_map`),
        },
        riskLevels: {
          low: t(`${p}.riskLevels.low`),
          medium: t(`${p}.riskLevels.medium`),
          high: t(`${p}.riskLevels.high`),
          critical: t(`${p}.riskLevels.critical`),
        },
        metrics: {
          nodes: t(`${p}.metrics.nodes`),
          relationships: t(`${p}.metrics.relationships`),
          dependencies: t(`${p}.metrics.dependencies`),
          workflowHealth: t(`${p}.metrics.workflowHealth`),
          automation: t(`${p}.metrics.automation`),
          knowledge: t(`${p}.metrics.knowledge`),
          maturity: t(`${p}.metrics.maturity`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          complexity: t(`${p}.executiveFields.complexity`),
          risks: t(`${p}.executiveFields.risks`),
          maturity: t(`${p}.executiveFields.maturity`),
          opportunities: t(`${p}.executiveFields.opportunities`),
          priorities: t(`${p}.executiveFields.priorities`),
        },
      }}
    />
  );
}
