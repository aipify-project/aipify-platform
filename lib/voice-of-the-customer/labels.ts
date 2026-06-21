import type { Translator } from "@/lib/i18n/translate";
import type {
  VocFeedbackCenterLabels,
  VocGlobalInsightsLabels,
  VocWidgetLabels,
} from "./types";
import {
  CUSTOMER_STATUSES,
  FEEDBACK_PRIORITIES,
  FEEDBACK_TYPES,
  WORKFLOW_STATUSES,
} from "./constants";

export function buildVocWidgetLabels(t: Translator): VocWidgetLabels {
  const p = "customerApp.voiceOfCustomer";

  return {
    trigger: t(`${p}.trigger`),
    triggerShort: t(`${p}.triggerShort`),
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    type: t(`${p}.type`),
    feedbackTitle: t(`${p}.feedbackTitle`),
    description: t(`${p}.description`),
    priority: t(`${p}.priority`),
    wantsResponse: t(`${p}.wantsResponse`),
    noResponse: t(`${p}.noResponse`),
    contactMe: t(`${p}.contactMe`),
    includeContext: t(`${p}.includeContext`),
    submit: t(`${p}.submit`),
    submitting: t(`${p}.submitting`),
    acknowledgementTitle: t(`${p}.acknowledgementTitle`),
    acknowledgementBody: t(`${p}.acknowledgementBody`),
    historyTitle: t(`${p}.historyTitle`),
    historyEmpty: t(`${p}.historyEmpty`),
    feedbackTypes: Object.fromEntries(
      FEEDBACK_TYPES.map((key) => [key, t(`${p}.feedbackTypes.${key}`)])
    ) as VocWidgetLabels["feedbackTypes"],
    priorities: Object.fromEntries(
      FEEDBACK_PRIORITIES.map((key) => [key, t(`${p}.priorities.${key}`)])
    ) as VocWidgetLabels["priorities"],
    customerStatuses: Object.fromEntries(
      CUSTOMER_STATUSES.map((key) => [key, t(`${p}.customerStatuses.${key}`)])
    ) as VocWidgetLabels["customerStatuses"],
    close: t(`${p}.close`),
    trustNote: t(`${p}.trustNote`),
    transparencyNote: t(`${p}.transparencyNote`),
    trustStatementLink: t(`${p}.trustStatementLink`),
    trustStatementLinkAria: t(`${p}.trustStatementLinkAria`),
  };
}

export function buildVocFeedbackCenterLabels(t: Translator): VocFeedbackCenterLabels {
  const p = "platform.voiceOfCustomer";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    back: t(`${p}.back`),
    principle: t(`${p}.principle`),
    emptyState: t(`${p}.emptyState`),
    sections: {
      overview: t(`${p}.sections.overview`),
      feedback: t(`${p}.sections.feedback`),
      trends: t(`${p}.sections.trends`),
      topRequests: t(`${p}.sections.topRequests`),
      audit: t(`${p}.sections.audit`),
      filters: t(`${p}.sections.filters`),
    },
    overview: {
      newFeedback: t(`${p}.overview.newFeedback`),
      bugs: t(`${p}.overview.bugs`),
      features: t(`${p}.overview.features`),
      improvements: t(`${p}.overview.improvements`),
      resolved: t(`${p}.overview.resolved`),
      awaitingReview: t(`${p}.overview.awaitingReview`),
    },
    table: {
      category: t(`${p}.table.category`),
      title: t(`${p}.table.title`),
      customer: t(`${p}.table.customer`),
      priority: t(`${p}.table.priority`),
      submitted: t(`${p}.table.submitted`),
      status: t(`${p}.table.status`),
      assignedTo: t(`${p}.table.assignedTo`),
      actions: t(`${p}.table.actions`),
      event: t(`${p}.table.event`),
      count: t(`${p}.table.count`),
    },
    feedbackTypes: Object.fromEntries(
      FEEDBACK_TYPES.map((key) => [key, t(`${p}.feedbackTypes.${key}`)])
    ) as VocFeedbackCenterLabels["feedbackTypes"],
    priorities: Object.fromEntries(
      FEEDBACK_PRIORITIES.map((key) => [key, t(`${p}.priorities.${key}`)])
    ) as VocFeedbackCenterLabels["priorities"],
    statuses: Object.fromEntries(
      WORKFLOW_STATUSES.map((key) => [key, t(`${p}.statuses.${key}`)])
    ) as VocFeedbackCenterLabels["statuses"],
    actions: {
      view: t(`${p}.actions.view`),
      assign: t(`${p}.actions.assign`),
      merge: t(`${p}.actions.merge`),
      updateStatus: t(`${p}.actions.updateStatus`),
      linkPhase: t(`${p}.actions.linkPhase`),
      notify: t(`${p}.actions.notify`),
      applying: t(`${p}.actions.applying`),
    },
    filters: {
      type: t(`${p}.filters.type`),
      status: t(`${p}.filters.status`),
      priority: t(`${p}.filters.priority`),
      allTypes: t(`${p}.filters.allTypes`),
      allStatuses: t(`${p}.filters.allStatuses`),
      allPriorities: t(`${p}.filters.allPriorities`),
      apply: t(`${p}.filters.apply`),
    },
  };
}

export function buildVocGlobalInsightsLabels(t: Translator): VocGlobalInsightsLabels {
  const p = "superAdmin.voiceOfCustomer";

  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    principle: t(`${p}.principle`),
    sections: {
      insights: t(`${p}.sections.insights`),
      initiatives: t(`${p}.sections.initiatives`),
      themes: t(`${p}.sections.themes`),
    },
    insights: {
      totalFeedback: t(`${p}.insights.totalFeedback`),
      onboardingRequests: t(`${p}.insights.onboardingRequests`),
      recommendation: t(`${p}.insights.recommendation`),
    },
    table: {
      title: t(`${p}.table.title`),
      summary: t(`${p}.table.summary`),
      recommendation: t(`${p}.table.recommendation`),
      feedbackCount: t(`${p}.table.feedbackCount`),
      type: t(`${p}.table.type`),
      phase: t(`${p}.table.phase`),
      status: t(`${p}.table.status`),
      theme: t(`${p}.table.theme`),
      count: t(`${p}.table.count`),
    },
    actions: {
      createInitiative: t(`${p}.actions.createInitiative`),
      applying: t(`${p}.actions.applying`),
    },
  };
}
