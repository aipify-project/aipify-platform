import type { AlertSeverity, PaymentOpsProviderKey, RegionalCoverageKey } from "./constants";

export type PaymentOperationsSummary = {
  active_payment_providers: number;
  countries_supported: number;
  pending_provider_setups: number;
  enterprise_invoice_customers: number;
  monthly_transaction_volume: number;
  monthly_transaction_currency: string;
  failed_payment_events: number;
};

export type PaymentOperationsProvider = {
  provider_key: PaymentOpsProviderKey;
  name: string;
  status: string;
  mode: string;
  enabled: boolean;
  regions: string[];
  capabilities: string[];
  webhook_status: string;
  environment: string;
  api_status: string;
  last_synchronization: string | null;
  api_key_status: string;
  settlement_status: string;
  operational_capabilities: string[];
  supported_currencies: string[];
  supported_countries: string[];
};

export type SettlementRecord = {
  id: string;
  provider_key: string;
  amount: number;
  currency: string;
  status: string;
  estimated_payout_date: string | null;
  reference?: string;
  settlement_date?: string;
};

export type PaymentOperationsSettlements = {
  today: SettlementRecord[];
  pending: SettlementRecord[];
  failed: SettlementRecord[];
};

export type RegionalCoverageRegion = {
  providers: string[];
  ready: boolean;
};

export type PaymentOperationsAlert = {
  id: string;
  provider_key: string | null;
  severity: AlertSeverity;
  alert_type: string;
  title: string;
  summary: string;
  created_at: string;
};

export type PaymentOperationsAuditEntry = {
  id: string;
  provider_key: string | null;
  action: string;
  summary: string;
  before_value: Record<string, unknown>;
  after_value: Record<string, unknown>;
  created_at: string;
};

export type PaymentOperationsCenter = {
  principle: string;
  founding_principle: string;
  summary: PaymentOperationsSummary;
  providers: PaymentOperationsProvider[];
  settlements: PaymentOperationsSettlements;
  regional_coverage: Record<RegionalCoverageKey, RegionalCoverageRegion>;
  alerts: PaymentOperationsAlert[];
  audit: PaymentOperationsAuditEntry[];
};

export type PaymentOperationsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  foundingPrinciple: string;
  sections: {
    summary: string;
    providers: string;
    configuration: string;
    settlements: string;
    regionalCoverage: string;
    alerts: string;
    audit: string;
  };
  summary: {
    activeProviders: string;
    countriesSupported: string;
    pendingSetups: string;
    enterpriseCustomers: string;
    monthlyVolume: string;
    failedEvents: string;
  };
  provider: {
    status: string;
    capabilities: string;
    regions: string;
    environment: string;
    apiStatus: string;
    lastSync: string;
    apiKeyStatus: string;
    webhookStatus: string;
    settlementStatus: string;
    currencies: string;
    countries: string;
    configure: string;
  };
  settlements: {
    today: string;
    pending: string;
    failed: string;
    estimatedPayout: string;
    empty: string;
  };
  regional: Record<RegionalCoverageKey, string>;
  severities: Record<AlertSeverity, string>;
  statuses: Record<string, string>;
  apiStatuses: Record<string, string>;
  environments: Record<string, string>;
  capabilities: Record<string, string>;
  providers: Record<PaymentOpsProviderKey, string>;
  audit: {
    action: string;
    before: string;
    after: string;
    empty: string;
  };
};
