import type { Translator } from "@/lib/i18n/translate";

export function buildExecutiveCenterLabels(t: Translator) {
  return {
    loading: t("platform.executive.loading"),
    greetingMorning: t("platform.executive.greetingMorning"),
    greetingAfternoon: t("platform.executive.greetingAfternoon"),
    greetingEvening: t("platform.executive.greetingEvening"),
    greetingMorningNoName: t("platform.executive.greetingMorningNoName"),
    greetingAfternoonNoName: t("platform.executive.greetingAfternoonNoName"),
    greetingEveningNoName: t("platform.executive.greetingEveningNoName"),
    greetingSubtext: t("platform.executive.greetingSubtext"),
    sinceLogin: {
      title: t("platform.executive.sinceLogin.title"),
      supportResolved: t("platform.executive.sinceLogin.supportResolved"),
      automationsCompleted: t("platform.executive.sinceLogin.automationsCompleted"),
      approvalWaiting: t("platform.executive.sinceLogin.approvalWaiting"),
      criticalIncidents: t("platform.executive.sinceLogin.criticalIncidents"),
      revenueIncreased: t("platform.executive.sinceLogin.revenueIncreased"),
      footerGreen: t("platform.executive.sinceLogin.footerGreen"),
      footerYellow: t("platform.executive.sinceLogin.footerYellow"),
      footerRed: t("platform.executive.sinceLogin.footerRed"),
    },
    operationalHealth: {
      title: t("platform.executive.operationalHealth.title"),
      signalsTitle: t("platform.executive.operationalHealth.signalsTitle"),
      defaultSignals: [
        t("platform.executive.operationalHealth.signalInfrastructure"),
        t("platform.executive.operationalHealth.signalSupport"),
        t("platform.executive.operationalHealth.signalSecurity"),
        t("platform.executive.operationalHealth.signalWorkspaces"),
      ],
    },
    requiresAttention: {
      title: t("platform.executive.requiresAttention.title"),
      empty: t("platform.executive.requiresAttention.empty"),
      open: t("platform.executive.requiresAttention.open"),
    },
    metrics: {
      activeCustomers: t("platform.executive.metrics.activeCustomers"),
      mrr: t("platform.executive.metrics.mrr"),
      automationSuccess: t("platform.executive.metrics.automationSuccess"),
      customerSatisfaction: t("platform.executive.metrics.customerSatisfaction"),
      trendUp: t("platform.executive.metrics.trendUp"),
    },
    recommendations: {
      title: t("platform.executive.recommendations.title"),
      empty: t("platform.executive.recommendations.empty"),
      observation: t("platform.executive.recommendations.observation"),
      recommendedAction: t("platform.executive.recommendations.recommendedAction"),
      potentialImpact: t("platform.executive.recommendations.potentialImpact"),
      review: t("platform.executive.recommendations.review"),
    },
    timeline: {
      title: t("platform.executive.timeline.title"),
      empty: t("platform.executive.timeline.empty"),
      open: t("platform.executive.timeline.open"),
    },
    customerHealth: {
      title: t("platform.executive.customerHealth.title"),
      operationalHealth: t("platform.executive.customerHealth.operationalHealth"),
      statusHealthy: t("platform.executive.customerHealth.statusHealthy"),
      statusNeedsReview: t("platform.executive.customerHealth.statusNeedsReview"),
      open: t("platform.executive.customerHealth.open"),
      empty: t("platform.executive.customerHealth.empty"),
    },
    askAipify: {
      title: t("platform.executive.askAipify.title"),
      placeholder: t("platform.executive.askAipify.placeholder"),
      submit: t("platform.executive.askAipify.submit"),
      placeholderResponse: t("platform.executive.askAipify.placeholderResponse"),
      prompts: {
        attention: t("platform.executive.askAipify.prompts.attention"),
        support: t("platform.executive.askAipify.prompts.support"),
        atRisk: t("platform.executive.askAipify.prompts.atRisk"),
        failedAutomations: t("platform.executive.askAipify.prompts.failedAutomations"),
        sinceLogin: t("platform.executive.askAipify.prompts.sinceLogin"),
      },
    },
    presence: t("platform.executive.presence"),
    loadError: t("platform.executive.loadError"),
  };
}

export type ExecutiveCenterLabels = ReturnType<typeof buildExecutiveCenterLabels>;
