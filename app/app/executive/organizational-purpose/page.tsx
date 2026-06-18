import { OrganizationalPurposeCenterPanel } from "@/components/app/organizational-purpose-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalPurposeCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalPurposeCenter";

  return (
    <OrganizationalPurposeCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalLegacyLink: t(`${p}.organizationalLegacyLink`),
        organizationalWisdomLink: t(`${p}.organizationalWisdomLink`),
        organizationalAlignmentLink: t(`${p}.organizationalAlignmentLink`),
        purposeValuesLink: t(`${p}.purposeValuesLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        alignmentTitle: t(`${p}.alignmentTitle`),
        reflectionsTitle: t(`${p}.reflectionsTitle`),
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
        scheduleDiscussion: t(`${p}.scheduleDiscussion`),
        generateReport: t(`${p}.generateReport`),
        printReflection: t(`${p}.printReflection`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        coordinateReflection: t(`${p}.coordinateReflection`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        purposeScore: t(`${p}.purposeScore`),
        domains: {
          mission_clarity: t(`${p}.domains.mission_clarity`),
          values_alignment: t(`${p}.domains.values_alignment`),
          customer_purpose: t(`${p}.domains.customer_purpose`),
          employee_purpose: t(`${p}.domains.employee_purpose`),
          community_purpose: t(`${p}.domains.community_purpose`),
        },
        alignmentAreas: {
          strategy: t(`${p}.alignmentAreas.strategy`),
          culture: t(`${p}.alignmentAreas.culture`),
          customer_promises: t(`${p}.alignmentAreas.customer_promises`),
          leadership_decisions: t(`${p}.alignmentAreas.leadership_decisions`),
          organizational_behaviors: t(`${p}.alignmentAreas.organizational_behaviors`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          maturing: t(`${p}.healthLabels.maturing`),
          developing: t(`${p}.healthLabels.developing`),
          emerging: t(`${p}.healthLabels.emerging`),
        },
        timelineTypes: {
          mission_update: t(`${p}.timelineTypes.mission_update`),
          cultural_milestone: t(`${p}.timelineTypes.cultural_milestone`),
          leadership_reflection: t(`${p}.timelineTypes.leadership_reflection`),
          community_contribution: t(`${p}.timelineTypes.community_contribution`),
          strategic_reaffirmation: t(`${p}.timelineTypes.strategic_reaffirmation`),
        },
        reviewTypes: {
          annual_purpose: t(`${p}.reviewTypes.annual_purpose`),
          executive_reflection: t(`${p}.reviewTypes.executive_reflection`),
          strategic_planning: t(`${p}.reviewTypes.strategic_planning`),
          cultural_alignment: t(`${p}.reviewTypes.cultural_alignment`),
        },
        sessionTypes: {
          leadership_discussion: t(`${p}.sessionTypes.leadership_discussion`),
          organizational_reflection: t(`${p}.sessionTypes.organizational_reflection`),
          purpose_planning: t(`${p}.sessionTypes.purpose_planning`),
        },
        metrics: {
          clarity: t(`${p}.metrics.clarity`),
          valuesAlignment: t(`${p}.metrics.valuesAlignment`),
          leadership: t(`${p}.metrics.leadership`),
          reflections: t(`${p}.metrics.reflections`),
          strategic: t(`${p}.metrics.strategic`),
          employee: t(`${p}.metrics.employee`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          mission: t(`${p}.executiveFields.mission`),
          values: t(`${p}.executiveFields.values`),
          reflection: t(`${p}.executiveFields.reflection`),
          impact: t(`${p}.executiveFields.impact`),
        },
      }}
    />
  );
}
