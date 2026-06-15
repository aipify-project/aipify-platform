import type {
  PaymentProviderKey,
  ProviderMode,
  ProviderScope,
  ProviderStatus,
  WebhookStatus,
} from "./constants";

export type ProviderCredentialField = {
  key: string;
  category: string;
  masked_value: string;
  configured: boolean;
};

export type PaymentProviderCard = {
  provider_key: PaymentProviderKey;
  name: string;
  status: ProviderStatus;
  mode: ProviderMode;
  enabled: boolean;
  regions: string[];
  capabilities: string[];
  last_health_check_at: string | null;
  setup_completed: boolean;
  setup_progress: {
    required_fields: number;
    configured_fields: number;
  };
  webhook_url: string;
  webhook_status: WebhookStatus;
  last_webhook_at: string | null;
  public_config: Record<string, unknown>;
  credentials: ProviderCredentialField[];
};

export type PaymentProviderAuditEntry = {
  id: string;
  provider_key: string;
  event_type: string;
  summary: string;
  created_at: string;
};

export type PaymentProvidersCenter = {
  scope: ProviderScope;
  tenant_id: string | null;
  can_edit: boolean;
  principle: string;
  paid_access_now: boolean;
  providers: PaymentProviderCard[];
  recent_audit: PaymentProviderAuditEntry[];
  regional_strategy: Record<string, string[]>;
};

export type PackageUpgradeCheckout = {
  current_plan: string;
  new_plan: string;
  current_price_monthly: number;
  new_price_monthly: number;
  price_difference_monthly: number;
  currency: string;
  payment_provider: PaymentProviderKey;
  provider_name: string;
  provider_operational: boolean;
  instant_access: boolean;
  instant_access_message: string;
  available_providers: PaymentProviderCard[];
};

export type PaymentProviderLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  paidAccessNow: string;
  configure: string;
  testConnection: string;
  testing: string;
  save: string;
  saving: string;
  copyUrl: string;
  copied: string;
  back: string;
  auditTitle: string;
  noAudit: string;
  regionalStrategy: string;
  fields: {
    status: string;
    mode: string;
    regions: string;
    capabilities: string;
    lastHealthCheck: string;
    setupStatus: string;
    webhookUrl: string;
    webhookStatus: string;
    lastWebhook: string;
    enabled: string;
  };
  statuses: Record<string, string>;
  modes: Record<string, string>;
  webhookStatuses: Record<string, string>;
  capabilities: Record<string, string>;
  setupStatus: {
    complete: string;
    inProgress: string;
  };
  testResult: {
    success: string;
    failure: string;
  };
  upgrade: {
    title: string;
    currentPlan: string;
    newPlan: string;
    currentPrice: string;
    newPrice: string;
    difference: string;
    paymentProvider: string;
    access: string;
    confirm: string;
    confirming: string;
    perMonth: string;
  };
  providers: Record<string, string>;
  viewLogs: string;
  documentation: string;
  visualStandards: string;
  clearLogFilter: string;
  providerProfiles: Record<
    string,
    {
      tagline: string;
      positioning: string;
      logoAlt: string;
    }
  >;
  enterpriseBilling: {
    title: string;
    description: string;
    methods: string;
    manageLink: string;
  };
};
