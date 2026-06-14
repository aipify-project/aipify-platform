import { OrganizationalStewardshipCenterPanel } from "@/components/app/organizational-stewardship-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalStewardshipCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalStewardshipCenter";

  return (
    <OrganizationalStewardshipCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalLegacyLink: t(`${p}.organizationalLegacyLink`),
        organizationalMemoryLink: t(`${p}.organizationalMemoryLink`),
        knowledgeEvolutionLink: t(`${p}.knowledgeEvolutionLink`),
        organizationalWisdomLink: t(`${p}.organizationalWisdomLink`),
        capabilityMaturityLink: t(`${p}.capabilityMaturityLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        indicatorsTitle: t(`${p}.indicatorsTitle`),
        reflectionsTitle: t(`${p}.reflectionsTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        highlightsTitle: t(`${p}.highlightsTitle`),
        milestonesTitle: t(`${p}.milestonesTitle`),
        snapshotsTitle: t(`${p}.snapshotsTitle`),
        insightsTitle: t(`${p}.insightsTitle`),
        recommendationsTitle: t(`${p}.recommendationsTitle`),
        executiveTitle: t(`${p}.executiveTitle`),
        sessionsTitle: t(`${p}.sessionsTitle`),
        successionTitle: t(`${p}.successionTitle`),
        emptySection: t(`${p}.emptySection`),
        dismiss: t(`${p}.dismiss`),
        accept: t(`${p}.accept`),
        completeReview: t(`${p}.completeReview`),
        completeSession: t(`${p}.completeSession`),
        scheduleReflection: t(`${p}.scheduleReflection`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateSuccession: t(`${p}.coordinateSuccession`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        stewardshipScore: t(`${p}.stewardshipScore`),
        domains: {
          people: t(`${p}.domains.people`),
          customer: t(`${p}.domains.customer`),
          resource: t(`${p}.domains.resource`),
          knowledge: t(`${p}.domains.knowledge`),
          technology: t(`${p}.domains.technology`),
          community: t(`${p}.domains.community`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          developing: t(`${p}.healthLabels.developing`),
          needs_attention: t(`${p}.healthLabels.needs_attention`),
          reactive: t(`${p}.healthLabels.reactive`),
        },
        reviewTypes: {
          quarterly_stewardship: t(`${p}.reviewTypes.quarterly_stewardship`),
          annual_leadership: t(`${p}.reviewTypes.annual_leadership`),
          succession_preparedness: t(`${p}.reviewTypes.succession_preparedness`),
          long_term_planning: t(`${p}.reviewTypes.long_term_planning`),
        },
        sessionTypes: {
          leadership_reflection: t(`${p}.sessionTypes.leadership_reflection`),
          succession_discussion: t(`${p}.sessionTypes.succession_discussion`),
          long_term_planning: t(`${p}.sessionTypes.long_term_planning`),
        },
        metrics: {
          leadership: t(`${p}.metrics.leadership`),
          resources: t(`${p}.metrics.resources`),
          knowledge: t(`${p}.metrics.knowledge`),
          governance: t(`${p}.metrics.governance`),
          reflection: t(`${p}.metrics.reflection`),
          sustainable: t(`${p}.metrics.sustainable`),
          succession: t(`${p}.metrics.succession`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          continuity: t(`${p}.executiveFields.continuity`),
          readiness: t(`${p}.executiveFields.readiness`),
          responsibility: t(`${p}.executiveFields.responsibility`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
