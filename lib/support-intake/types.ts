/**
 * Unified Support ticket intake — one motor, multiple source channels.
 * Never trusts client-supplied tenant/partner IDs.
 */

export const SUPPORT_INTAKE_SOURCES = [
  "web",
  "app",
  "partner",
  "kompis",
  "manual",
] as const;

export type SupportIntakeSource = (typeof SUPPORT_INTAKE_SOURCES)[number];

export const SUPPORT_INTAKE_SOURCE_LABELS_NO: Record<SupportIntakeSource, string> = {
  web: "Nettside",
  app: "APP",
  partner: "Sales Partner",
  kompis: "Kompis",
  manual: "Manuell",
};

export type SupportIntakePayload = {
  source: SupportIntakeSource;
  subject: string;
  message: string;
  category?: string | null;
  priority?: string | null;
  productName?: string | null;
  /** Guest only — never used as tenant id. */
  contactName?: string | null;
  contactEmail?: string | null;
};

export type SupportIntakeDenialCode =
  | "core_not_applied"
  | "feature_gate_off"
  | "unauthorized"
  | "forbidden"
  | "rate_limited"
  | "validation"
  | "spam_rejected"
  | "channel_not_activated"
  | "unknown";

export type SupportIntakeResult =
  | {
      ok: true;
      live: true;
      ticketId: string;
      ticketNumber: string;
      source: SupportIntakeSource;
    }
  | {
      ok: false;
      live: false;
      code: SupportIntakeDenialCode;
      message: string;
    };

/** Outbound/inbound email transport — separate owner gate. */
export const SUPPORT_EMAIL_TRANSPORT_ENABLED = false as const;

/**
 * Unified Platform intake write RPCs (web / partner / guest).
 * Activated after Production V3 apply + owner activation YES
 * (AIPIFY_PUBLIC_SUPPORT_PRODUCTION_ACTIVATION_V1).
 * APP tenant create already uses `create_app_portal_support_request` (LIVE).
 * Email transport remains a separate owner gate.
 */
export const SUPPORT_INTAKE_RPC_CONNECTED = true as const;
export const SUPPORT_INTAKE_FEATURE_GATE = true as const;

/** Honesty: APP customer create path is already live via app portal RPC. */
export const APP_PORTAL_SUPPORT_CREATE_LIVE = true as const;
