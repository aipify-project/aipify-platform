export type PartnerEmailDeliveryStatus =
  | "queued"
  | "sent"
  | "delivered"
  | "opened"
  | "clicked"
  | "failed"
  | "bounced";

export type PartnerEmailTemplateStatus = "draft" | "active" | "paused" | "archived";

export type PartnerEmailCategory =
  | "partner_onboarding"
  | "partner_registration"
  | "partner_approval"
  | "partner_rejection"
  | "business_verification"
  | "academy_progress"
  | "certification_completed"
  | "first_sale_celebration"
  | "sale_confirmation"
  | "milestone_celebration"
  | "commission_update"
  | "settlement_ready"
  | "invoice_approved"
  | "payment_sent"
  | "compliance_reminder"
  | "agreement_update"
  | "sales_material_update"
  | "product_update"
  | "partner_advisor_message"
  | "general_partner_announcement";

export type PartnerEmailTriggerEvent =
  | "partner_registration_received"
  | "business_verification_approved"
  | "business_verification_rejected"
  | "partner_onboarding_completed"
  | "academy_course_completed"
  | "certification_completed"
  | "first_sale_approved"
  | "sale_approved"
  | "commission_tier_increased"
  | "milestone_reached"
  | "settlement_ready"
  | "settlement_approved"
  | "invoice_generated"
  | "payment_sent"
  | "compliance_action_required"
  | "sales_material_published"
  | "partner_announcement";

export type PartnerEmailPreferences = {
  sales_notifications: boolean;
  milestone_notifications: boolean;
  settlement_notifications: boolean;
  academy_notifications: boolean;
  compliance_notifications: boolean;
  marketing_material_updates: boolean;
  general_announcements: boolean;
  system_critical_note: string;
};

export type PartnerCommunicationEntry = {
  id: string;
  subject: string;
  template_key: string;
  trigger_event: string;
  language_code: string;
  delivery_status: PartnerEmailDeliveryStatus;
  sent_at: string;
  preview: string;
};

export type PartnerCommunicationsBundle = {
  has_access: boolean;
  org_id: string;
  positioning: string;
  preferences: PartnerEmailPreferences;
  communications: PartnerCommunicationEntry[];
};

export type SuperPartnerEmailTemplate = {
  id: string;
  template_key: string;
  template_category: string;
  template_status: PartnerEmailTemplateStatus;
  trigger_event: string | null;
  sender_key: string;
  preference_key: string;
  is_system_critical: boolean;
  default_language: string;
  translations: Array<{
    language_code: string;
    subject_template: string;
    title_template: string;
    body_template: string;
    cta_label_template: string;
    cta_url_template: string;
  }>;
};

export type SuperPartnerEmailLog = {
  id: string;
  partner_org_id: string;
  template_key: string;
  recipient_email: string;
  language_code: string;
  trigger_event: string;
  subject: string;
  delivery_status: PartnerEmailDeliveryStatus;
  sent_at: string;
  opened_at: string;
  clicked_at: string;
  error_details: string;
  created_at: string;
};

export type SuperPartnerCommunicationsOverview = {
  positioning: string;
  sections: string[];
  stats: {
    active_templates: number;
    queued_emails: number;
    sent_emails: number;
    failed_emails: number;
  };
  senders: Array<{
    sender_key: string;
    sender_name: string;
    sender_email: string;
    enabled: boolean;
  }>;
  trigger_rules: Array<{
    trigger_event: string;
    template_key: string;
    enabled: boolean;
  }>;
};

export type PartnerEmailOutboxItem = {
  id: string;
  partner_org_id: string;
  recipient_email: string;
  subject: string;
  html_body: string;
  plain_text_body: string;
  delivery_status: PartnerEmailDeliveryStatus;
  context: Record<string, unknown>;
};

export const PARTNER_EMAIL_LANGUAGES = [
  "en",
  "no",
  "sv",
  "da",
  "de",
  "fr",
  "es",
  "pl",
  "uk",
] as const;

export const PARTNER_EMAIL_VARIABLES = [
  "partner_name",
  "partner_company",
  "first_name",
  "sale_reference",
  "customer_name",
  "package_name",
  "commission_amount",
  "commission_rate",
  "current_tier",
  "next_tier",
  "sales_to_next_tier",
  "settlement_period",
  "invoice_number",
  "payment_date",
  "dashboard_url",
  "materials_url",
  "compliance_url",
  "advisor_name",
] as const;
