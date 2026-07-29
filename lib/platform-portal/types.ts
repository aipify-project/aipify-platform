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
  createCustomer: string;
  customerStatuses: Record<string, string>;
  subscriptionStatuses: Record<string, string>;
};

export type PlatformPortalCustomerDetailCustomer = {
  id: string;
  companyId: string;
  name: string;
  legalName: string | null;
  slug: string | null;
  organizationNumber: string | null;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  requiresAttention: boolean;
};

export type PlatformPortalCustomerDetailCommercial = {
  lifetime: boolean;
  subscriptionStatus: string | null;
  planName: string | null;
  trialStartsAt: string | null;
  trialEndsAt: string | null;
  currentPeriodStartsAt: string | null;
  currentPeriodEndsAt: string | null;
  partnerAttributed: boolean;
  partnerName: string | null;
};

export type PlatformPortalCustomerDetailUsage = {
  memberCount: number;
  activeLicenseCount: number;
  totalLicenseCount: number;
  domainCount: number;
  installationCount: number;
  openSupportCount: number;
};

export type PlatformPortalCustomerDetailLicense = {
  id: string;
  status: string;
  productCode: string | null;
  productName: string | null;
  domain: string | null;
  installId: string | null;
  createdAt: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
};

export type PlatformPortalCustomerDetailDomain = {
  id: string;
  hostname: string;
  status: string;
  installId: string | null;
  createdAt: string | null;
  verifiedAt: string | null;
};

export type PlatformPortalCustomerDetailEntitlement = {
  id: string;
  code: string;
  name: string | null;
  status: string;
  grantedAt: string | null;
  expiresAt: string | null;
};

export type PlatformPortalCustomerDetail = {
  customer: PlatformPortalCustomerDetailCustomer;
  commercial: PlatformPortalCustomerDetailCommercial;
  usage: PlatformPortalCustomerDetailUsage;
  licenses: PlatformPortalCustomerDetailLicense[];
  domains: PlatformPortalCustomerDetailDomain[];
  entitlements: PlatformPortalCustomerDetailEntitlement[];
  metadata: {
    generatedAt: string;
  };
};

export type PlatformPortalCustomerDetailLabels = {
  title: string;
  backToCustomers: string;
  loading: string;
  error: string;
  retry: string;
  notFound: string;
  forbidden: string;
  unauthorized: string;
  sectionBusiness: string;
  sectionCommercial: string;
  sectionLicenses: string;
  sectionDomains: string;
  sectionEntitlements: string;
  sectionStatus: string;
  organizationNumber: string;
  legalName: string;
  customerName: string;
  customerId: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
  subscription: string;
  lifetime: string;
  plan: string;
  trialPeriod: string;
  activePeriod: string;
  directCustomer: string;
  partnerCustomer: string;
  members: string;
  activeLicenses: string;
  domains: string;
  installations: string;
  openSupport: string;
  notAvailable: string;
  requiresAttention: string;
  healthy: string;
  emptyLicenses: string;
  emptyDomains: string;
  emptyEntitlements: string;
  copy: string;
  copied: string;
  generatedAt: string;
  slug: string;
  product: string;
  status: string;
  domain: string;
  installId: string;
  activatedAt: string;
  expiresAt: string;
  hostname: string;
  verifiedAt: string;
  code: string;
  name: string;
  grantedAt: string;
  customerStatuses: Record<string, string>;
  subscriptionStatuses: Record<string, string>;
  licenseStatuses: Record<string, string>;
  domainStatuses: Record<string, string>;
  entitlementStatuses: Record<string, string>;
  managePlan: string;
};

export type PlatformPortalCommercialPlan = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  planType: string;
  billingCycle: string | null;
  amountMinor: number | null;
  currency: string | null;
  trialDays: number | null;
  active: boolean;
  supportsLifetime: boolean;
  supportsRecurring: boolean;
  supportsTrial: boolean;
};

export type PlatformPortalCommercialPlansPayload = {
  plans: PlatformPortalCommercialPlan[];
  generatedAt: string | null;
};

export type SetPlatformPortalCustomerCommercialPlanInput = {
  customerId: string;
  planId: string;
  mode: "lifetime" | "recurring";
  startMode: "now" | "trial";
  trialDays: number | null;
  internalReason: string;
  idempotencyKey: string;
};

export type PlatformPortalCustomerCommercialPlanResult = {
  customerId: string;
  subscription: {
    id: string;
    planId: string | null;
    planKey: string | null;
    planName: string | null;
    mode: "lifetime" | "recurring";
    status: string;
    trialStartsAt: string | null;
    trialEndsAt: string | null;
    currentPeriodStartsAt: string | null;
    currentPeriodEndsAt: string | null;
    createdAt: string | null;
    updatedAt: string | null;
  };
  created: boolean;
  replacedSubscriptionId: string | null;
  idempotentReplay: boolean;
};

export type PlatformPortalCommercialPlanLabels = {
  managePlan: string;
  title: string;
  currentPlan: string;
  availablePlans: string;
  lifetime: string;
  recurring: string;
  monthly: string;
  yearly: string;
  trialPeriod: string;
  noTrial: string;
  active: string;
  trialing: string;
  pending: string;
  cancelled: string;
  paused: string;
  pastDue: string;
  unknownStatus: string;
  planDescription: string;
  price: string;
  billingCycle: string;
  startNow: string;
  startTrial: string;
  trialDays: string;
  internalReason: string;
  reasonRequired: string;
  summary: string;
  summaryCreates: string;
  summaryNoPayment: string;
  summaryNoLicense: string;
  activate: string;
  activating: string;
  success: string;
  activePlanConflict: string;
  planLifetimeUnsupported: string;
  planRecurringUnsupported: string;
  planTrialUnsupported: string;
  loadPlansError: string;
  activateError: string;
  emptyPlans: string;
  forbidden: string;
  unauthorized: string;
  cancel: string;
  retry: string;
  confirmRequired: string;
  selectPlan: string;
  noPrice: string;
  loadingPlans: string;
  subscriptionStatuses: Record<string, string>;
};

export type PlatformPortalCustomerCreationInput = {
  organizationNumber: string;
  legalName: string;
  displayName: string;
  slug: string;
  country: string;
};

export type PlatformPortalCustomerCreationResult = {
  customer: {
    id: string;
    companyId: string;
    name: string;
    legalName: string | null;
    slug: string | null;
    organizationNumber: string | null;
    status: string;
    createdAt: string | null;
  };
  created: {
    company: boolean;
    organization: boolean;
    customer: boolean;
    registrationProfile: boolean;
    paymentProfile: boolean;
  };
};

export type PlatformPortalCustomerCreationLabels = {
  title: string;
  description: string;
  backToCustomers: string;
  sectionIdentity: string;
  sectionPlatform: string;
  sectionSummary: string;
  organizationNumber: string;
  legalName: string;
  customerName: string;
  slug: string;
  country: string;
  lookupAction: string;
  lookupLoading: string;
  lookupSuccess: string;
  lookupNotFound: string;
  lookupUnavailable: string;
  invalidOrganizationNumber: string;
  duplicateOrganizationNumber: string;
  invalidSlug: string;
  duplicateSlug: string;
  reservedSlug: string;
  summaryTitle: string;
  createsTitle: string;
  createsNotTitle: string;
  createsItems: string[];
  createsNotItems: string[];
  submit: string;
  cancel: string;
  submitting: string;
  success: string;
  error: string;
  unauthorized: string;
  forbidden: string;
  retry: string;
  slugPreview: string;
  addressUnavailableNote: string;
};

export type PlatformPortalCompanyLookupResult = {
  status: "valid" | "invalid" | "service_unavailable";
  organizationNumber: string | null;
  legalName: string | null;
};
