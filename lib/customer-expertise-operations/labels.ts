import type { Translator } from "@/lib/i18n/translate";
import type { ExpertiseLabels, ExpertiseTab } from "./types";
import { EXPERTISE_TABS } from "./constants";

export function buildExpertiseLabels(t: Translator): ExpertiseLabels {
  const p = "expertiseOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    tabs: Object.fromEntries(
      EXPERTISE_TABS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as Record<ExpertiseTab, string>,
    overview: {
      expertCount: t(`${p}.overview.expertCount`),
      knowledgeAssets: t(`${p}.overview.knowledgeAssets`),
      ownedAssets: t(`${p}.overview.ownedAssets`),
      unownedAssets: t(`${p}.overview.unownedAssets`),
      criticalRisks: t(`${p}.overview.criticalRisks`),
      successionRisks: t(`${p}.overview.successionRisks`),
      activeMentorships: t(`${p}.overview.activeMentorships`),
      departmentCoverage: t(`${p}.overview.departmentCoverage`),
      companionRecommendations: t(`${p}.overview.companionRecommendations`),
    },
    sections: {
      criticalKnowledgeMap: t(`${p}.sections.criticalKnowledgeMap`),
      successionRisks: t(`${p}.sections.successionRisks`),
      recommendations: t(`${p}.sections.recommendations`),
      executiveDashboard: t(`${p}.sections.executiveDashboard`),
      businessPacks: t(`${p}.sections.businessPacks`),
      companionAdvisor: t(`${p}.sections.companionAdvisor`),
      audit: t(`${p}.sections.audit`),
    },
    actions: {
      refreshExpertise: t(`${p}.actions.refreshExpertise`),
      assignKnowledgeOwner: t(`${p}.actions.assignKnowledgeOwner`),
      generateExpertiseReport: t(`${p}.actions.generateExpertiseReport`),
      requestAssistance: t(`${p}.actions.requestAssistance`),
    },
    riskLevel: {
      low: t(`${p}.riskLevel.low`),
      moderate: t(`${p}.riskLevel.moderate`),
      high: t(`${p}.riskLevel.high`),
      critical: t(`${p}.riskLevel.critical`),
    },
    ownershipStatus: {
      owned: t(`${p}.ownershipStatus.owned`),
      unowned: t(`${p}.ownershipStatus.unowned`),
      review_due: t(`${p}.ownershipStatus.review_due`),
      at_risk: t(`${p}.ownershipStatus.at_risk`),
    },
    availability: {
      available: t(`${p}.availability.available`),
      limited: t(`${p}.availability.limited`),
      busy: t(`${p}.availability.busy`),
      unavailable: t(`${p}.availability.unavailable`),
    },
  };
}
