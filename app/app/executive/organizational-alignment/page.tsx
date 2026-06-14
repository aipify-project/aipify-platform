import { OrganizationalAlignmentCenterPanel } from "@/components/app/organizational-alignment-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalAlignmentCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalAlignmentCenter";

  return (
    <OrganizationalAlignmentCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        executionExcellenceLink: t(`${p}.executionExcellenceLink`),
        capabilityMaturityLink: t(`${p}.capabilityMaturityLink`),
        changeManagementLink: t(`${p}.changeManagementLink`),
        organizationalHealthLink: t(`${p}.organizationalHealthLink`),
        purposeValuesLink: t(`${p}.purposeValuesLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        indicatorsTitle: t(`${p}.indicatorsTitle`),
        prioritiesTitle: t(`${p}.prioritiesTitle`),
        misalignmentsTitle: t(`${p}.misalignmentsTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        completeReview: t(`${p}.completeReview`),
        discussMisalignment: t(`${p}.discussMisalignment`),
        scheduleWorkshop: t(`${p}.scheduleWorkshop`),
        generateSummary: t(`${p}.generateSummary`),
        generateReport: t(`${p}.generateReport`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        owner: t(`${p}.owner`),
        alignmentScore: t(`${p}.alignmentScore`),
        domains: {
          vision: t(`${p}.domains.vision`),
          strategic: t(`${p}.domains.strategic`),
          team: t(`${p}.domains.team`),
          customer: t(`${p}.domains.customer`),
          governance: t(`${p}.domains.governance`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          stable: t(`${p}.healthLabels.stable`),
          needs_attention: t(`${p}.healthLabels.needs_attention`),
          misaligned: t(`${p}.healthLabels.misaligned`),
        },
        misalignmentTypes: {
          conflicting_priorities: t(`${p}.misalignmentTypes.conflicting_priorities`),
          duplicate_initiatives: t(`${p}.misalignmentTypes.duplicate_initiatives`),
          resource_competition: t(`${p}.misalignmentTypes.resource_competition`),
          strategic_disconnect: t(`${p}.misalignmentTypes.strategic_disconnect`),
          communication_inconsistency: t(`${p}.misalignmentTypes.communication_inconsistency`),
        },
        timelineTypes: {
          alignment_improvement: t(`${p}.timelineTypes.alignment_improvement`),
          strategic_shift: t(`${p}.timelineTypes.strategic_shift`),
          org_change: t(`${p}.timelineTypes.org_change`),
          collaboration_milestone: t(`${p}.timelineTypes.collaboration_milestone`),
          executive_intervention: t(`${p}.timelineTypes.executive_intervention`),
        },
        reviewTypes: {
          monthly: t(`${p}.reviewTypes.monthly`),
          quarterly: t(`${p}.reviewTypes.quarterly`),
          annual: t(`${p}.reviewTypes.annual`),
          executive_reflection: t(`${p}.reviewTypes.executive_reflection`),
        },
        metrics: {
          strongAlignment: t(`${p}.metrics.strongAlignment`),
          opportunities: t(`${p}.metrics.opportunities`),
          misalignments: t(`${p}.metrics.misalignments`),
          crossFunctional: t(`${p}.metrics.crossFunctional`),
          goalConsistency: t(`${p}.metrics.goalConsistency`),
          initiativeOverlap: t(`${p}.metrics.initiativeOverlap`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          vision: t(`${p}.executiveFields.vision`),
          strategic: t(`${p}.executiveFields.strategic`),
          collaboration: t(`${p}.executiveFields.collaboration`),
          focus: t(`${p}.executiveFields.focus`),
        },
      }}
    />
  );
}
