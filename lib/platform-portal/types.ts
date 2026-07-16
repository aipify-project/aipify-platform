export type PlatformPortalPaymentSummary = {
  active: number;
  past_due: number;
  trialing: number;
};

export type PlatformPortalCustomerSuccess = {
  organizations_total: number;
  organizations_requiring_attention: number;
  healthy_ratio_pct: number;
};

export type PlatformPortalMarketplaceModeration = {
  pending_review: number;
  published: number;
};

export type PlatformPortalProductUpdate = {
  id: string;
  title: string;
  version: string;
  classification: string;
  scheduled_at: string | null;
};

export type PlatformPortalDashboard = {
  organizations_requiring_attention: number;
  active_subscriptions: number;
  open_support_workload: number;
  payment_status_summary: PlatformPortalPaymentSummary;
  customer_success_indicators: PlatformPortalCustomerSuccess;
  marketplace_moderation: PlatformPortalMarketplaceModeration;
  product_deployment_updates: PlatformPortalProductUpdate[];
};

export type PlatformPortalLabels = {
  dashboard: {
    title: string;
    subtitle: string;
    loading: string;
    principle: string;
    privacyNote: string;
    organizationsRequiringAttention: string;
    activeSubscriptions: string;
    openSupportWorkload: string;
    paymentStatusSummary: string;
    paymentActive: string;
    paymentPastDue: string;
    paymentTrialing: string;
    customerSuccessIndicators: string;
    healthyRatio: string;
    marketplaceModeration: string;
    pendingReview: string;
    published: string;
    partnerProgramSummary: string;
    activePrograms: string;
    pendingApplications: string;
    productDeploymentUpdates: string;
    noUpdates: string;
    portalModules: string;
    openModule: string;
    loadErrorTitle: string;
    loadErrorMessage: string;
    retry: string;
  };
  foundation: {
    loading: string;
    back: string;
    structureNote: string;
  };
};
