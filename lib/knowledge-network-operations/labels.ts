import type { Translator } from "@/lib/i18n/translate";
import type { KnowledgeNetworkLabels, KnowledgeNetworkTab } from "./types";
import { WISDOM_STATUSES } from "./constants";

const TAB_KEYS: KnowledgeNetworkTab[] = [
  "overview",
  "knowledge_assets",
  "lessons_learned",
  "playbooks",
  "best_practices",
  "experience",
  "companion",
  "executive",
  "reports",
];

export function buildKnowledgeNetworkLabels(t: Translator): KnowledgeNetworkLabels {
  const p = "knowledgeNetworkOperations";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    accessDenied: t(`${p}.accessDenied`),
    tabs: Object.fromEntries(
      TAB_KEYS.map((key) => [key, t(`${p}.tabs.${key}`)])
    ) as KnowledgeNetworkLabels["tabs"],
    overview: {
      knowledgeAssets: t(`${p}.overview.knowledgeAssets`),
      lessonsLearned: t(`${p}.overview.lessonsLearned`),
      playbooks: t(`${p}.overview.playbooks`),
      bestPractices: t(`${p}.overview.bestPractices`),
      experienceEntries: t(`${p}.overview.experienceEntries`),
      wisdomScore: t(`${p}.overview.wisdomScore`),
      wisdomStatus: t(`${p}.overview.wisdomStatus`),
      retentionPending: t(`${p}.overview.retentionPending`),
      reviewsDue: t(`${p}.overview.reviewsDue`),
    },
    actions: {
      refreshWisdomScore: t(`${p}.actions.refreshWisdomScore`),
      addLesson: t(`${p}.actions.addLesson`),
      publishPlaybook: t(`${p}.actions.publishPlaybook`),
      contributeExperience: t(`${p}.actions.contributeExperience`),
      startRetentionCapture: t(`${p}.actions.startRetentionCapture`),
      markReviewed: t(`${p}.actions.markReviewed`),
      openLessons: t(`${p}.actions.openLessons`),
      openExperience: t(`${p}.actions.openExperience`),
      openKnowledgeGraph: t(`${p}.actions.openKnowledgeGraph`),
    },
    wisdomStatuses: Object.fromEntries(
      WISDOM_STATUSES.map((key) => [key, t(`${p}.wisdomStatuses.${key}`)])
    ) as KnowledgeNetworkLabels["wisdomStatuses"],
    lessonsPage: {
      title: t(`${p}.lessonsPage.title`),
      subtitle: t(`${p}.lessonsPage.subtitle`),
    },
    experiencePage: {
      title: t(`${p}.experiencePage.title`),
      subtitle: t(`${p}.experiencePage.subtitle`),
    },
  };
}
