import type { PresenceEventType } from "./notifications";

/** Professional presence copy — avoid enthusiasm and spam (Phase 25). */
export const PRESENCE_MESSAGE_TEMPLATES: Record<
  PresenceEventType,
  { title: string; body: string }
> = {
  support_cases_resolved: {
    title: "Support cases resolved",
    body: "Support Specialist resolved customer questions.",
  },
  executive_briefing_ready: {
    title: "Executive summary ready",
    body: "Your executive summary is ready.",
  },
  installation_completed: {
    title: "Installation completed",
    body: "Aipify finished connecting to your platform.",
  },
  payment_issue_detected: {
    title: "Payment attention needed",
    body: "Aipify detected a billing issue requiring review.",
  },
  subscription_issue_detected: {
    title: "Subscription attention needed",
    body: "Aipify detected a subscription issue requiring review.",
  },
  approval_awaiting_action: {
    title: "Approval awaiting action",
    body: "An item requires your approval before Aipify can proceed.",
  },
  recommendation_generated: {
    title: "New recommendation",
    body: "Aipify generated a recommendation for your review.",
  },
  health_warning_detected: {
    title: "Health warning",
    body: "Aipify detected unusual activity requiring attention.",
  },
  update_scheduled: {
    title: "Update scheduled",
    body: "A safe update is scheduled. No action required unless notified.",
  },
  automation_completed: {
    title: "Automation completed",
    body: "A scheduled automation finished successfully.",
  },
  customer_escalation_detected: {
    title: "Escalation detected",
    body: "A customer escalation requires your attention.",
  },
  new_opportunity_identified: {
    title: "New opportunity",
    body: "Aipify identified a new operational opportunity for your review.",
  },
  companion_reply_ready: {
    title: "Aipify has a reply ready",
    body: "Your Companion answer is ready to review.",
  },
};

export const PRESENCE_PERSONALITY_RULES = [
  "Communicate professionally and calmly.",
  "Avoid excessive enthusiasm.",
  "Never spam or interrupt unnecessarily.",
  "Critical alerts may bypass quiet hours.",
] as const;
