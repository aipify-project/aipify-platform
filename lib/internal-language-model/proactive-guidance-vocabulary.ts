import type { ProactiveGuidanceEntry, ProactiveGuidanceScenarioKey } from "./types";

export const PROACTIVE_GUIDANCE_PRINCIPLE =
  "Aipify observes. Aipify informs. Aipify recommends. Humans decide.";

export const PROACTIVE_GUIDANCE_FINAL_PRINCIPLE =
  "Aipify helps people think clearly. Aipify helps people work confidently. Aipify helps people move forward safely. People remain in control.";

export const PROACTIVE_GUIDANCE_VISION =
  "You can absolutely do that. Before you continue, there are a few things you may want to consider.";

export const GENERAL_GUIDANCE_FRAMEWORK =
  "I understand what you're trying to achieve. Before continuing, you may want to consider the potential implications. If you'd like, I can help you explore alternative approaches.";

export const DECISION_SUPPORT_PHRASES = [
  "You may want to consider...",
  "Another option worth exploring could be...",
  "There may be value in reviewing...",
  "This approach could work well, although...",
  "If you'd like, I can help compare alternatives.",
  "Before proceeding, it may be useful to review...",
] as const;

export const POSITIVE_REINFORCEMENT_PHRASES = [
  "This approach aligns well with your stated objective.",
  "That appears to be a thoughtful next step.",
  "This decision may support the outcomes you're aiming for.",
  "You're addressing this proactively, which often improves results.",
] as const;

export const OBSERVATIONAL_PHRASES = [
  "I've noticed...",
  "It appears...",
  "There may be...",
  "Based on recent patterns...",
  "The available information suggests...",
  "This may deserve additional attention.",
] as const;

export const GUIDANCE_AVOID_PHRASES = [
  "You're doing this wrong.",
  "That's a bad idea.",
  "You shouldn't do that.",
  "You're making a mistake.",
] as const;

export const GUIDANCE_PREFERRED_PHRASES = [
  "There may be factors worth considering.",
  "Would you like to review a few alternatives first?",
  "I've identified some potential implications that may be useful to consider.",
] as const;

export const PROACTIVE_GUIDANCE_VOCABULARY: Record<
  ProactiveGuidanceScenarioKey,
  ProactiveGuidanceEntry
> = {
  email_unreviewed_attachments: {
    key: "email_unreviewed_attachments",
    label: "Unreviewed attachments",
    scenario: "User attempts to send an email without reviewing attachments.",
    response:
      "It looks like this email may contain attachments that haven't been reviewed recently. Would you like me to verify everything before sending?",
    domain: "email",
    consequence: "Attachments may be outdated or incorrect.",
    saferAlternative: "Review attachments before sending.",
  },
  email_emotional_reply: {
    key: "email_emotional_reply",
    label: "Emotional reply",
    scenario: "User is replying emotionally.",
    response:
      "This message appears more urgent or emotional than usual. Would you like me to suggest a revised version before sending?",
    domain: "email",
    consequence: "Tone may not reflect your usual professional communication.",
    saferAlternative: "Draft a revised version for review.",
  },
  email_large_recipient_list: {
    key: "email_large_recipient_list",
    label: "Large recipient list",
    scenario: "Large recipient list detected.",
    response:
      "This email will be sent to a larger group than normal. I can help review the recipients to ensure everyone intended is included.",
    domain: "email",
    consequence: "Recipients may be broader than intended.",
    saferAlternative: "Review recipient list before sending.",
  },
  calendar_overlapping_meetings: {
    key: "calendar_overlapping_meetings",
    label: "Overlapping meetings",
    scenario: "User schedules overlapping meetings.",
    response:
      "It appears this meeting overlaps with an existing commitment. Would you like me to suggest alternative times?",
    domain: "calendar",
    consequence: "Scheduling conflicts may affect attendance or preparation.",
    saferAlternative: "Suggest alternative time slots.",
    dashboardPath: "/app/assistant/calendars",
  },
  calendar_no_prep_time: {
    key: "calendar_no_prep_time",
    label: "No preparation time",
    scenario: "No preparation time between meetings.",
    response:
      "Your schedule is becoming quite full. Would you like me to help create preparation time between meetings?",
    domain: "calendar",
    consequence: "Back-to-back meetings may reduce preparation quality.",
    saferAlternative: "Add buffer time between meetings.",
    dashboardPath: "/app/assistant/calendars",
  },
  support_backlog_increasing: {
    key: "support_backlog_increasing",
    label: "Support backlog",
    scenario: "Support backlog increasing.",
    response:
      "The number of unresolved support cases has increased. I can help prioritize the queue and identify where additional attention may be helpful.",
    domain: "support",
    consequence: "Customers may experience longer wait times.",
    saferAlternative: "Prioritize the support queue.",
    dashboardPath: "/app/settings/support-operations",
  },
  support_vip_waiting: {
    key: "support_vip_waiting",
    label: "VIP customers waiting",
    scenario: "Important customers waiting.",
    response:
      "Several high-priority cases have been waiting longer than usual. Would you like me to prepare a recommended action plan?",
    domain: "support",
    consequence: "High-priority customers may need faster follow-up.",
    saferAlternative: "Prepare a recommended action plan.",
    dashboardPath: "/app/settings/support-operations",
  },
  sales_lead_neglected: {
    key: "sales_lead_neglected",
    label: "Neglected lead",
    scenario: "Lead neglected.",
    response:
      "This opportunity hasn't received follow-up recently. A timely check-in may improve the chances of moving things forward.",
    domain: "sales",
    consequence: "Opportunities may cool without timely follow-up.",
    saferAlternative: "Schedule a timely check-in.",
    dashboardPath: "/app/action-center",
  },
  sales_low_value_focus: {
    key: "sales_low_value_focus",
    label: "Low-value focus",
    scenario: "Too much focus on low-value opportunities.",
    response:
      "It may be helpful to review where your time is currently being invested. I can identify opportunities that could deserve greater attention.",
    domain: "sales",
    consequence: "Time may be invested in lower-impact opportunities.",
    saferAlternative: "Reprioritize high-value opportunities.",
    dashboardPath: "/app/action-center",
  },
  workload_task_overload: {
    key: "workload_task_overload",
    label: "Task overload",
    scenario: "Growing task overload.",
    response:
      "You currently have more outstanding items than usual. I can help prioritize what may have the greatest impact.",
    domain: "workload",
    consequence: "Important items may be delayed.",
    saferAlternative: "Prioritize by impact.",
    dashboardPath: "/app/action-center",
  },
  workload_frequent_reschedule: {
    key: "workload_frequent_reschedule",
    label: "Frequent rescheduling",
    scenario: "Frequent rescheduling.",
    response:
      "I've noticed several tasks have been postponed repeatedly. Would you like help breaking them into smaller, more manageable steps?",
    domain: "workload",
    consequence: "Repeated postponement may indicate tasks need restructuring.",
    saferAlternative: "Break tasks into smaller steps.",
  },
  workload_burnout_risk: {
    key: "workload_burnout_risk",
    label: "Burnout indicators",
    scenario: "Potential burnout indicators.",
    response:
      "Your workload appears higher than normal. If helpful, I can organize your priorities to make the next steps clearer.",
    domain: "workload",
    consequence: "Sustained overload may affect focus and wellbeing.",
    saferAlternative: "Organize priorities into clearer next steps.",
  },
  financial_overdue_invoices: {
    key: "financial_overdue_invoices",
    label: "Overdue invoices",
    scenario: "Overdue invoices increasing.",
    response:
      "There appears to be an increase in overdue payments. I can help identify accounts that may benefit from follow-up.",
    domain: "financial",
    consequence: "Cash flow may be affected.",
    saferAlternative: "Identify accounts needing follow-up.",
  },
  financial_spending_trend: {
    key: "financial_spending_trend",
    label: "Spending trend",
    scenario: "Unexpected spending trend.",
    response:
      "I've identified spending patterns that differ from your recent history. Would you like a summary for review?",
    domain: "financial",
    consequence: "Spending may differ from recent patterns.",
    saferAlternative: "Review spending summary.",
  },
  project_behind_schedule: {
    key: "project_behind_schedule",
    label: "Project behind schedule",
    scenario: "Project falling behind.",
    response:
      "This project may require additional attention to remain on schedule. I can summarize potential bottlenecks.",
    domain: "project",
    consequence: "Timeline may slip without intervention.",
    saferAlternative: "Summarize bottlenecks and next steps.",
    dashboardPath: "/app/action-center",
  },
  project_unclear_ownership: {
    key: "project_unclear_ownership",
    label: "Unclear ownership",
    scenario: "Unclear ownership.",
    response:
      "Some responsibilities appear to be undefined. Clarifying ownership may improve execution.",
    domain: "project",
    consequence: "Tasks may stall without clear ownership.",
    saferAlternative: "Clarify responsibility assignments.",
  },
  security_sensitive_action: {
    key: "security_sensitive_action",
    label: "Sensitive action",
    scenario: "Sensitive action requested.",
    response:
      "This action may affect important business information. I recommend reviewing the details carefully before continuing.",
    domain: "security",
    consequence: "Business information may be affected.",
    saferAlternative: "Review details carefully before continuing.",
    dashboardPath: "/app/action-center",
  },
  security_elevated_permissions: {
    key: "security_elevated_permissions",
    label: "Elevated permissions",
    scenario: "High-risk permissions involved.",
    response:
      "This task requires elevated permissions. I can prepare everything for review before execution.",
    domain: "security",
    consequence: "Elevated permissions require careful review.",
    saferAlternative: "Prepare steps for review before execution.",
    dashboardPath: "/app/action-center",
  },
  automation_sensitive_workflow: {
    key: "automation_sensitive_workflow",
    label: "Sensitive automation",
    scenario: "User attempts to automate sensitive workflow.",
    response:
      "This process appears to involve decisions that may benefit from human oversight. Would you like to explore an approval-based approach instead?",
    domain: "automation",
    consequence: "Automated decisions may lack human oversight.",
    saferAlternative: "Use an approval-based automation approach.",
    dashboardPath: "/app/action-center",
  },
  automation_scope_too_broad: {
    key: "automation_scope_too_broad",
    label: "Broad automation scope",
    scenario: "Automation scope too broad.",
    response:
      "This automation may impact a larger portion of the business than intended. I can help narrow the conditions before activation.",
    domain: "automation",
    consequence: "Automation may affect more than intended.",
    saferAlternative: "Narrow automation conditions before activation.",
    dashboardPath: "/app/action-center",
  },
  autonomy_user_continues: {
    key: "autonomy_user_continues",
    label: "User continues despite guidance",
    scenario: "User chooses to continue despite recommendations.",
    response: "Understood. I'll proceed according to your instructions.",
    domain: "autonomy",
  },
  autonomy_approval_required: {
    key: "autonomy_approval_required",
    label: "Approval required",
    scenario: "Approval is required before execution.",
    response: "I can prepare the necessary steps for your review.",
    domain: "autonomy",
    dashboardPath: "/app/action-center",
  },
  autonomy_action_prohibited: {
    key: "autonomy_action_prohibited",
    label: "Action prohibited",
    scenario: "Action falls outside approved safety boundaries.",
    response:
      "I'm unable to perform this action automatically because it falls outside the approved safety boundaries.",
    domain: "autonomy",
  },
};

export function getProactiveGuidanceVocabulary(
  key: ProactiveGuidanceScenarioKey
): ProactiveGuidanceEntry {
  return PROACTIVE_GUIDANCE_VOCABULARY[key];
}
