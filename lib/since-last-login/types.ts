export type SinceLastLoginScope =
  | "platform_executive"
  | "platform_admin"
  | "customer"
  | "support";

export type SinceLastLoginSeverity =
  | "critical"
  | "attention"
  | "success"
  | "neutral"
  | "recommendation";

export type SinceLastLoginEventType =
  | "support"
  | "automation"
  | "customer"
  | "billing"
  | "installation"
  | "action"
  | "recommendation"
  | "critical";

export type SinceLastLoginEvent = {
  id: string;
  event_type: SinceLastLoginEventType;
  severity: SinceLastLoginSeverity;
  timestamp: string;
  tenant_scope: string;
  summary_text: string;
  deep_link: string;
  action_required: boolean;
  priority?: number;
};

export type SinceLastLoginEngineBundle = {
  scope: SinceLastLoginScope;
  since: string;
  previous_login_at?: string | null;
  generated_at: string;
  critical_header?: string | null;
  items: SinceLastLoginEvent[];
  is_empty: boolean;
  privacy_note?: string;
};
