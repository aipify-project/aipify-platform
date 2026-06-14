import { OrganizationalLegacyCenterPanel } from "@/components/app/organizational-legacy-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalLegacyCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalLegacyCenter";

  return (
    <OrganizationalLegacyCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalWisdomLink: t(`${p}.organizationalWisdomLink`),
        organizationalMemoryLink: t(`${p}.organizationalMemoryLink`),
        organizationalLearningLink: t(`${p}.organizationalLearningLink`),
        purposeValuesLink: t(`${p}.purposeValuesLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        projectsTitle: t(`${p}.projectsTitle`),
        milestonesTitle: t(`${p}.milestonesTitle`),
        valuesTitle: t(`${p}.valuesTitle`),
        archiveTitle: t(`${p}.archiveTitle`),
        reflectionsTitle: t(`${p}.reflectionsTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        sessionsTitle: t(`${p}.sessionsTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        completeSession: t(`${p}.completeSession`),
        scheduleSession: t(`${p}.scheduleSession`),
        generateReport: t(`${p}.generateReport`),
        printTimeline: t(`${p}.printTimeline`),
        exportReflection: t(`${p}.exportReflection`),
        archiveRecord: t(`${p}.archiveRecord`),
        createCollection: t(`${p}.createCollection`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        legacyScore: t(`${p}.legacyScore`),
        domains: {
          founding: t(`${p}.domains.founding`),
          cultural: t(`${p}.domains.cultural`),
          community: t(`${p}.domains.community`),
          customer: t(`${p}.domains.customer`),
          employee: t(`${p}.domains.employee`),
          leadership: t(`${p}.domains.leadership`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          maturing: t(`${p}.healthLabels.maturing`),
          developing: t(`${p}.healthLabels.developing`),
          emerging: t(`${p}.healthLabels.emerging`),
        },
        timelineTypes: {
          founding_event: t(`${p}.timelineTypes.founding_event`),
          growth_milestone: t(`${p}.timelineTypes.growth_milestone`),
          major_achievement: t(`${p}.timelineTypes.major_achievement`),
          organizational_transition: t(`${p}.timelineTypes.organizational_transition`),
          significant_lesson: t(`${p}.timelineTypes.significant_lesson`),
          cultural_moment: t(`${p}.timelineTypes.cultural_moment`),
        },
        sessionTypes: {
          leadership_reflection: t(`${p}.sessionTypes.leadership_reflection`),
          quarterly_stewardship: t(`${p}.sessionTypes.quarterly_stewardship`),
          annual_legacy_review: t(`${p}.sessionTypes.annual_legacy_review`),
          values_preservation: t(`${p}.sessionTypes.values_preservation`),
        },
        metrics: {
          projects: t(`${p}.metrics.projects`),
          milestones: t(`${p}.metrics.milestones`),
          values: t(`${p}.metrics.values`),
          archives: t(`${p}.metrics.archives`),
          reflection: t(`${p}.metrics.reflection`),
          continuity: t(`${p}.metrics.continuity`),
          awareness: t(`${p}.metrics.awareness`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          milestones: t(`${p}.executiveFields.milestones`),
          continuity: t(`${p}.executiveFields.continuity`),
          reflection: t(`${p}.executiveFields.reflection`),
          stewardship: t(`${p}.executiveFields.stewardship`),
        },
      }}
    />
  );
}
