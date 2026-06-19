import type { Translator } from "@/lib/i18n/translate";
import type { ProactiveLabels, ProactiveTab } from "./types";
import { PROACTIVE_TABS } from "./constants";

export function buildProactiveLabels(t: Translator): ProactiveLabels {
  const p = "proactiveOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    watchlistsTitle: t(`${p}.watchlistsTitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      PROACTIVE_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<ProactiveTab, string>,
    overview: {
      observationCount: t(`${p}.overview.observationCount`),
      attentionRequired: t(`${p}.overview.attentionRequired`),
      immediateReview: t(`${p}.overview.immediateReview`),
      opportunitiesIdentified: t(`${p}.overview.opportunitiesIdentified`),
      preparedActionsReady: t(`${p}.overview.preparedActionsReady`),
      pendingRecommendations: t(`${p}.overview.pendingRecommendations`),
      watchlistsActive: t(`${p}.overview.watchlistsActive`),
      healthScore: t(`${p}.overview.healthScore`),
      decisionPacksReady: t(`${p}.overview.decisionPacksReady`),
    },
    actions: {
      refreshProactive: t(`${p}.actions.refreshProactive`),
      createObservation: t(`${p}.actions.createObservation`),
      identifyOpportunity: t(`${p}.actions.identifyOpportunity`),
      generatePreparedAction: t(`${p}.actions.generatePreparedAction`),
      approveRecommendation: t(`${p}.actions.approveRecommendation`),
      rejectRecommendation: t(`${p}.actions.rejectRecommendation`),
      addWatchlist: t(`${p}.actions.addWatchlist`),
      openWatchlists: t(`${p}.actions.openWatchlists`),
      openApprovals: t(`${p}.actions.openApprovals`),
      openCompanionTeams: t(`${p}.actions.openCompanionTeams`),
    },
    sections: {
      observationFeed: t(`${p}.sections.observationFeed`),
      operationalHealth: t(`${p}.sections.operationalHealth`),
      decisionPacks: t(`${p}.sections.decisionPacks`),
      businessPackIntegration: t(`${p}.sections.businessPackIntegration`),
      companionAdvisor: t(`${p}.sections.companionAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    observationStatus: {
      informational: t(`${p}.observationStatus.informational`),
      attention_required: t(`${p}.observationStatus.attention_required`),
      immediate_review: t(`${p}.observationStatus.immediate_review`),
    },
    healthStatus: {
      healthy: t(`${p}.healthStatus.healthy`),
      watch_closely: t(`${p}.healthStatus.watch_closely`),
      immediate_action: t(`${p}.healthStatus.immediate_action`),
    },
  };
}
