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

export type PlatformPortalCustomerSummary = {
  total: number;
  active: number;
  new30d: number;
  requiresAttention: number;
};

export type PlatformPortalCustomerRecord = {
  organizationId: string;
  customerId: string;
  companyId: string;
  legalName: string;
  organizationNumber: string | null;
  organizationSlug: string | null;
  customerStatus: string | null;
  createdAt: string | null;
  subscriptionStatus: string | null;
  subscriptionPlanKey: string | null;
  subscriptionPlanType: string | null;
  subscriptionPlanName: string | null;
  subscriptionBillingCycle: string | null;
  subscriptionCreatedAt: string | null;
  subscriptionUpdatedAt: string | null;
  isLifetime: boolean;
  primaryContactName: string | null;
  memberCount: number;
  licenseServiceStatus: string | null;
  paymentOverdueSince: string | null;
  isPartnerAttributed: boolean;
  growthPartnerProfileId: string | null;
  growthPartnerPublicId: string | null;
  openSupportCount: number;
  lastActivityAt: string | null;
  requiresAttention: boolean;
};

export type PlatformPortalCustomersPayload = {
  summary: PlatformPortalCustomerSummary;
  customers: PlatformPortalCustomerRecord[];
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
    invoices: string;
    paymentProviders: string;
    accountingIntegration: string;
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

export type PlatformPortalCustomersLabels = {
  title: string;
  description: string;
  summaryTotal: string;
  summaryActive: string;
  summaryNew: string;
  summaryAttention: string;
  loading: string;
  error: string;
  retry: string;
  emptyTitle: string;
  emptyDescription: string;
  searchPlaceholder: string;
  filterAll: string;
  filterStatus: string;
  filterSubscription: string;
  filterAttribution: string;
  filterPartner: string;
  filterDirect: string;
  clearFilters: string;
  columnCustomer: string;
  columnOrganizationNumber: string;
  columnStatus: string;
  columnSubscription: string;
  columnMembers: string;
  columnAttribution: string;
  columnSupport: string;
  columnLastActivity: string;
  columnActions: string;
  requiresAttention: string;
  lifetime: string;
  partnerCustomer: string;
  directCustomer: string;
  noSubscription: string;
  notAvailable: string;
  openCustomer: string;
  noOpenSupport: string;
  customerStatuses: Record<string, string>;
  subscriptionStatuses: Record<string, string>;
};
