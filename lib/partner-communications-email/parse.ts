import type {
  PartnerCommunicationEntry,
  PartnerCommunicationsBundle,
  PartnerEmailOutboxItem,
  SuperPartnerCommunicationsOverview,
  SuperPartnerEmailLog,
  SuperPartnerEmailTemplate,
} from "./types";

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function parsePartnerCommunications(data: unknown): PartnerCommunicationsBundle | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  if (!row.has_access) return null;

  const prefs = (row.preferences ?? {}) as Record<string, unknown>;
  const communications = Array.isArray(row.communications)
    ? (row.communications as Record<string, unknown>[]).map(
        (item): PartnerCommunicationEntry => ({
          id: str(item.id),
          subject: str(item.subject),
          template_key: str(item.template_key),
          trigger_event: str(item.trigger_event),
          language_code: str(item.language_code, "en"),
          delivery_status: str(item.delivery_status, "queued") as PartnerCommunicationEntry["delivery_status"],
          sent_at: str(item.sent_at),
          preview: str(item.preview),
        }),
      )
    : [];

  return {
    has_access: true,
    org_id: str(row.org_id),
    positioning: str(row.positioning),
    preferences: {
      sales_notifications: Boolean(prefs.sales_notifications ?? true),
      milestone_notifications: Boolean(prefs.milestone_notifications ?? true),
      settlement_notifications: Boolean(prefs.settlement_notifications ?? true),
      academy_notifications: Boolean(prefs.academy_notifications ?? true),
      compliance_notifications: Boolean(prefs.compliance_notifications ?? true),
      marketing_material_updates: Boolean(prefs.marketing_material_updates ?? true),
      general_announcements: Boolean(prefs.general_announcements ?? true),
      system_critical_note: str(prefs.system_critical_note),
    },
    communications,
  };
}

export function parseSuperPartnerCommunications(data: unknown): SuperPartnerCommunicationsOverview | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  const stats = (row.stats ?? {}) as Record<string, unknown>;

  return {
    positioning: str(row.positioning),
    sections: Array.isArray(row.sections) ? row.sections.map(String) : [],
    stats: {
      active_templates: Number(stats.active_templates ?? 0),
      queued_emails: Number(stats.queued_emails ?? 0),
      sent_emails: Number(stats.sent_emails ?? 0),
      failed_emails: Number(stats.failed_emails ?? 0),
    },
    senders: Array.isArray(row.senders)
      ? (row.senders as Record<string, unknown>[]).map((s) => ({
          sender_key: str(s.sender_key),
          sender_name: str(s.sender_name),
          sender_email: str(s.sender_email),
          enabled: Boolean(s.enabled),
        }))
      : [],
    trigger_rules: Array.isArray(row.trigger_rules)
      ? (row.trigger_rules as Record<string, unknown>[]).map((r) => ({
          trigger_event: str(r.trigger_event),
          template_key: str(r.template_key),
          enabled: Boolean(r.enabled),
        }))
      : [],
  };
}

export function parseSuperPartnerEmailTemplates(data: unknown): SuperPartnerEmailTemplate[] {
  if (!data || typeof data !== "object") return [];
  const row = data as Record<string, unknown>;
  if (!Array.isArray(row.templates)) return [];

  return (row.templates as Record<string, unknown>[]).map((t) => ({
    id: str(t.id),
    template_key: str(t.template_key),
    template_category: str(t.template_category),
    template_status: str(t.template_status, "active") as SuperPartnerEmailTemplate["template_status"],
    trigger_event: t.trigger_event ? str(t.trigger_event) : null,
    sender_key: str(t.sender_key),
    preference_key: str(t.preference_key),
    is_system_critical: Boolean(t.is_system_critical),
    default_language: str(t.default_language, "en"),
    translations: Array.isArray(t.translations)
      ? (t.translations as Record<string, unknown>[]).map((tr) => ({
          language_code: str(tr.language_code),
          subject_template: str(tr.subject_template),
          title_template: str(tr.title_template),
          body_template: str(tr.body_template),
          cta_label_template: str(tr.cta_label_template),
          cta_url_template: str(tr.cta_url_template),
        }))
      : [],
  }));
}

export function parseSuperPartnerEmailLogs(data: unknown): SuperPartnerEmailLog[] {
  if (!data || typeof data !== "object") return [];
  const row = data as Record<string, unknown>;
  if (!Array.isArray(row.logs)) return [];

  return (row.logs as Record<string, unknown>[]).map((l) => ({
    id: str(l.id),
    partner_org_id: str(l.partner_org_id),
    template_key: str(l.template_key),
    recipient_email: str(l.recipient_email),
    language_code: str(l.language_code),
    trigger_event: str(l.trigger_event),
    subject: str(l.subject),
    delivery_status: str(l.delivery_status, "queued") as SuperPartnerEmailLog["delivery_status"],
    sent_at: str(l.sent_at),
    opened_at: str(l.opened_at),
    clicked_at: str(l.clicked_at),
    error_details: str(l.error_details),
    created_at: str(l.created_at),
  }));
}

export function parsePartnerEmailOutbox(data: unknown): PartnerEmailOutboxItem[] {
  if (!data || typeof data !== "object") return [];
  const row = data as Record<string, unknown>;
  if (!Array.isArray(row.emails)) return [];

  return (row.emails as Record<string, unknown>[]).map((e) => ({
    id: str(e.id),
    partner_org_id: str(e.partner_org_id),
    recipient_email: str(e.recipient_email),
    subject: str(e.subject),
    html_body: str(e.html_body),
    plain_text_body: str(e.plain_text_body),
    delivery_status: str(e.delivery_status, "queued") as PartnerEmailOutboxItem["delivery_status"],
    context: (e.context as Record<string, unknown>) ?? {},
  }));
}

export function deliveryStatusLabel(status: string): string {
  const map: Record<string, string> = {
    queued: "Queued",
    sent: "Sent",
    delivered: "Delivered",
    opened: "Opened",
    clicked: "Clicked",
    failed: "Failed",
    bounced: "Bounced",
  };
  return map[status] ?? status;
}

export function templateCategoryLabel(category: string): string {
  return category.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}
