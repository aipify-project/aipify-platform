import { OrganizationalImpactCenterPanel } from "@/components/app/organizational-impact-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalImpactCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalImpactCenter";

  return (
    <OrganizationalImpactCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalExcellenceLink: t(`${p}.organizationalExcellenceLink`),
        organizationalPurposeLink: t(`${p}.organizationalPurposeLink`),
        organizationalLegacyLink: t(`${p}.organizationalLegacyLink`),
        organizationalStewardshipLink: t(`${p}.organizationalStewardshipLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        reflectionsTitle: t(`${p}.reflectionsTitle`),
        indicatorsTitle: t(`${p}.indicatorsTitle`),
        initiativesTitle: t(`${p}.initiativesTitle`),
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
        scheduleReflection: t(`${p}.scheduleReflection`),
        markReflection: t(`${p}.markReflection`),
        documentInitiative: t(`${p}.documentInitiative`),
        completeInitiative: t(`${p}.completeInitiative`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateDiscussion: t(`${p}.coordinateDiscussion`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        impactProfile: t(`${p}.impactProfile`),
        positiveTrend: t(`${p}.positiveTrend`),
        domains: {
          customer: t(`${p}.domains.customer`),
          employee: t(`${p}.domains.employee`),
          community: t(`${p}.domains.community`),
          industry: t(`${p}.domains.industry`),
          economic: t(`${p}.domains.economic`),
          organizational: t(`${p}.domains.organizational`),
        },
        indicatorTypes: {
          customer_outcome: t(`${p}.indicatorTypes.customer_outcome`),
          employee_experience: t(`${p}.indicatorTypes.employee_experience`),
          community_engagement: t(`${p}.indicatorTypes.community_engagement`),
          strategic_contribution: t(`${p}.indicatorTypes.strategic_contribution`),
          long_term_influence: t(`${p}.indicatorTypes.long_term_influence`),
        },
        indicatorTones: {
          positive: t(`${p}.indicatorTones.positive`),
          neutral: t(`${p}.indicatorTones.neutral`),
          attention: t(`${p}.indicatorTones.attention`),
        },
        initiativeStatuses: {
          planned: t(`${p}.initiativeStatuses.planned`),
          in_progress: t(`${p}.initiativeStatuses.in_progress`),
          completed: t(`${p}.initiativeStatuses.completed`),
          documented: t(`${p}.initiativeStatuses.documented`),
        },
        reflectionStatuses: {
          open: t(`${p}.reflectionStatuses.open`),
          reflected: t(`${p}.reflectionStatuses.reflected`),
        },
        healthLabels: {
          exceptional: t(`${p}.healthLabels.exceptional`),
          strong: t(`${p}.healthLabels.strong`),
          meaningful: t(`${p}.healthLabels.meaningful`),
          developing: t(`${p}.healthLabels.developing`),
          reflection_recommended: t(`${p}.healthLabels.reflection_recommended`),
        },
        timelineTypes: {
          customer_milestone: t(`${p}.timelineTypes.customer_milestone`),
          community_initiative: t(`${p}.timelineTypes.community_initiative`),
          employee_development: t(`${p}.timelineTypes.employee_development`),
          industry_contribution: t(`${p}.timelineTypes.industry_contribution`),
          organizational_breakthrough: t(`${p}.timelineTypes.organizational_breakthrough`),
        },
        reviewTypes: {
          quarterly_impact: t(`${p}.reviewTypes.quarterly_impact`),
          annual_reflection: t(`${p}.reviewTypes.annual_reflection`),
          executive_stewardship: t(`${p}.reviewTypes.executive_stewardship`),
          legacy_planning: t(`${p}.reviewTypes.legacy_planning`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          stewardship_discussion: t(`${p}.sessionTypes.stewardship_discussion`),
          legacy_workshop: t(`${p}.sessionTypes.legacy_workshop`),
        },
        metrics: {
          customer: t(`${p}.metrics.customer`),
          employee: t(`${p}.metrics.employee`),
          community: t(`${p}.metrics.community`),
          purpose: t(`${p}.metrics.purpose`),
          mission: t(`${p}.metrics.mission`),
          initiatives: t(`${p}.metrics.initiatives`),
          stakeholders: t(`${p}.metrics.stakeholders`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          stakeholders: t(`${p}.executiveFields.stakeholders`),
          mission: t(`${p}.executiveFields.mission`),
          opportunities: t(`${p}.executiveFields.opportunities`),
          influence: t(`${p}.executiveFields.influence`),
        },
      }}
    />
  );
}
