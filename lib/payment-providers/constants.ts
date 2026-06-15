export const PAYMENT_PROVIDER_KEYS = ["klarna", "vipps", "stripe", "dnb"] as const;

export type PaymentProviderKey = (typeof PAYMENT_PROVIDER_KEYS)[number];

/** Self-service checkout providers — not enterprise billing. */
export const SELF_SERVICE_PAYMENT_PROVIDERS = ["klarna", "vipps", "stripe"] as const;

export type SelfServicePaymentProviderKey = (typeof SELF_SERVICE_PAYMENT_PROVIDERS)[number];

export const ENTERPRISE_BILLING_PROVIDER = "dnb" as const;

export const PROVIDER_STATUSES = [
  "operational",
  "pending_setup",
  "requires_attention",
  "disabled",
] as const;

export type ProviderStatus = (typeof PROVIDER_STATUSES)[number];

export const PROVIDER_MODES = ["test", "live"] as const;

export type ProviderMode = (typeof PROVIDER_MODES)[number];

export const WEBHOOK_STATUSES = [
  "receiving_events",
  "not_configured",
  "failed_verification",
] as const;

export type WebhookStatus = (typeof WEBHOOK_STATUSES)[number];

export const PROVIDER_SCOPES = ["platform", "tenant"] as const;

export type ProviderScope = (typeof PROVIDER_SCOPES)[number];

export type ProviderFieldDefinition = {
  key: string;
  category: "public_key" | "secret_key" | "webhook_secret" | "url" | "metadata";
};

export const PROVIDER_FIELD_DEFINITIONS: Record<PaymentProviderKey, ProviderFieldDefinition[]> = {
  klarna: [
    { key: "KLARNA_API_USERNAME", category: "secret_key" },
    { key: "KLARNA_API_PASSWORD", category: "secret_key" },
    { key: "KLARNA_API_KEY", category: "secret_key" },
    { key: "KLARNA_CLIENT_ID", category: "public_key" },
    { key: "KLARNA_ENVIRONMENT", category: "metadata" },
    { key: "KLARNA_REGION", category: "metadata" },
    { key: "KLARNA_MERCHANT_ID", category: "metadata" },
    { key: "KLARNA_WEBHOOK_SIGNING_KEY", category: "webhook_secret" },
    { key: "KLARNA_RETURN_URL", category: "url" },
    { key: "KLARNA_CANCEL_URL", category: "url" },
    { key: "KLARNA_CONFIRMATION_URL", category: "url" },
    { key: "KLARNA_PUSH_URL", category: "url" },
  ],
  stripe: [
    { key: "STRIPE_PUBLISHABLE_KEY", category: "public_key" },
    { key: "STRIPE_SECRET_KEY", category: "secret_key" },
    { key: "STRIPE_RESTRICTED_KEY", category: "secret_key" },
    { key: "STRIPE_WEBHOOK_SECRET", category: "webhook_secret" },
    { key: "STRIPE_ACCOUNT_ID", category: "metadata" },
    { key: "STRIPE_ENVIRONMENT", category: "metadata" },
    { key: "STRIPE_SUCCESS_URL", category: "url" },
    { key: "STRIPE_CANCEL_URL", category: "url" },
    { key: "STRIPE_CUSTOMER_PORTAL_RETURN_URL", category: "url" },
  ],
  vipps: [
    { key: "VIPPS_CLIENT_ID", category: "public_key" },
    { key: "VIPPS_CLIENT_SECRET", category: "secret_key" },
    { key: "VIPPS_SUBSCRIPTION_KEY", category: "secret_key" },
    { key: "VIPPS_MERCHANT_SERIAL_NUMBER", category: "metadata" },
    { key: "VIPPS_ENVIRONMENT", category: "metadata" },
    { key: "VIPPS_SYSTEM_NAME", category: "metadata" },
    { key: "VIPPS_SYSTEM_VERSION", category: "metadata" },
    { key: "VIPPS_PLUGIN_NAME", category: "metadata" },
    { key: "VIPPS_PLUGIN_VERSION", category: "metadata" },
    { key: "VIPPS_CALLBACK_URL", category: "url" },
    { key: "VIPPS_RETURN_URL", category: "url" },
    { key: "VIPPS_WEBHOOK_SECRET", category: "webhook_secret" },
  ],
  dnb: [
    { key: "DNB_MERCHANT_ID", category: "metadata" },
    { key: "DNB_ACCOUNT_NUMBER", category: "metadata" },
    { key: "DNB_KID_PREFIX", category: "metadata" },
    { key: "DNB_API_KEY", category: "secret_key" },
    { key: "DNB_API_SECRET", category: "secret_key" },
    { key: "DNB_ENVIRONMENT", category: "metadata" },
    { key: "DNB_CALLBACK_URL", category: "url" },
    { key: "DNB_WEBHOOK_SECRET", category: "webhook_secret" },
  ],
};
