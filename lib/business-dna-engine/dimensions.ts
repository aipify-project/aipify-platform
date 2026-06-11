export const SUPPORT_CATEGORIES = [
  "delivery",
  "refund",
  "account",
  "payment",
  "subscription",
  "booking",
  "verification",
  "complaint",
  "technical",
  "general",
  "order",
  "product",
  "login",
  "cancellation",
  "marketplace",
] as const;

export const TONE_OF_VOICE = [
  "formal",
  "friendly_professional",
  "short_direct",
  "warm_personal",
  "premium",
  "technical",
  "casual",
  "supportive",
] as const;

export const PROFILE_STATUSES = [
  "draft",
  "pending_review",
  "approved",
  "active",
] as const;

export const RISK_LEVELS = ["conservative", "balanced", "progressive"] as const;

export const CONFIDENCE_LEVELS = ["low", "medium", "high"] as const;

export const EMAIL_CHANNEL_PROVIDERS = [
  "gmail",
  "outlook",
  "imap_smtp",
  "helpdesk",
  "not_connected",
] as const;

export const TEMPLATE_VARIABLES = [
  "{{customer_name}}",
  "{{order_number}}",
  "{{tracking_link}}",
  "{{product_name}}",
  "{{appointment_time}}",
  "{{support_agent_name}}",
  "{{company_name}}",
  "{{refund_status}}",
  "{{membership_level}}",
] as const;
