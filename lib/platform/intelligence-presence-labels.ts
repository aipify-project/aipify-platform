type TranslateFn = (key: string) => string;

export function buildIntelligencePresenceLabels(t: TranslateFn, variant: "brain" | "selfHealing" = "brain") {
  return {
    title:
      variant === "selfHealing"
        ? t("platform.intelligence.presence.selfHealingTitle")
        : t("platform.intelligence.presence.title"),
    currentState: t("platform.intelligence.presence.currentState"),
    activeSignals: t("platform.intelligence.presence.activeSignals"),
    healingToday: t("platform.intelligence.presence.healingToday"),
    pendingReviews: t("platform.intelligence.presence.pendingReviews"),
    systemConfidence: t("platform.intelligence.presence.systemConfidence"),
    currentAction: t("platform.intelligence.presence.currentAction"),
    estimatedCompletion: t("platform.intelligence.presence.estimatedCompletion"),
    riskLevel: t("platform.intelligence.presence.riskLevel"),
    approvalRequired: t("platform.intelligence.presence.approvalRequired"),
    lastResult: t("platform.intelligence.presence.lastResult"),
    yes: t("platform.intelligence.presence.yes"),
    no: t("platform.intelligence.presence.no"),
    confidenceHigh: t("platform.intelligence.presence.confidenceHigh"),
    confidenceMedium: t("platform.intelligence.presence.confidenceMedium"),
    confidenceLow: t("platform.intelligence.presence.confidenceLow"),
    seconds: t("platform.intelligence.presence.seconds"),
    learningEventsDetected: t("platform.intelligence.presence.learningEventsDetected"),
    recommendationsAwaiting: t("platform.intelligence.presence.recommendationsAwaiting"),
    completedToday: t("platform.intelligence.presence.completedToday"),
  };
}
