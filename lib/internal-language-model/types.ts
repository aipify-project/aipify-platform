export type AipifyFunctionKey =
  | "aipify"
  | "support_assistant"
  | "admin_assistant"
  | "knowledge_engine"
  | "business_insights_engine"
  | "continuous_improvement_engine"
  | "action_center"
  | "autonomous_execution_framework"
  | "observer_mode"
  | "assistant_mode"
  | "operator_mode"
  | "autonomous_mode"
  | "audit_log"
  | "approval_flow"
  | "safety_system";

export type FunctionVocabularyEntry = {
  key: AipifyFunctionKey;
  label: string;
  definition: string;
  preferredWording: string;
  importantExplanation?: string;
  replacementResponse?: string;
  capabilities?: string[];
  dashboardPath?: string;
};

export type AipifyFeatureGuidance = {
  detected: boolean;
  functionKey: AipifyFunctionKey;
  reply: string;
  dashboardPath?: string;
  closingPhrase?: string;
};

export type CommandRiskLevel = "low" | "medium" | "high";

export type UserCommandKey =
  | "email_overview"
  | "email_tasks"
  | "calendar_availability"
  | "support_priority"
  | "sales_follow_up"
  | "bulk_approve"
  | "automation_rule";

export type UserCommandEntry = {
  key: UserCommandKey;
  label: string;
  intent: string;
  integration: string;
  riskLevel: CommandRiskLevel;
  requiresApproval: boolean;
  safeResponse: string;
  categories?: string[];
  dashboardPath?: string;
};

export type UserCommandGuidance = {
  detected: boolean;
  commandKey: UserCommandKey;
  reply: string;
  riskLevel: CommandRiskLevel;
  requiresApproval: boolean;
  integration: string;
  dashboardPath?: string;
  closingPhrase?: string;
};

export type NbleDomain =
  | "email"
  | "calendar"
  | "task_management"
  | "support"
  | "sales"
  | "action_center"
  | "emotional";

export type NbleIntentKey =
  | "email_behind"
  | "email_overview_natural"
  | "email_unanswered"
  | "email_cleanup"
  | "email_forgotten"
  | "calendar_time"
  | "calendar_prepare"
  | "calendar_fit"
  | "task_focus"
  | "task_overwhelmed"
  | "task_back_on_track"
  | "support_burning"
  | "support_important"
  | "support_who_first"
  | "sales_who_call"
  | "sales_slipping"
  | "sales_where_time"
  | "action_show_approval"
  | "action_automate"
  | "action_take_care"
  | "emotional_stressed"
  | "emotional_where_start"
  | "emotional_behind";

export type NbleEntry = {
  key: NbleIntentKey;
  label: string;
  humanPhrase: string;
  meanings: string[];
  response: string;
  domain: NbleDomain;
  mapsToCommand?: UserCommandKey;
  dashboardPath?: string;
};

export type BusinessPhraseDomain =
  | "executive"
  | "retail"
  | "marketing"
  | "accounting"
  | "hr"
  | "project_management"
  | "admin"
  | "productivity"
  | "aipify_specific";

export type BusinessLanguageDomain = NbleDomain | BusinessPhraseDomain;

export type BusinessPhraseIntentKey =
  | "exec_big_picture"
  | "exec_morning_briefing"
  | "exec_bottleneck"
  | "exec_worried"
  | "support_waiting_long"
  | "support_most_trouble"
  | "support_answer_faster"
  | "support_angry_customers"
  | "retail_selling_best"
  | "retail_not_moving"
  | "retail_push_week"
  | "retail_stock"
  | "retail_cart_abandon"
  | "sales_closest_buying"
  | "sales_gone_cold"
  | "sales_missing_opportunities"
  | "marketing_working"
  | "marketing_wasting_money"
  | "marketing_test_next"
  | "accounting_paid"
  | "accounting_overdue"
  | "accounting_surprises"
  | "hr_team_status"
  | "hr_overloaded"
  | "project_on_track"
  | "project_blocking"
  | "project_slipped"
  | "admin_waiting"
  | "admin_while_away"
  | "admin_day_looking"
  | "productivity_organized"
  | "productivity_drowning"
  | "productivity_where_start"
  | "aipify_what_would_you_do"
  | "aipify_take_care"
  | "aipify_automate"
  | "aipify_prevent_repeat"
  | "vision_catch_up"
  | "vision_forgot_important"
  | "vision_take_a_look"
  | "vision_make_sense";

export type BusinessLanguageIntentKey = NbleIntentKey | BusinessPhraseIntentKey;

export type BusinessLanguageSource = "nble" | "business_phrase";

export type BusinessPhraseEntry = {
  key: BusinessPhraseIntentKey;
  label: string;
  humanPhrase: string;
  meanings: string[];
  response: string;
  domain: BusinessLanguageDomain;
  mapsToCommand?: UserCommandKey;
  dashboardPath?: string;
};

export type BusinessLanguageEntry = NbleEntry | BusinessPhraseEntry;

export type NbleGuidance = {
  detected: boolean;
  intentKey: BusinessLanguageIntentKey;
  source: BusinessLanguageSource;
  reply: string;
  domain: BusinessLanguageDomain;
  meanings: string[];
  dashboardPath?: string;
  closingPhrase?: string;
};

export type ProactiveGuidanceDomain =
  | "email"
  | "calendar"
  | "support"
  | "sales"
  | "workload"
  | "financial"
  | "project"
  | "security"
  | "automation"
  | "autonomy";

export type ProactiveGuidanceScenarioKey =
  | "email_unreviewed_attachments"
  | "email_emotional_reply"
  | "email_large_recipient_list"
  | "calendar_overlapping_meetings"
  | "calendar_no_prep_time"
  | "support_backlog_increasing"
  | "support_vip_waiting"
  | "sales_lead_neglected"
  | "sales_low_value_focus"
  | "workload_task_overload"
  | "workload_frequent_reschedule"
  | "workload_burnout_risk"
  | "financial_overdue_invoices"
  | "financial_spending_trend"
  | "project_behind_schedule"
  | "project_unclear_ownership"
  | "security_sensitive_action"
  | "security_elevated_permissions"
  | "automation_sensitive_workflow"
  | "automation_scope_too_broad"
  | "autonomy_user_continues"
  | "autonomy_approval_required"
  | "autonomy_action_prohibited";

export type ProactiveGuidanceTrigger = "user_message" | "system_observation";

export type ProactiveGuidanceEntry = {
  key: ProactiveGuidanceScenarioKey;
  label: string;
  scenario: string;
  response: string;
  domain: ProactiveGuidanceDomain;
  consequence?: string;
  saferAlternative?: string;
  dashboardPath?: string;
};

export type ProactiveGuidanceResult = {
  detected: boolean;
  scenarioKey: ProactiveGuidanceScenarioKey;
  reply: string;
  domain: ProactiveGuidanceDomain;
  trigger: ProactiveGuidanceTrigger;
  dashboardPath?: string;
  closingPhrase?: string;
};

export type ReminderFollowupDomain =
  | "email"
  | "contact"
  | "meeting"
  | "task"
  | "support"
  | "sales"
  | "productivity"
  | "unread"
  | "relationship"
  | "promise"
  | "daily_assistant"
  | "memory"
  | "positive";

export type ReminderFrequencyLevel =
  | "minimal"
  | "balanced"
  | "proactive"
  | "highly_proactive";

export type ReminderCategoryKey =
  | "email"
  | "task"
  | "meeting"
  | "support"
  | "sales"
  | "relationship";

export type ReminderFollowupScenarioKey =
  | "email_unanswered"
  | "email_important_contact"
  | "email_unsent_draft"
  | "email_missing_attachment"
  | "contact_promised_followup"
  | "contact_long_silent"
  | "contact_vip_no_contact"
  | "meeting_approaching"
  | "meeting_no_agenda"
  | "meeting_followup_missing"
  | "task_overdue"
  | "task_repeated_postpone"
  | "task_high_priority_pending"
  | "support_cases_unresolved"
  | "support_customer_waiting"
  | "sales_lead_followup"
  | "sales_proposal_unanswered"
  | "sales_opportunity_cooling"
  | "productivity_unfinished_items"
  | "productivity_buried_item"
  | "productivity_daily_review"
  | "unread_accumulating"
  | "unread_important_contact"
  | "unread_critical_notification"
  | "relationship_customer_birthday"
  | "relationship_employee_anniversary"
  | "relationship_personal_reminder"
  | "promise_user_action"
  | "promise_deadline_approaching"
  | "promise_multiple_overdue"
  | "daily_morning_summary"
  | "daily_midday_summary"
  | "daily_end_of_day_summary"
  | "daily_weekly_review"
  | "memory_forget_context"
  | "memory_returning_absence"
  | "memory_user_asks_reminders"
  | "positive_followup_completed"
  | "positive_important_action_done"
  | "positive_inbox_reduced";

export type ReminderFollowupTrigger = "user_message" | "system_observation";

export type ReminderFollowupEntry = {
  key: ReminderFollowupScenarioKey;
  label: string;
  scenario: string;
  response: string;
  domain: ReminderFollowupDomain;
  dashboardPath?: string;
};

export type ReminderFollowupResult = {
  detected: boolean;
  scenarioKey: ReminderFollowupScenarioKey;
  reply: string;
  domain: ReminderFollowupDomain;
  trigger: ReminderFollowupTrigger;
  dashboardPath?: string;
  closingPhrase?: string;
};
