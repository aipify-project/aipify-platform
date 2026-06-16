import type { ActivityHistoryLabels } from "./types";
import type { Translator } from "@/lib/i18n/translate";

export function buildActivityHistoryLabels(t: Translator): ActivityHistoryLabels {
  const p = "customerApp.portalStructure.activityHistory";
  return {
    title: t(`${p}.title`),
    subtitle: t(`${p}.subtitle`),
    loading: t(`${p}.loading`),
    principle: t(`${p}.principle`),
    emptyTitle: t(`${p}.emptyTitle`),
    emptyBody: t(`${p}.emptyBody`),
    filters: {
      title: t(`${p}.filters.title`),
      eventType: t(`${p}.filters.eventType`),
      module: t(`${p}.filters.module`),
      user: t(`${p}.filters.user`),
      severity: t(`${p}.filters.severity`),
      dateFrom: t(`${p}.filters.dateFrom`),
      dateTo: t(`${p}.filters.dateTo`),
      search: t(`${p}.filters.search`),
      searchPlaceholder: t(`${p}.filters.searchPlaceholder`),
      all: t(`${p}.filters.all`),
    },
    timeline: {
      today: t(`${p}.timeline.today`),
      yesterday: t(`${p}.timeline.yesterday`),
      thisWeek: t(`${p}.timeline.thisWeek`),
      earlier: t(`${p}.timeline.earlier`),
    },
    card: {
      user: t(`${p}.card.user`),
      module: t(`${p}.card.module`),
      viewRelated: t(`${p}.card.viewRelated`),
    },
    eventTypes: {
      follow_up_created: t(`${p}.eventTypes.followUpCreated`),
      follow_up_completed: t(`${p}.eventTypes.followUpCompleted`),
      decision_recorded: t(`${p}.eventTypes.decisionRecorded`),
      decision_evaluated: t(`${p}.eventTypes.decisionEvaluated`),
      approval_requested: t(`${p}.eventTypes.approvalRequested`),
      approval_completed: t(`${p}.eventTypes.approvalCompleted`),
      task_updated: t(`${p}.eventTypes.taskUpdated`),
      integration_connected: t(`${p}.eventTypes.integrationConnected`),
      business_pack_installed: t(`${p}.eventTypes.businessPackInstalled`),
      billing_event: t(`${p}.eventTypes.billingEvent`),
      security_event: t(`${p}.eventTypes.securityEvent`),
      support_event: t(`${p}.eventTypes.supportEvent`),
      system_recommendation: t(`${p}.eventTypes.systemRecommendation`),
    },
    severities: {
      info: t(`${p}.severities.info`),
      notice: t(`${p}.severities.notice`),
      important: t(`${p}.severities.important`),
      critical: t(`${p}.severities.critical`),
    },
    modules: {
      follow_ups: t(`${p}.modules.followUps`),
      decision_center: t(`${p}.modules.decisionCenter`),
      approvals: t(`${p}.modules.approvals`),
      tasks: t(`${p}.modules.tasks`),
      integrations: t(`${p}.modules.integrations`),
      business_packs: t(`${p}.modules.businessPacks`),
      billing: t(`${p}.modules.billing`),
      security: t(`${p}.modules.security`),
      support: t(`${p}.modules.support`),
      system: t(`${p}.modules.system`),
    },
    faq: {
      title: t(`${p}.faq.title`),
      whatIs: t(`${p}.faq.whatIs`),
      whatIsAnswer: t(`${p}.faq.whatIsAnswer`),
      whoCanSee: t(`${p}.faq.whoCanSee`),
      whoCanSeeAnswer: t(`${p}.faq.whoCanSeeAnswer`),
      canDelete: t(`${p}.faq.canDelete`),
      canDeleteAnswer: t(`${p}.faq.canDeleteAnswer`),
    },
  };
}
