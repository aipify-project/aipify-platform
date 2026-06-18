import { OrganizationalMomentumCenterPanel } from "@/components/app/organizational-momentum-center";
import { getCustomerAppDictionaryForSplits } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function OrganizationalMomentumCenterPage() {
  const locale = await getLocale();
  const dict = await getCustomerAppDictionaryForSplits(locale, ["dashboard"]);
  const t = createTranslator(dict);
  const p = "customerApp.organizationalMomentumCenter";

  return (
    <OrganizationalMomentumCenterPanel
      labels={{
        title: t(`${p}.title`),
        subtitle: t(`${p}.subtitle`),
        loading: t(`${p}.loading`),
        corePrinciple: t(`${p}.corePrinciple`),
        philosophyTitle: t(`${p}.philosophyTitle`),
        visionTitle: t(`${p}.visionTitle`),
        executiveLink: t(`${p}.executiveLink`),
        organizationalTrustLink: t(`${p}.organizationalTrustLink`),
        organizationalStewardshipLink: t(`${p}.organizationalStewardshipLink`),
        organizationalSimplicityLink: t(`${p}.organizationalSimplicityLink`),
        organizationalPurposeLink: t(`${p}.organizationalPurposeLink`),
        dashboardTitle: t(`${p}.dashboardTitle`),
        signalsTitle: t(`${p}.signalsTitle`),
        recognitionTitle: t(`${p}.recognitionTitle`),
        reviewsTitle: t(`${p}.reviewsTitle`),
        timelineTitle: t(`${p}.timelineTitle`),
        achievementsTitle: t(`${p}.achievementsTitle`),
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
        scheduleSession: t(`${p}.scheduleSession`),
        recognizeMilestone: t(`${p}.recognizeMilestone`),
        generateSummary: t(`${p}.generateSummary`),
        printReport: t(`${p}.printReport`),
        exportSnapshot: t(`${p}.exportSnapshot`),
        coordinateCelebration: t(`${p}.coordinateCelebration`),
        archiveAchievement: t(`${p}.archiveAchievement`),
        humansDecide: t(`${p}.humansDecide`),
        privacyNote: t(`${p}.privacyNote`),
        momentumScore: t(`${p}.momentumScore`),
        domains: {
          strategic: t(`${p}.domains.strategic`),
          operational: t(`${p}.domains.operational`),
          customer: t(`${p}.domains.customer`),
          learning: t(`${p}.domains.learning`),
          leadership: t(`${p}.domains.leadership`),
        },
        signalTypes: {
          sustained_progress: t(`${p}.signalTypes.sustained_progress`),
          emerging_stagnation: t(`${p}.signalTypes.emerging_stagnation`),
          breakthrough_period: t(`${p}.signalTypes.breakthrough_period`),
          recovery_period: t(`${p}.signalTypes.recovery_period`),
          momentum_practice: t(`${p}.signalTypes.momentum_practice`),
        },
        signalTones: {
          positive: t(`${p}.signalTones.positive`),
          neutral: t(`${p}.signalTones.neutral`),
          attention: t(`${p}.signalTones.attention`),
        },
        recognitionStatuses: {
          pending: t(`${p}.recognitionStatuses.pending`),
          recognized: t(`${p}.recognitionStatuses.recognized`),
        },
        recognitionTypes: {
          strategic_breakthrough: t(`${p}.recognitionTypes.strategic_breakthrough`),
          customer_success: t(`${p}.recognitionTypes.customer_success`),
          learning_achievement: t(`${p}.recognitionTypes.learning_achievement`),
          improvement_completed: t(`${p}.recognitionTypes.improvement_completed`),
          growth_moment: t(`${p}.recognitionTypes.growth_moment`),
        },
        healthLabels: {
          accelerating: t(`${p}.healthLabels.accelerating`),
          strong: t(`${p}.healthLabels.strong`),
          steady: t(`${p}.healthLabels.steady`),
          slowing: t(`${p}.healthLabels.slowing`),
          stalled: t(`${p}.healthLabels.stalled`),
        },
        timelineTypes: {
          major_achievement: t(`${p}.timelineTypes.major_achievement`),
          recovery_period: t(`${p}.timelineTypes.recovery_period`),
          initiative_breakthrough: t(`${p}.timelineTypes.initiative_breakthrough`),
          strategic_milestone: t(`${p}.timelineTypes.strategic_milestone`),
          growth_moment: t(`${p}.timelineTypes.growth_moment`),
        },
        reviewTypes: {
          monthly_momentum: t(`${p}.reviewTypes.monthly_momentum`),
          quarterly_progress: t(`${p}.reviewTypes.quarterly_progress`),
          annual_achievement: t(`${p}.reviewTypes.annual_achievement`),
          executive_momentum: t(`${p}.reviewTypes.executive_momentum`),
        },
        sessionTypes: {
          momentum_reflection: t(`${p}.sessionTypes.momentum_reflection`),
          progress_review: t(`${p}.sessionTypes.progress_review`),
          milestone_celebration: t(`${p}.sessionTypes.milestone_celebration`),
        },
        metrics: {
          trend: t(`${p}.metrics.trend`),
          positive: t(`${p}.metrics.positive`),
          initiative: t(`${p}.metrics.initiative`),
          reviews: t(`${p}.metrics.reviews`),
          consistency: t(`${p}.metrics.consistency`),
          learning: t(`${p}.metrics.learning`),
          pendingRecognitions: t(`${p}.metrics.pendingRecognitions`),
          confidence: t(`${p}.metrics.confidence`),
        },
        executiveFields: {
          strategic: t(`${p}.executiveFields.strategic`),
          consistency: t(`${p}.executiveFields.consistency`),
          confidence: t(`${p}.executiveFields.confidence`),
          opportunities: t(`${p}.executiveFields.opportunities`),
        },
      }}
    />
  );
}
