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
    lastChecked: string;
    unknownStatus: string;
    updateClassifications: Record<string, string>;
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
  agreementDisplayNames: {
    unonightPilotAgreement: string;
    unonightUnlimitedAgreement: string;
  };
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
  maskedLicenseCode: string | null;
  provisioningStatus: string | null;
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
  isPrimary?: boolean | null;
  role?: string | null;
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
  duration: string;
  plan: string;
  trialPeriod: string;
  noTrial: string;
  activePeriod: string;
  directCustomer: string;
  partnerCustomer: string;
  members: string;
  activeLicenses: string;
  domains: string;
  installations: string;
  domainsAndInstallations: string;
  domainCountLabel: string;
  installationCountLabel: string;
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
  lastChecked: string;
  slug: string;
  slugHelp: string;
  product: string;
  status: string;
  domain: string;
  domainRole: string;
  installId: string;
  activatedAt: string;
  expiresAt: string;
  hostname: string;
  verifiedAt: string;
  code: string;
  name: string;
  grantedAt: string;
  unknownStatus: string;
  customerStatuses: Record<string, string>;
  subscriptionStatuses: Record<string, string>;
  licenseStatuses: Record<string, string>;
  domainStatuses: Record<string, string>;
  domainRoles: Record<string, string>;
  entitlementStatuses: Record<string, string>;
  provisioningStatuses: Record<string, string>;
  licenseProductNames: Record<string, string>;
  licenseProductDescriptions: Record<string, string>;
  agreementDisplayNames: {
    unonightPilotAgreement: string;
    unonightUnlimitedAgreement: string;
  };
  managePlan: string;
  createLicense: string;
  viewLicense: string;
  addDomainInstallation: string;
  viewSetup: string;
  licenseAlreadyCreated: string;
  licenseAlreadyConfigured: string;
  licenseMissingLink: string;
  noNewLicenseNeeded: string;
  noNewDomainInstallationNeeded: string;
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
  duration: string;
  agreement: string;
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
  activeAgreementChangeUnsupported: string;
  planLifetimeUnsupported: string;
  planRecurringUnsupported: string;
  planTrialUnsupported: string;
  loadPlansError: string;
  activateError: string;
  emptyPlans: string;
  forbidden: string;
  unauthorized: string;
  cancel: string;
  close: string;
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
  verificationSource: "brreg" | "operator";
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
  registrationNumber: string;
  registrationNumberHelp: string;
  legalName: string;
  customerName: string;
  slug: string;
  country: string;
  selectCountry: string;
  searchNorwegianCompany: string;
  searchNameOrNumber: string;
  companyNameOrNumber: string;
  lookupAction: string;
  lookupLoading: string;
  lookupSuccess: string;
  lookupNotFound: string;
  lookupUnavailable: string;
  lookupMultiple: string;
  selectCompany: string;
  selectedCompany: string;
  lookupAvailableNorway: string;
  lookupUnavailableCountry: string;
  enterManually: string;
  queryTooShort: string;
  registryNoResponse: string;
  invalidOrganizationNumber: string;
  registrationNumberRequired: string;
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

export type PlatformPortalCompanyLookupMatch = {
  registrationNumber: string;
  legalName: string;
  organizationType: string | null;
  addressLine: string | null;
  postalCode: string | null;
  city: string | null;
  status: string | null;
};

export type PlatformPortalCompanyLookupResult = {
  status:
    | "valid"
    | "multiple"
    | "invalid"
    | "invalid_query"
    | "no_results"
    | "lookup_unavailable"
    | "timeout"
    | "service_unavailable";
  provider?: "brreg" | null;
  countryCode?: string;
  results?: PlatformPortalCompanyLookupMatch[];
  organizationNumber?: string | null;
  legalName?: string | null;
  minQueryLength?: number;
};

export type PlatformPortalLicenseProduct = {
  id: string;
  code: string;
  name: string;
  description: string | null;
  active: boolean;
  assignableByPlatform: boolean;
  requiresCommercialPlan: boolean;
  requiresEntitlement: boolean;
  requiresDomain: boolean;
  requiresInstallation: boolean;
  licenseMode: string | null;
  defaultStatus: string | null;
};

export type PlatformPortalLicenseProductsPayload = {
  products: PlatformPortalLicenseProduct[];
  generatedAt: string | null;
};

export type PlatformPortalCustomerLicense = {
  id: string;
  productId: string | null;
  productCode: string | null;
  productName: string | null;
  status: string;
  maskedLicenseCode: string | null;
  entitlementId: string | null;
  domainId: string | null;
  domain: string | null;
  installationId: string | null;
  installId: string | null;
  provisioningStatus: string | null;
  provisioningRequired: boolean;
  createdAt: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
};

export type PlatformPortalCustomerLicenseResult = {
  customerId: string;
  license: PlatformPortalCustomerLicense;
  created: boolean;
  entitlementCreated: boolean;
  provisioningRequired: boolean;
  idempotentReplay: boolean;
};

export type PlatformPortalLicenseProvisioningLabels = {
  createLicense: string;
  title: string;
  currentLicenses: string;
  availableProducts: string;
  licenseProduct: string;
  productCode: string;
  productName: string;
  licenseStatus: string;
  provisioningStatus: string;
  licenseCode: string;
  maskedLicenseCode: string;
  requiresCommercialPlan: string;
  commercialPlanActive: string;
  commercialPlanMissing: string;
  requiresEntitlement: string;
  domainLater: string;
  installationLater: string;
  internalReason: string;
  reasonRequired: string;
  summary: string;
  summaryCreates: string;
  summaryNoDomain: string;
  summaryNoWebsiteKompis: string;
  create: string;
  creating: string;
  success: string;
  alreadyExists: string;
  productUnavailable: string;
  productNotAssignable: string;
  emptyProducts: string;
  emptyLicenses: string;
  waitingProvisioning: string;
  requiresDomain: string;
  requiresInstallation: string;
  active: string;
  pending: string;
  suspended: string;
  expired: string;
  revoked: string;
  failed: string;
  forbidden: string;
  unauthorized: string;
  loadProductsError: string;
  createError: string;
  cancel: string;
  retry: string;
  confirmRequired: string;
  loadingProducts: string;
  close: string;
  productNames: Record<string, string>;
  productDescriptions: Record<string, string>;
  licenseStatuses: Record<string, string>;
  provisioningStatuses: Record<string, string>;
};

export type PlatformPortalWebsiteKompisEligibilityReason = {
  code: string;
  satisfied: boolean;
};

export type PlatformPortalWebsiteKompisStatus = {
  customerId: string;
  eligible: boolean;
  active: boolean;
  activationStatus: string;
  reasons: PlatformPortalWebsiteKompisEligibilityReason[];
  agreement: {
    eligible: boolean;
    status: string | null;
    duration: string | null;
  };
  license: {
    eligible: boolean;
    id: string | null;
    status: string | null;
    productCode: string | null;
    provisioningStatus: string | null;
    domainReference: string | null;
  };
  domain: {
    eligible: boolean;
    id: string | null;
    hostname: string | null;
    status: string | null;
    verified: boolean;
  };
  installation: {
    eligible: boolean;
    id: string | null;
    installId: string | null;
    status: string | null;
  };
  approval: {
    required: boolean;
    satisfied: boolean;
  };
  existingActivation: {
    id: string | null;
    status: string | null;
    activatedAt: string | null;
    entitlementEnabled: boolean;
    configEnabled: boolean;
  };
};

export type PlatformPortalWebsiteKompisActivationResult = {
  customerId: string;
  created: boolean;
  idempotentReplay: boolean;
  activation: {
    id: string | null;
    moduleCode: string | null;
    status: string | null;
    activatedAt: string | null;
  };
  entitlement: {
    id: string | null;
    status: string | null;
    created: boolean;
  };
  license: {
    id: string | null;
    status: string | null;
    provisioningStatus: string | null;
  };
  domain: {
    id: string | null;
    hostname: string | null;
  };
  installation: {
    id: string | null;
    installId: string | null;
  };
};

export type PlatformPortalWebsiteKompisLabels = {
  title: string;
  serviceName: string;
  sectionActivatedServices: string;
  statusLabel: string;
  notReady: string;
  readyForActivation: string;
  activating: string;
  active: string;
  suspended: string;
  failed: string;
  revoked: string;
  activate: string;
  activatingAction: string;
  summary: string;
  agreement: string;
  licensePackage: string;
  appLicense: string;
  setupStatus: string;
  domain: string;
  installation: string;
  installKey: string;
  prerequisites: string;
  internalReason: string;
  reasonRequired: string;
  confirmRequired: string;
  summaryTitle: string;
  summaryActivates: string;
  summaryAgreementUnchanged: string;
  summaryLicenseUnchanged: string;
  summaryDomainUnchanged: string;
  summaryInstallationUnchanged: string;
  summaryNoPayment: string;
  summaryNoEmail: string;
  summaryNoDns: string;
  cancel: string;
  close: string;
  retry: string;
  success: string;
  error: string;
  notEligible: string;
  alreadyActive: string;
  unauthorized: string;
  forbidden: string;
  viewService: string;
  loading: string;
  reasonLabels: Record<string, string>;
  activationStatuses: Record<string, string>;
};

export type PlatformPortalAppKompisDeliveryModalSteps = {
  checkingRequirements: string;
  provisioningApp: string;
  provisioningCompanion: string;
  installing: string;
};

export type PlatformPortalAppKompisDeliveryLabels = {
  title: string;
  sectionTitle: string;
  serviceName: string;
  statusLabel: string;
  overallStatus: string;
  lastCheck: string;
  lastAttempt: string;
  rowAgreement: string;
  rowParentLicense: string;
  rowAppPanel: string;
  rowChild: string;
  rowDomain: string;
  rowInstallation: string;
  rowAutoInstall: string;
  rowAcknowledgement: string;
  deliver: string;
  delivering: string;
  reconcile: string;
  reconciling: string;
  verify: string;
  verifying: string;
  cancel: string;
  close: string;
  retry: string;
  success: string;
  reconcileSuccess: string;
  verifySuccess: string;
  error: string;
  notEligible: string;
  alreadyActive: string;
  blocked: string;
  blockedDescription: string;
  unauthorized: string;
  forbidden: string;
  loading: string;
  emptyTitle: string;
  emptyDescription: string;
  prerequisites: string;
  internalReason: string;
  reasonRequired: string;
  confirmRequired: string;
  modalTitle: string;
  modalSteps: PlatformPortalAppKompisDeliveryModalSteps;
  summaryTitle: string;
  summaryDelivers: string;
  summaryAppProvisioned: string;
  summaryCompanionInstalled: string;
  summaryAutoInstallEnabled: string;
  summaryAcknowledgementVerified: string;
  summaryNoPayment: string;
  summaryNoEmail: string;
  summaryNoDns: string;
  startDelivery: string;
  tokenPresent: string;
  tokenMissing: string;
  notRevoked: string;
  revokedLabel: string;
  statusActiveLabel: string;
  statusInactiveLabel: string;
  installEnabledLabel: string;
  installDisabledLabel: string;
  acknowledgementOk: string;
  acknowledgementFailed: string;
  deliveryStatuses: Record<string, string>;
  reasonLabels: Record<string, string>;
};

export type PlatformPortalCustomerDomain = {
  id: string;
  hostname: string;
  status: string;
  verificationStatus: string | null;
  installId: string | null;
  createdAt: string | null;
  verifiedAt: string | null;
};

export type PlatformPortalEligibleLicense = {
  id: string;
  productCode: string | null;
  productName: string | null;
  status: string;
  domain: string | null;
  installId: string | null;
  provisioningStatus: string | null;
  eligible: boolean;
};

export type PlatformPortalCustomerDomainsPayload = {
  customerId: string | null;
  domains: PlatformPortalCustomerDomain[];
  eligibleLicenses: PlatformPortalEligibleLicense[];
  generatedAt: string | null;
};

export type PlatformPortalCustomerInstallation = {
  id: string;
  installId: string;
  status: string;
  systemType: string | null;
  name: string | null;
  siteUrl: string | null;
  domainId: string | null;
  createdAt: string | null;
  activatedAt: string | null;
};

export type PlatformPortalCustomerInstallationsPayload = {
  customerId: string | null;
  installations: PlatformPortalCustomerInstallation[];
  generatedAt: string | null;
};

export type PlatformPortalCustomerDomainInstallationResult = {
  customerId: string;
  licenseId: string;
  domain: {
    id: string;
    hostname: string;
    status: string;
    verifiedAt: string | null;
    createdAt: string | null;
  };
  installation: {
    id: string;
    installId: string;
    status: string;
    createdAt: string | null;
    activatedAt: string | null;
  };
  license: {
    id: string;
    status: string;
    provisioningStatus: string;
    domainId: string | null;
    installationId: string | null;
    installId: string | null;
  };
  created: {
    domain: boolean;
    installation: boolean;
  };
  idempotentReplay: boolean;
};

export type PlatformPortalDomainInstallationLabels = {
  addDomainInstallation: string;
  title: string;
  currentDomains: string;
  currentInstallations: string;
  selectLicense: string;
  eligibleLicenses: string;
  noEligibleLicenses: string;
  hostname: string;
  canonicalHostname: string;
  domainId: string;
  domainStatus: string;
  installation: string;
  installationId: string;
  installId: string;
  installationStatus: string;
  notVerified: string;
  waitingVerification: string;
  readyForActivation: string;
  active: string;
  suspended: string;
  failed: string;
  domainNotAutoVerified: string;
  dnsNotChanged: string;
  websiteKompisNotActivated: string;
  internalReason: string;
  reasonRequired: string;
  summary: string;
  summaryCreates: string;
  create: string;
  creating: string;
  success: string;
  domainAlreadyRegistered: string;
  licenseAlreadyHasDomain: string;
  licenseAlreadyHasInstallation: string;
  hostnameInvalid: string;
  emptyDomains: string;
  emptyInstallations: string;
  forbidden: string;
  unauthorized: string;
  loadDomainsError: string;
  loadInstallationsError: string;
  createError: string;
  cancel: string;
  retry: string;
  confirmRequired: string;
  loadingEligible: string;
  close: string;
  installIdHelp: string;
  conflictReadOnly: string;
  productNames: Record<string, string>;
  domainStatuses: Record<string, string>;
  installationStatuses: Record<string, string>;
  provisioningStatuses: Record<string, string>;
};
