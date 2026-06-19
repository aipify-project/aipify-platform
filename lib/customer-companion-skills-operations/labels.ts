import type { Translator } from "@/lib/i18n/translate";
import type { CompanionSkillsLabels, CompanionSkillsTab } from "./types";
import { SKILL_HEALTH_STATUSES, SKILL_STATUSES } from "./constants";

const TAB_KEYS: CompanionSkillsTab[] = [
  "overview", "installed", "marketplace", "specialists", "knowledge",
  "permissions", "training", "companion", "executive", "reports",
];

export function buildCompanionSkillsLabels(t: Translator): CompanionSkillsLabels {
  const p = "companionSkillsOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    governanceNote: t(`${p}.governanceNote`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    tabs: Object.fromEntries(
      TAB_KEYS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as CompanionSkillsLabels["tabs"],
    overview: {
      installedSkills: t(`${p}.overview.installedSkills`),
      activeSkills: t(`${p}.overview.activeSkills`),
      marketplaceAvailable: t(`${p}.overview.marketplaceAvailable`),
      specialists: t(`${p}.overview.specialists`),
      knowledgeSources: t(`${p}.overview.knowledgeSources`),
      trainingInProgress: t(`${p}.overview.trainingInProgress`),
      capabilityBundles: t(`${p}.overview.capabilityBundles`),
      skillsNeedingAttention: t(`${p}.overview.skillsNeedingAttention`),
    },
    actions: {
      installSkill: t(`${p}.actions.installSkill`),
      activateSkill: t(`${p}.actions.activateSkill`),
      completeTraining: t(`${p}.actions.completeTraining`),
      createSpecialist: t(`${p}.actions.createSpecialist`),
      installBundle: t(`${p}.actions.installBundle`),
      openMarketplace: t(`${p}.actions.openMarketplace`),
      openTraining: t(`${p}.actions.openTraining`),
      openLegacyMarketplace: t(`${p}.actions.openLegacyMarketplace`),
    },
    skillStatuses: Object.fromEntries(
      SKILL_STATUSES.map((key) => [key, t(`${p}.skillStatuses.${key}`)])
    ) as CompanionSkillsLabels["skillStatuses"],
    healthStatuses: Object.fromEntries(
      SKILL_HEALTH_STATUSES.map((key) => [key, t(`${p}.healthStatuses.${key}`)])
    ) as CompanionSkillsLabels["healthStatuses"],
    marketplacePage: {
      title: t(`${p}.marketplacePage.title`),
      subtitle: t(`${p}.marketplacePage.subtitle`),
    },
    trainingPage: {
      title: t(`${p}.trainingPage.title`),
      subtitle: t(`${p}.trainingPage.subtitle`),
    },
  };
}
