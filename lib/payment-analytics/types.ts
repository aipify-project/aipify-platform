import type { AnalyticsProviderKey, ChartRange, CustomerType, ExportFormat } from "./constants";

export type PaymentAnalyticsFilters = {
  date_from?: string;
  date_to?: string;
  provider?: AnalyticsProviderKey | "";
  customer_type?: CustomerType | "";
  country?: string;
};

export type PaymentAnalyticsOverview = {
  revenue_today: number;
  revenue_this_month: number;
  active_subscriptions: number;
  failed_payments: number;
  average_revenue_per_customer: number;
  churned_subscriptions: number;
  currency: string;
};

export type ProviderBreakdown = {
  provider_key: AnalyticsProviderKey;
  revenue_30d: number;
  transactions: number;
  success_rate: number;
  refunds: number;
  failed_payments: number;
};

export type RevenuePoint = {
  date: string;
  revenue: number;
};

export type ProviderDistribution = {
  provider_key: AnalyticsProviderKey;
  revenue: number;
  percentage: number;
};

export type TopEnterpriseCustomer = {
  customer: string;
  revenue: number;
  open_invoices: number;
  last_payment: string | null;
  status: string;
};

export type FailedPaymentInsight = {
  customer: string;
  provider: string;
  failure_reason: string;
  retry_count: number;
  recommended_action: string;
  transaction_at: string;
};

export type PaymentAnalyticsCenter = {
  principle: string;
  has_activity: boolean;
  filters: PaymentAnalyticsFilters;
  available_countries: string[];
  overview: PaymentAnalyticsOverview;
  provider_breakdown: ProviderBreakdown[];
  revenue_over_time: {
    last_7_days: RevenuePoint[];
    last_30_days: RevenuePoint[];
    last_12_months: RevenuePoint[];
  };
  provider_distribution: ProviderDistribution[];
  segments: {
    self_service: number;
    enterprise: number;
    currency: string;
  };
  top_enterprise_customers: TopEnterpriseCustomer[];
  failed_payment_insights: FailedPaymentInsight[];
};

export type PaymentAnalyticsLabels = {
  title: string;
  subtitle: string;
  loading: string;
  back: string;
  principle: string;
  emptyState: string;
  sections: {
    overview: string;
    providerBreakdown: string;
    revenueOverTime: string;
    providerDistribution: string;
    segments: string;
    topEnterprise: string;
    failedInsights: string;
    filters: string;
    exports: string;
  };
  overview: {
    revenueToday: string;
    revenueMonth: string;
    activeSubscriptions: string;
    failedPayments: string;
    arpc: string;
    churnedSubscriptions: string;
  };
  provider: {
    revenue30d: string;
    transactions: string;
    successRate: string;
    refunds: string;
    failedPayments: string;
  };
  charts: {
    range7d: string;
    range30d: string;
    range12m: string;
  };
  segments: {
    selfService: string;
    enterprise: string;
  };
  table: {
    customer: string;
    revenue: string;
    openInvoices: string;
    lastPayment: string;
    status: string;
    provider: string;
    failureReason: string;
    retryCount: string;
    recommendedAction: string;
  };
  filters: {
    dateFrom: string;
    dateTo: string;
    provider: string;
    customerType: string;
    country: string;
    allProviders: string;
    allTypes: string;
    allCountries: string;
    apply: string;
  };
  exports: {
    csv: string;
    excel: string;
    pdf: string;
    exporting: string;
  };
  providers: Record<AnalyticsProviderKey, string>;
  customerTypes: Record<CustomerType, string>;
  enterpriseStatuses: Record<string, string>;
  chartRanges: Record<ChartRange, string>;
  exportFormats: Record<ExportFormat, string>;
};
