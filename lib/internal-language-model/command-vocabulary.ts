import type { UserCommandEntry, UserCommandKey } from "./types";

export const COMMAND_CORE_PRINCIPLE =
  "Aipify helps you move faster, but never outside your approved business rules.";

export const COMMAND_ACTION_STEPS = ["understand", "prepare", "approve", "execute"] as const;

export const UNIVERSAL_SAFE_PHRASES = [
  "I can prepare this for approval.",
  "I will not take action without your confirmation.",
  "This requires access to your connected system.",
  "This action may affect customer communication, so approval is required.",
  "I can create a draft first.",
  "I can show you a preview before anything is sent.",
  "I can turn this into an automation rule if you want this handled repeatedly.",
  "I have prepared the action, but it needs approval before execution.",
  "This action is blocked because it exceeds the current safety level.",
] as const;

export const COMMAND_AVOID_PHRASES = [
  "I will handle everything automatically.",
  "I have full control.",
  "No approval is needed.",
  "I replaced your team.",
  "I can access anything.",
  "I deleted this for you.",
  "I sent this without asking.",
] as const;

export const PACKAGE_UPGRADE_WORDING = {
  businessPro:
    "This function is available in Aipify Business Pro or Enterprise because it can affect business operations and requires stronger permission control.",
  autonomous:
    "Autonomous execution is available in Aipify Enterprise because it requires advanced safety rules, audit logging and administrator permissions.",
} as const;

export const USER_COMMAND_VOCABULARY: Record<UserCommandKey, UserCommandEntry> = {
  email_overview: {
    key: "email_overview",
    label: "Email overview",
    intent: "Access connected email, review messages and create a structured overview.",
    integration: "email",
    riskLevel: "low",
    requiresApproval: false,
    safeResponse:
      "I can do that. I will review your connected email and create a structured overview of what needs attention. I will group messages by priority, customer requests, invoices, meetings and follow-ups. I will not send, delete, archive, forward or reply to anything without your approval.",
    categories: [
      "Important emails",
      "Unanswered emails",
      "Customer requests",
      "Invoices and payments",
      "Meetings and appointments",
      "Follow-up tasks",
      "Suggested replies",
      "Emails requiring human review",
      "Potential urgent issues",
    ],
  },
  email_tasks: {
    key: "email_tasks",
    label: "Tasks from email",
    intent: "Convert emails or messages into actionable tasks.",
    integration: "email",
    riskLevel: "medium",
    requiresApproval: true,
    safeResponse:
      "I can review the messages and prepare suggested tasks based on what needs follow-up. I will show you the task list before creating anything.",
    categories: [
      "Urgent follow-up",
      "Customer response needed",
      "Internal review",
      "Invoice/payment follow-up",
      "Meeting preparation",
      "Waiting for reply",
      "Escalation needed",
    ],
    dashboardPath: "/app/action-center",
  },
  calendar_availability: {
    key: "calendar_availability",
    label: "Calendar availability",
    intent: "Review calendar availability and suggest time slots.",
    integration: "calendar",
    riskLevel: "low",
    requiresApproval: false,
    safeResponse:
      "I can check available time slots and suggest meeting options. I will not create or send calendar invitations before you approve.",
    dashboardPath: "/app/assistant/calendars",
  },
  support_priority: {
    key: "support_priority",
    label: "Support priority overview",
    intent: "Review support queue and prioritize cases.",
    integration: "helpdesk",
    riskLevel: "low",
    requiresApproval: false,
    safeResponse:
      "I can review the support queue and create a priority overview. I will identify urgent cases, repeated questions, unresolved issues and tickets that may need escalation.",
    categories: [
      "Urgent customer problems",
      "Repeated questions",
      "Refund or payment issues",
      "Technical issues",
      "VIP customers",
      "Tickets waiting too long",
      "Suggested replies",
      "Cases requiring human review",
    ],
    dashboardPath: "/app/settings/support-operations",
  },
  sales_follow_up: {
    key: "sales_follow_up",
    label: "Sales follow-up plan",
    intent: "Analyze leads and suggest follow-up actions.",
    integration: "crm",
    riskLevel: "medium",
    requiresApproval: true,
    safeResponse:
      "I can analyze your leads and prepare a follow-up plan. I can suggest messages, priorities and next steps, but I will not contact customers without approval.",
    categories: [
      "Hot leads",
      "Cold leads",
      "Follow-up needed",
      "Suggested message",
      "Recommended timing",
      "Risk of losing lead",
      "Estimated opportunity",
    ],
    dashboardPath: "/app/action-center",
  },
  bulk_approve: {
    key: "bulk_approve",
    label: "Bulk approval",
    intent: "Review and approve pending Aipify actions.",
    integration: "action_center",
    riskLevel: "medium",
    requiresApproval: true,
    safeResponse:
      "I can show you all pending actions grouped by risk level. Low-risk actions can be approved in bulk if your permissions allow it, but medium and high-risk actions should be reviewed individually.",
    dashboardPath: "/app/action-center",
  },
  automation_rule: {
    key: "automation_rule",
    label: "Automation rule",
    intent: "Create a recurring automation rule with defined boundaries.",
    integration: "execution_rules",
    riskLevel: "high",
    requiresApproval: true,
    safeResponse:
      "I can help create an automation rule for this. Before activating it, I will define the trigger, allowed action, risk level and approval requirements so you remain in control.",
    dashboardPath: "/app/action-center",
  },
};

export function getUserCommandVocabulary(key: UserCommandKey): UserCommandEntry {
  return USER_COMMAND_VOCABULARY[key];
}
