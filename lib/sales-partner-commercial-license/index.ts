export {
  AIPIFY_INTERNAL_PROGRAM_OWNER_TENANT_KEY,
  COMMERCIAL_LICENSE_STATUSES_ALLOWING_SELLER_OPS,
  SALES_PARTNER_CAPACITY_LIMIT_NOTIFICATION_CONTRACT,
  SALES_PARTNER_COMMERCIAL_LICENSE_FOUNDATION,
} from "./contract";

export {
  assertProgramKindMatchesLicense,
  buildAipifyInternalSystemLicenseSnapshot,
  freeAipifyPartnerAccessContract,
  isAipifyInternalSystemLicense,
  isLicenseStatusAllowingNewSeatActivation,
  isLicenseStatusAllowingSellerOps,
  resolveCommercialLicenseOperationalAccess,
} from "./access";

export {
  decideSellerSeatActivation,
  isCapacityLimitReached,
  isSeatCapacityConfigured,
  normalizeLicenseLevelConfig,
  simulateConcurrentSeatActivations,
} from "./capacity";

export {
  assertLedgerPlanesIsolated,
  assertSameProgram,
  assertSameTenantPrograms,
  detectMembershipCollision,
  isAipifyInternalProgramOwner,
  membershipKey,
} from "./isolation";

export {
  assertNotificationContractNeverPurchasable,
  buildCapacityLimitReachedNotification,
} from "./notification-contract";

export type {
  CapacityLimitNotificationContract,
  SalesPartnerLicenseLevelConfig,
  SalesPartnerLicenseSnapshot,
  SalesPartnerLicenseSource,
  SalesPartnerLicenseStatus,
  SalesPartnerMembershipRef,
  SalesPartnerMembershipStatus,
  SalesPartnerProgramKind,
  SalesPartnerProgramRef,
  SalesPartnerSellerRole,
  SeatActivationDecision,
} from "./types";
