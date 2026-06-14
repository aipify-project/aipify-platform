import { OrganizationalSimplicityCenterPanel } from "@/components/app/organizational-simplicity-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalSimplicityCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalSimplicityCenter";

  return (
    <OrganizationalSimplicityCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalFocusLink: t(`${p}.organizationalFocusLink`),
        organizationalAlignmentLink: t(`${p}.organizationalAlignmentLink`),
        executionExcellenceLink: t(`${p}.executionExcellenceLink`),
        continuousImprovementLink: t(`${p}.continuousImprovementLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        complexityTitle: t(`${p}.complexityTitle`),
        opportunitiesTitle: t(`${p}.opportunitiesTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        milestonesTitle: t(`${p}.milestonesTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        sessionsTitle: t(`${p}.sessionsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        completeReview: t(`${p}.completeReview`),
        completeSession: t(`${p}.completeSession`),
        scheduleReview: t(`${p}.scheduleReview`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateDiscussion: t(`${p}.coordinateDiscussion`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        simplicityScore: t(`${p}.simplicityScore`),
        domains: {
          process: t(`${p}.domains.process`),
          communication: t(`${p}.domains.communication`),
          technology: t(`${p}.domains.technology`),
          governance: t(`${p}.domains.governance`),
          customer: t(`${p}.domains.customer`),
          leadership: t(`${p}.domains.leadership`),
        },
        detectionTypes: {
          duplicate_process: t(`${p}.detectionTypes.duplicate_process`),
          unnecessary_approval: t(`${p}.detectionTypes.unnecessary_approval`),
          excessive_handoff: t(`${p}.detectionTypes.excessive_handoff`),
          documentation_overload: t(`${p}.detectionTypes.documentation_overload`),
          tool_fragmentation: t(`${p}.detectionTypes.tool_fragmentation`),
          initiative_congestion: t(`${p}.detectionTypes.initiative_congestion`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          simple: t(`${p}.healthLabels.simple`),
          manageable: t(`${p}.healthLabels.manageable`),
          complex: t(`${p}.healthLabels.complex`),
          overcomplicated: t(`${p}.healthLabels.overcomplicated`),
        },
        timelineTypes: {
          process_improvement: t(`${p}.timelineTypes.process_improvement`),
          approval_reduction: t(`${p}.timelineTypes.approval_reduction`),
          tool_consolidation: t(`${p}.timelineTypes.tool_consolidation`),
          communication_enhancement: t(`${p}.timelineTypes.communication_enhancement`),
          strategic_simplification: t(`${p}.timelineTypes.strategic_simplification`),
        },
        reviewTypes: {
          quarterly_simplicity: t(`${p}.reviewTypes.quarterly_simplicity`),
          executive_clarity: t(`${p}.reviewTypes.executive_clarity`),
          workflow_optimization: t(`${p}.reviewTypes.workflow_optimization`),
          annual_simplification: t(`${p}.reviewTypes.annual_simplification`),
        },
        sessionTypes: {
          workflow_review: t(`${p}.sessionTypes.workflow_review`),
          cross_functional_discussion: t(`${p}.sessionTypes.cross_functional_discussion`),
          executive_clarity: t(`${p}.sessionTypes.executive_clarity`),
        },
        severityLabels: {
          low: t(`${p}.severityLabels.low`),
          medium: t(`${p}.severityLabels.medium`),
          high: t(`${p}.severityLabels.high`),
        },
        metrics: {
          complexity: t(`${p}.metrics.complexity`),
          opportunities: t(`${p}.metrics.opportunities`),
          momentum: t(`${p}.metrics.momentum`),
          workflow: t(`${p}.metrics.workflow`),
          clarity: t(`${p}.metrics.clarity`),
          focus: t(`${p}.metrics.focus`),
          approvals: t(`${p}.metrics.approvals`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          complexity: t(`${p}.executiveFields.complexity`),
          focus: t(`${p}.executiveFields.focus`),
          governance: t(`${p}.executiveFields.governance`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
