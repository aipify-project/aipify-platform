import type {
  ReminderCategoryKey,
  ReminderFollowupEntry,
  ReminderFollowupScenarioKey,
  ReminderFrequencyLevel,
} from "./types";

export const REMINDER_FOLLOWUP_PRINCIPLE =
  "People forget. Aipify remembers. People decide.";

export const REMINDER_FOLLOWUP_FINAL_PRINCIPLE =
  "Aipify remembers. Aipify encourages. Aipify helps people follow through. People remain in control.";

export const REMINDER_FOLLOWUP_VISION =
  "You mentioned this was important to you. Would you like help moving it forward?";

export const REMINDER_GENERAL_STRUCTURE =
  "I noticed there may still be a few items waiting for your attention. Would you like me to help organize them?";

export const REMINDER_AVOID_PHRASES = [
  "You forgot.",
  "You still haven't done this.",
  "You're behind.",
  "You missed this.",
  "You ignored this.",
  "You failed to respond.",
] as const;

export const REMINDER_PREFERRED_PHRASES = [
  "It may still require attention.",
  "It appears to remain unfinished.",
  "It could be helpful to revisit this.",
  "This may deserve review.",
] as const;

export const REMINDER_FREQUENCY_LEVELS: ReminderFrequencyLevel[] = [
  "minimal",
  "balanced",
  "proactive",
  "highly_proactive",
];

export const REMINDER_CATEGORY_KEYS: ReminderCategoryKey[] = [
  "email",
  "task",
  "meeting",
  "support",
  "sales",
  "relationship",
];

export const REMINDER_FOLLOWUP_VOCABULARY: Record<
  ReminderFollowupScenarioKey,
  ReminderFollowupEntry
> = {
  email_unanswered: {
    key: "email_unanswered",
    label: "Unanswered email",
    scenario: "Unanswered email detected.",
    response:
      "You may have an email that still requires a response. Would you like me to prepare a draft reply?",
    domain: "email",
  },
  email_important_contact: {
    key: "email_important_contact",
    label: "Important contact unanswered",
    scenario: "Important contact not answered.",
    response:
      "It appears that a contact may still be waiting for a response. I can help you review the conversation if you'd like.",
    domain: "email",
  },
  email_unsent_draft: {
    key: "email_unsent_draft",
    label: "Unsent draft",
    scenario: "Email draft never sent.",
    response:
      "You have an unsent email draft that may require your attention. Would you like me to reopen it?",
    domain: "email",
  },
  email_missing_attachment: {
    key: "email_missing_attachment",
    label: "Missing attachment",
    scenario: "Attachment mentioned but missing.",
    response:
      "It looks like an attachment may have been referenced but not included. Would you like me to verify before sending?",
    domain: "email",
  },
  contact_promised_followup: {
    key: "contact_promised_followup",
    label: "Promised follow-up",
    scenario: "Promised follow-up not completed.",
    response:
      "You had planned to follow up regarding this matter. Would you like me to help you continue where you left off?",
    domain: "contact",
  },
  contact_long_silent: {
    key: "contact_long_silent",
    label: "Long silence",
    scenario: "Long period without contacting customer.",
    response:
      "It has been some time since the last interaction with this customer. A quick check-in may be beneficial.",
    domain: "contact",
  },
  contact_vip_no_contact: {
    key: "contact_vip_no_contact",
    label: "VIP no contact",
    scenario: "VIP customer not contacted recently.",
    response:
      "A valued customer has not received recent follow-up. Would you like assistance preparing a message?",
    domain: "contact",
  },
  meeting_approaching: {
    key: "meeting_approaching",
    label: "Meeting approaching",
    scenario: "Meeting approaching.",
    response: "You have an upcoming meeting. Would you like a preparation summary?",
    domain: "meeting",
    dashboardPath: "/app/assistant/calendars",
  },
  meeting_no_agenda: {
    key: "meeting_no_agenda",
    label: "No agenda",
    scenario: "No agenda prepared.",
    response:
      "This meeting currently has no preparation notes. I can help you organize key discussion points.",
    domain: "meeting",
    dashboardPath: "/app/assistant/calendars",
  },
  meeting_followup_missing: {
    key: "meeting_followup_missing",
    label: "Meeting follow-up missing",
    scenario: "Follow-up after meeting missing.",
    response:
      "It appears that meeting follow-up actions have not yet been completed. I can summarize the next steps.",
    domain: "meeting",
    dashboardPath: "/app/action-center",
  },
  task_overdue: {
    key: "task_overdue",
    label: "Overdue tasks",
    scenario: "Overdue task detected.",
    response:
      "You have tasks that have remained unfinished longer than expected. Would you like help prioritizing them?",
    domain: "task",
    dashboardPath: "/app/action-center",
  },
  task_repeated_postpone: {
    key: "task_repeated_postpone",
    label: "Repeated postponement",
    scenario: "Repeated postponement.",
    response:
      "This item has been postponed several times. I can help break it into smaller steps if that would be useful.",
    domain: "task",
  },
  task_high_priority_pending: {
    key: "task_high_priority_pending",
    label: "High-priority pending",
    scenario: "High-priority task pending.",
    response:
      "There are high-priority tasks awaiting attention. I can prepare a recommended order for completion.",
    domain: "task",
    dashboardPath: "/app/action-center",
  },
  support_cases_unresolved: {
    key: "support_cases_unresolved",
    label: "Unresolved support",
    scenario: "Support cases unresolved.",
    response:
      "There are support cases that may require follow-up. I can identify the most urgent ones.",
    domain: "support",
    dashboardPath: "/app/settings/support-operations",
  },
  support_customer_waiting: {
    key: "support_customer_waiting",
    label: "Customer waiting",
    scenario: "Customer waiting.",
    response:
      "Some customers have been waiting longer than usual. Would you like me to prepare suggested responses?",
    domain: "support",
    dashboardPath: "/app/settings/support-operations",
  },
  sales_lead_followup: {
    key: "sales_lead_followup",
    label: "Lead follow-up",
    scenario: "Lead requires follow-up.",
    response:
      "A follow-up opportunity appears to be approaching. Timely contact may improve outcomes.",
    domain: "sales",
    dashboardPath: "/app/action-center",
  },
  sales_proposal_unanswered: {
    key: "sales_proposal_unanswered",
    label: "Unanswered proposal",
    scenario: "Proposal unanswered.",
    response:
      "A proposal remains unanswered. Would you like me to help prepare the next communication?",
    domain: "sales",
    dashboardPath: "/app/action-center",
  },
  sales_opportunity_cooling: {
    key: "sales_opportunity_cooling",
    label: "Cooling opportunity",
    scenario: "Potential opportunity cooling down.",
    response:
      "This opportunity may benefit from renewed attention before momentum decreases further.",
    domain: "sales",
    dashboardPath: "/app/action-center",
  },
  productivity_unfinished_items: {
    key: "productivity_unfinished_items",
    label: "Unfinished items",
    scenario: "Many unfinished items.",
    response:
      "You currently have several outstanding commitments. I can help organize them into manageable priorities.",
    domain: "productivity",
    dashboardPath: "/app/action-center",
  },
  productivity_buried_item: {
    key: "productivity_buried_item",
    label: "Buried item",
    scenario: "Important item buried.",
    response:
      "An important item may have become less visible among newer activities. Would you like a review of your priorities?",
    domain: "productivity",
    dashboardPath: "/app/action-center",
  },
  productivity_daily_review: {
    key: "productivity_daily_review",
    label: "Daily review",
    scenario: "Daily review.",
    response: "Would you like a summary of what still deserves attention today?",
    domain: "productivity",
    dashboardPath: "/app/action-center",
  },
  unread_accumulating: {
    key: "unread_accumulating",
    label: "Unread accumulating",
    scenario: "Unread messages accumulating.",
    response:
      "You have unread messages that may deserve review. I can summarize the most important ones.",
    domain: "unread",
  },
  unread_important_contact: {
    key: "unread_important_contact",
    label: "Unread from important contact",
    scenario: "Unread messages from important contact.",
    response: "There are unread messages from contacts who may require your attention.",
    domain: "unread",
  },
  unread_critical_notification: {
    key: "unread_critical_notification",
    label: "Critical notification",
    scenario: "Critical notification unread.",
    response:
      "A notification marked as important has not yet been reviewed. Would you like me to summarize it?",
    domain: "unread",
  },
  relationship_customer_birthday: {
    key: "relationship_customer_birthday",
    label: "Customer birthday",
    scenario: "Customer birthday approaching.",
    response:
      "A customer's birthday is approaching. A thoughtful message may strengthen the relationship.",
    domain: "relationship",
  },
  relationship_employee_anniversary: {
    key: "relationship_employee_anniversary",
    label: "Employee anniversary",
    scenario: "Employee anniversary approaching.",
    response:
      "An employee milestone is approaching. Recognition can help strengthen engagement.",
    domain: "relationship",
  },
  relationship_personal_reminder: {
    key: "relationship_personal_reminder",
    label: "Personal reminder",
    scenario: "Personal reminder.",
    response:
      "You previously asked me to remind you about this occasion. Would you like assistance preparing for it?",
    domain: "relationship",
  },
  promise_user_action: {
    key: "promise_user_action",
    label: "Promised action",
    scenario: "User promised action.",
    response:
      "You had intended to complete this follow-up. Would you like help finishing it?",
    domain: "promise",
  },
  promise_deadline_approaching: {
    key: "promise_deadline_approaching",
    label: "Deadline approaching",
    scenario: "Commitment approaching deadline.",
    response:
      "A commitment you previously identified as important is approaching its deadline.",
    domain: "promise",
  },
  promise_multiple_overdue: {
    key: "promise_multiple_overdue",
    label: "Multiple overdue commitments",
    scenario: "Multiple commitments overdue.",
    response:
      "There are several commitments that may benefit from review. I can help prioritize them.",
    domain: "promise",
    dashboardPath: "/app/action-center",
  },
  daily_morning_summary: {
    key: "daily_morning_summary",
    label: "Morning summary",
    scenario: "Morning summary.",
    response:
      "Good morning. Would you like an overview of today's meetings, priorities, messages and follow-ups?",
    domain: "daily_assistant",
    dashboardPath: "/app/assistant/calendars",
  },
  daily_midday_summary: {
    key: "daily_midday_summary",
    label: "Midday summary",
    scenario: "Midday summary.",
    response: "Would you like a quick review of what still deserves attention today?",
    domain: "daily_assistant",
    dashboardPath: "/app/action-center",
  },
  daily_end_of_day_summary: {
    key: "daily_end_of_day_summary",
    label: "End-of-day summary",
    scenario: "End-of-day summary.",
    response: "Before finishing for the day, I can help review any remaining priorities.",
    domain: "daily_assistant",
    dashboardPath: "/app/action-center",
  },
  daily_weekly_review: {
    key: "daily_weekly_review",
    label: "Weekly review",
    scenario: "Weekly review.",
    response:
      "Would you like a summary of unfinished items and suggested priorities for the coming week?",
    domain: "daily_assistant",
    dashboardPath: "/app/action-center",
  },
  memory_forget_context: {
    key: "memory_forget_context",
    label: "Forgotten context",
    scenario: "User forgets context.",
    response:
      "Would it help if I summarized the previous discussions and outstanding decisions?",
    domain: "memory",
  },
  memory_returning_absence: {
    key: "memory_returning_absence",
    label: "Returning after absence",
    scenario: "Returning after absence.",
    response:
      "Welcome back. I can provide an overview of what has changed since you were last active.",
    domain: "memory",
    dashboardPath: "/app/action-center",
  },
  memory_user_asks_reminders: {
    key: "memory_user_asks_reminders",
    label: "Reminder assistance",
    scenario: "User asks for reminders.",
    response:
      "I can help you remember important commitments and provide reminders when appropriate.",
    domain: "memory",
  },
  positive_followup_completed: {
    key: "positive_followup_completed",
    label: "Follow-up completed",
    scenario: "User completes follow-up.",
    response: "That follow-up has now been completed.",
    domain: "positive",
  },
  positive_important_action_done: {
    key: "positive_important_action_done",
    label: "Important action done",
    scenario: "Important action finished.",
    response:
      "You've addressed an important item. Is there anything else I can help organize?",
    domain: "positive",
  },
  positive_inbox_reduced: {
    key: "positive_inbox_reduced",
    label: "Inbox progress",
    scenario: "Inbox reduced.",
    response: "Your inbox has become much more manageable. Nice progress.",
    domain: "positive",
  },
};

export function getReminderFollowupVocabulary(
  key: ReminderFollowupScenarioKey
): ReminderFollowupEntry {
  return REMINDER_FOLLOWUP_VOCABULARY[key];
}
