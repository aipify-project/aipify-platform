export const EXECUTION_LEVELS = ["observer", "assistant", "operator", "autonomous"] as const;

export const ACTION_STATUSES = [
  "draft",
  "pending_approval",
  "approved",
  "rejected",
  "scheduled",
  "executing",
  "executed",
  "failed",
  "cancelled",
  "blocked",
] as const;

export const RISK_LEVELS = ["low", "medium", "high", "critical"] as const;

export const ACTION_TYPES = [
  "send_email",
  "draft_email",
  "create_ticket",
  "create_task",
  "publish_faq",
  "send_notification",
  "create_calendar_event",
  "escalate_case",
  "start_workflow",
  "customer_follow_up",
] as const;

export const FORBIDDEN_ACTION_TYPES = [
  "delete_database",
  "delete_user_permanent",
  "change_payment_info",
  "issue_refund",
  "change_bank_details",
  "sign_contract",
  "send_legal_agreement",
  "change_security_settings",
  "disable_2fa",
  "delete_audit_logs",
  "modify_admin_permissions",
  "export_sensitive_pii",
  "mass_email_unapproved",
  "irreversible_change",
] as const;

export const AEF_ALLOWED_PLANS = ["business", "enterprise"] as const;
