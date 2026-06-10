import PlatformLearningGovernancePanel from "@/components/platform/PlatformLearningGovernancePanel";
import PlatformLearningQueuePanel from "@/components/platform/PlatformLearningQueuePanel";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { getLocale } from "@/lib/i18n/get-locale";
import { createTranslator } from "@/lib/i18n/translate";

export default async function IntelligenceLearningQueuePage() {
  const locale = await getLocale();
  const dict = await getDictionary(locale, ["platform"]);
  const t = createTranslator(dict);

  return (
    <>
      <PlatformLearningGovernancePanel
        labels={{
          title: t("platform.intelligence.learningGovernance.title"),
          subtitle: t("platform.intelligence.learningGovernance.subtitle"),
          loading: t("platform.intelligence.learningGovernance.loading"),
          rollout: t("platform.intelligence.learningGovernance.rollout"),
          safeguards: t("platform.intelligence.learningGovernance.safeguards"),
          pilot: t("platform.intelligence.learningGovernance.pilot"),
          totals: {
            activeMemories: t("platform.intelligence.learningGovernance.totals.activeMemories"),
            disabledTenants: t("platform.intelligence.learningGovernance.totals.disabledTenants"),
            adaptiveTenants: t("platform.intelligence.learningGovernance.totals.adaptiveTenants"),
          },
        }}
      />
      <PlatformLearningQueuePanel
      locale={locale}
      labels={{
        title: t("platform.intelligence.learningQueue.title"),
        subtitle: t("platform.intelligence.learningQueue.subtitle"),
        loading: t("platform.intelligence.learningQueue.loading"),
        empty: t("platform.intelligence.learningQueue.empty"),
        category: t("platform.intelligence.learningQueue.category"),
        environment: t("platform.intelligence.learningQueue.environment"),
        detections: t("platform.intelligence.learningQueue.detections"),
        confidence: t("platform.intelligence.learningQueue.confidence"),
        impact: t("platform.intelligence.learningQueue.impact"),
        suggestedAction: t("platform.intelligence.learningQueue.suggestedAction"),
        status: t("platform.intelligence.learningQueue.status"),
        firstDetected: t("platform.intelligence.learningQueue.firstDetected"),
        lastDetected: t("platform.intelligence.learningQueue.lastDetected"),
        approveGlobal: t("platform.intelligence.learningQueue.approveGlobal"),
        keepInternal: t("platform.intelligence.learningQueue.keepInternal"),
        needsMoreEvidence: t("platform.intelligence.learningQueue.needsMoreEvidence"),
        reject: t("platform.intelligence.learningQueue.reject"),
        reviewReason: t("platform.intelligence.learningQueue.reviewReason"),
        reviewReasonPlaceholder: t("platform.intelligence.learningQueue.reviewReasonPlaceholder"),
        reviewing: t("platform.intelligence.learningQueue.reviewing"),
        totals: {
          pending: t("platform.intelligence.learningQueue.totals.pending"),
          moreData: t("platform.intelligence.learningQueue.totals.moreData"),
          approved: t("platform.intelligence.learningQueue.totals.approved"),
        },
      }}
    />
    </>
  );
}
