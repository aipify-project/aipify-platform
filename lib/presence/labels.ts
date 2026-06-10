import type { createTranslator } from "@/lib/i18n/translate";
import type { PresenceLabels } from "@/components/presence/PresenceProvider";

type Translator = ReturnType<typeof createTranslator>;

export function buildPresenceLabels(t: Translator): PresenceLabels {
  return {
    indicatorTitle: t("presence.indicator.title"),
    indicatorAria: t("presence.indicator.aria"),
    centerTitle: t("presence.center.title"),
    close: t("presence.center.close"),
    loading: t("presence.center.loading"),
    currentState: t("presence.center.currentState"),
    currentActivity: t("presence.center.currentActivity"),
    status: t("presence.center.status"),
    estimatedCompletion: t("presence.center.estimatedCompletion"),
    riskLevel: t("presence.center.riskLevel"),
    seconds: t("presence.center.seconds"),
    metrics: {
      automationsRunning: t("presence.center.metrics.automationsRunning"),
      learningToday: t("presence.center.metrics.learningToday"),
      healingToday: t("presence.center.metrics.healingToday"),
      pendingApprovals: t("presence.center.metrics.pendingApprovals"),
      systemHealth: t("presence.center.metrics.systemHealth"),
    },
    sections: {
      activities: t("presence.center.sections.activities"),
      recommendations: t("presence.center.sections.recommendations"),
      history: t("presence.center.sections.history"),
      executiveSummary: t("presence.center.sections.executiveSummary"),
      settings: t("presence.center.sections.settings"),
    },
    states: {
      standby: t("presence.states.standby"),
      analysing: t("presence.states.analysing"),
      working: t("presence.states.working"),
      learning: t("presence.states.learning"),
      self_healing: t("presence.states.selfHealing"),
      human_approval_required: t("presence.states.humanApproval"),
      critical_attention: t("presence.states.critical"),
    },
    stateMessages: {
      standby: t("presence.stateMessages.standby"),
      analysing: t("presence.stateMessages.analysing"),
      working: t("presence.stateMessages.working"),
      learning: t("presence.stateMessages.learning"),
      self_healing: t("presence.stateMessages.selfHealing"),
      human_approval_required: t("presence.stateMessages.humanApproval"),
      critical_attention: t("presence.stateMessages.critical"),
    },
    settings: {
      animationIntensity: t("presence.settings.animationIntensity"),
      presenceVisible: t("presence.settings.presenceVisible"),
      executiveSummaries: t("presence.settings.executiveSummaries"),
      selfHealingNotifications: t("presence.settings.selfHealingNotifications"),
      approvalNotifications: t("presence.settings.approvalNotifications"),
      soundEnabled: t("presence.settings.soundEnabled"),
      intensities: {
        subtle: t("presence.settings.intensities.subtle"),
        normal: t("presence.settings.intensities.normal"),
        enhanced: t("presence.settings.intensities.enhanced"),
      },
      save: t("presence.settings.save"),
      saved: t("presence.settings.saved"),
    },
    empty: {
      history: t("presence.empty.history"),
      recommendations: t("presence.empty.recommendations"),
    },
  };
}
