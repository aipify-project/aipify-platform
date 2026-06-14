import { OrganizationalSustainabilityCenterPanel } from "@/components/app/organizational-sustainability-center";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalSustainabilityCenterPage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["customerApp"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalSustainabilityCenter";

  return (
    <OrganizationalSustainabilityCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalRenewalLink: t(`${p}.organizationalRenewalLink`),
        organizationalFlourishingLink: t(`${p}.organizationalFlourishingLink`),
        organizationalResilienceLink: t(`${p}.organizationalResilienceLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        concernsTitle: t(`${p}.concernsTitle`),
        growthTitle: t(`${p}.growthTitle`),
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
        completeInitiative: t(`${p}.completeInitiative`),
        generateReport: t(`${p}.generateReport`),
        printSummary: t(`${p}.printSummary`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateReview: t(`${p}.coordinateReview`),
        archiveMilestone: t(`${p}.archiveMilestone`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        sustainabilityScore: t(`${p}.sustainabilityScore`),
        sustainabilityTrend: t(`${p}.sustainabilityTrend`),
        domains: {
          workforce: t(`${p}.domains.workforce`),
          customer: t(`${p}.domains.customer`),
          operational: t(`${p}.domains.operational`),
          financial: t(`${p}.domains.financial`),
          leadership: t(`${p}.domains.leadership`),
          strategic: t(`${p}.domains.strategic`),
        },
        concernTypes: {
          overextension_risk: t(`${p}.concernTypes.overextension_risk`),
          resource_imbalance: t(`${p}.concernTypes.resource_imbalance`),
          recovery_limitation: t(`${p}.concernTypes.recovery_limitation`),
          growth_sustainability: t(`${p}.concernTypes.growth_sustainability`),
          long_term_opportunity: t(`${p}.concernTypes.long_term_opportunity`),
        },
        concernTones: {
          positive: t(`${p}.concernTones.positive`),
          neutral: t(`${p}.concernTones.neutral`),
          attention: t(`${p}.concernTones.attention`),
        },
        growthTypes: {
          maintainable_growth: t(`${p}.growthTypes.maintainable_growth`),
          resource_alignment: t(`${p}.growthTypes.resource_alignment`),
          people_support: t(`${p}.growthTypes.people_support`),
          system_preparedness: t(`${p}.growthTypes.system_preparedness`),
          responsible_success: t(`${p}.growthTypes.responsible_success`),
        },
        initiativeStatuses: {
          planned: t(`${p}.initiativeStatuses.planned`),
          in_progress: t(`${p}.initiativeStatuses.in_progress`),
          completed: t(`${p}.initiativeStatuses.completed`),
        },
        healthLabels: {
          thriving: t(`${p}.healthLabels.thriving`),
          healthy: t(`${p}.healthLabels.healthy`),
          stable: t(`${p}.healthLabels.stable`),
          attention_recommended: t(`${p}.healthLabels.attention_recommended`),
          unsustainable_risk: t(`${p}.healthLabels.unsustainable_risk`),
        },
        timelineTypes: {
          resilience_milestone: t(`${p}.timelineTypes.resilience_milestone`),
          leadership_development: t(`${p}.timelineTypes.leadership_development`),
          operational_improvement: t(`${p}.timelineTypes.operational_improvement`),
          strategic_reassessment: t(`${p}.timelineTypes.strategic_reassessment`),
          sustainability_initiative: t(`${p}.timelineTypes.sustainability_initiative`),
        },
        reviewTypes: {
          quarterly_sustainability: t(`${p}.reviewTypes.quarterly_sustainability`),
          annual_viability: t(`${p}.reviewTypes.annual_viability`),
          leadership_reflection: t(`${p}.reviewTypes.leadership_reflection`),
          strategic_sustainability: t(`${p}.reviewTypes.strategic_sustainability`),
        },
        sessionTypes: {
          reflection_session: t(`${p}.sessionTypes.reflection_session`),
          viability_discussion: t(`${p}.sessionTypes.viability_discussion`),
          sustainability_workshop: t(`${p}.sessionTypes.sustainability_workshop`),
        },
        metrics: {
          workforce: t(`${p}.metrics.workforce`),
          operational: t(`${p}.metrics.operational`),
          strategic: t(`${p}.metrics.strategic`),
          leadership: t(`${p}.metrics.leadership`),
          financial: t(`${p}.metrics.financial`),
          resilience: t(`${p}.metrics.resilience`),
          initiatives: t(`${p}.metrics.initiatives`),
          reviews: t(`${p}.metrics.reviews`),
        },
        executiveFields: {
          viability: t(`${p}.executiveFields.viability`),
          leadership: t(`${p}.executiveFields.leadership`),
          resilience: t(`${p}.executiveFields.resilience`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
