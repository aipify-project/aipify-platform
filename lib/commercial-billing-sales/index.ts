export {
  COMMERCIAL_BILLING_SALES_MASTER,
  COMMERCIAL_BILLING_SQL_CANDIDATES,
  COMMERCIAL_OPEN_OWNER_APPROVALS,
  COMMERCIAL_PAYMENT_GRACE_DAYS,
  SALES_PARTNER_LICENSE_SNAPSHOT_RPC,
} from "./contract";

export {
  applyBasisPoints,
  currencyExponent,
  divRoundHalfUp,
  majorToMinorExact,
  normalizeCurrency,
  parseMinorAmount,
} from "./money";
export type { MinorParseResult } from "./money";

export {
  authorizeSalesPartnerOperation,
  buildLicenseCapacityView,
  buildSalesPartnerLicenseSnapshotFromCoreRow,
  buildSnapshotsForOwnerTenant,
  decideSeatActivationForOwner,
  listSellerProgramAccess,
  readSalesPartnerLicenseSnapshots,
  resolveEffectiveLicenseStatus,
} from "./license-snapshot";
export type {
  CoreSalesPartnerLicenseRow,
  LicenseCapacityView,
  LicenseSnapshotBuildResult,
  LicenseSnapshotListResult,
  SalesPartnerAccessDecision,
  SalesPartnerAccessInput,
  SalesPartnerLicenseReadResult,
} from "./license-snapshot";

export {
  authorizeProductOperation,
  buildFreeAccessEntitlement,
  computeGraceUntil,
  detectDependencyCycle,
  entitlementKey,
  resolveEffectiveEntitlement,
} from "./entitlement";
export type {
  EffectiveEntitlement,
  EffectiveEntitlementState,
  EntitlementAuthorization,
  EntitlementInterval,
  EntitlementRecord,
  EntitlementSource,
  EntitlementState,
  ProductOperation,
} from "./entitlement";

export {
  assertPriceVersionImmutable,
  buildPriceMappingIndex,
  computePriceVersionId,
  createTestPriceAdapter,
  isLiveStripeMappingEnabled,
  LIVE_PRICE_ADAPTER_DISABLED,
  planProductCenterStripeMapping,
  resolveMappedPrice,
} from "./stripe-mapping";
export type {
  BillingInterval,
  EnsureProviderPriceResult,
  MappingBlockReason,
  PriceMappingIndex,
  PriceMappingPlan,
  PriceMappingPlanEntry,
  PriceVersionMapping,
  ProviderPriceAdapter,
  ResolvePriceResult,
  VatLabel,
} from "./stripe-mapping";

export { validateServerPricing } from "./pricing";
export type { ApprovedDiscount, PricingFailure, ServerPricing } from "./pricing";

export {
  assertAttributionBoundToTenant,
  resolveSalesAttribution,
} from "./attribution";
export type {
  AttributionRejectionReason,
  AttributionResolution,
  SalesAttribution,
  SalesLinkRecord,
  SellerStanding,
} from "./attribution";

export {
  createTestCheckoutAdapter,
  interpretCheckoutReturn,
  LIVE_CHECKOUT_ADAPTER_DISABLED,
  prepareCheckoutIntent,
} from "./checkout";
export type {
  CheckoutContext,
  CheckoutFailure,
  CheckoutIntent,
  CheckoutPrepareResult,
  CheckoutProductState,
  CheckoutRequest,
  CheckoutSessionAdapter,
  CheckoutSessionResult,
} from "./checkout";

export {
  applyBillingEvent,
  buildWebhookSignatureHeader,
  computeWebhookSignature,
  createEmptyBillingState,
  findPaymentRecord,
  normalizeProviderEvent,
  processVerifiedProviderEvent,
  registerCheckoutIntentInState,
  verifyWebhookSignature,
  WEBHOOK_SIGNATURE_TOLERANCE_SECONDS,
} from "./webhook";
export type {
  BillingContext,
  BillingEffect,
  BillingEffectType,
  BillingEventKind,
  BillingOutcome,
  BillingState,
  BillingStepResult,
  NormalizedBillingEvent,
  NormalizeResult,
  PaymentRecord,
  PaymentStatus,
  RawProviderEvent,
  SignatureVerification,
  SubscriptionState,
  SubscriptionStatus,
} from "./webhook";

export {
  buildCommercialNotifications,
  buildCustomerPaymentHistory,
  detectDoubleBilling,
  INVOICE_DOCUMENT_POLICY,
  INVOICE_OPEN_QUESTIONS,
  isSellerSideNotification,
} from "./invoices";
export type {
  CommercialNotificationDto,
  CommercialNotificationEventName,
  CustomerPaymentHistoryDto,
  CustomerPaymentHistoryItemDto,
} from "./invoices";

export {
  applyCommissionPaymentCaptured,
  applyCommissionReinstatement,
  applyCommissionReversal,
  applyCommissionSubscriptionCancelled,
  canEnterManualSettlement,
  COMMISSION_SETTLEMENT_POLICY,
  commissionSaleKey,
  computePercentCommissionMinorForParityOnly,
  createEmptyCommissionLedger,
  findSaleByPaymentId,
  percentCommissionIsActivatable,
  queueSaleForManualSettlement,
  recordManualSettlementCompleted,
  resolveCommissionRuleSnapshot,
  saleLedgerBalanceMinor,
} from "./commission";
export type {
  CommissionCaptureInput,
  CommissionInterval,
  CommissionLedger,
  CommissionLedgerEntry,
  CommissionOutcome,
  CommissionResult,
  CommissionRuleSnapshot,
  CommissionSale,
} from "./commission";

export { buildCommercialOverview, checkVariantPriceCommissionParity, metric } from "./platform-overview";
export type { CommercialOverview, CommercialOverviewInput, Metric, ParityIssue } from "./platform-overview";

export {
  AGENT_CONTRACT_RULES,
  COMMERCIAL_END_TO_END_FLOW,
  NORDIC_FOUNDER_EXCHANGE_HOOKS,
  PRESERVED_SURFACES,
} from "./agent-contracts";
export type {
  Agent2CommercialContracts,
  Agent3CommercialContracts,
  Agent3VerifiedPurchaseAnalyticsEvent,
  Agent4CommercialContracts,
  Agent4PresenceCommercialHint,
} from "./agent-contracts";

export {
  ACTIVATION_ACTIONS,
  ACTIVATION_CODE_LOCKS,
  ACTIVATION_ENVIRONMENTS,
  ACTIVATION_FACT_KEYS,
  ACTIVATION_READINESS,
  ACTIVATION_WRITER_KEYS,
  ActivationBlockedError,
  activationMatrixAgreesWithMasterSwitches,
  assertActivationAllowed,
  COMMERCIAL_ACTIVATION_YES_PACKAGES,
  describeActivationAction,
  evaluateActivation,
  listOpenOwnerApprovals,
  resolveActivationReadiness,
} from "./activation-gates";
export type {
  ActivationAction,
  ActivationDecision,
  ActivationDenyReason,
  ActivationReadiness,
  ActivationReadinessKey,
  OpenOwnerApproval,
} from "./activation-gates";

export {
  AGENT4_PRESENCE_CONTRACT,
  COMMERCIAL_PURCHASE_ANALYTICS_EVENT,
  KOMPIS_FIRST_REVENUE_PATH,
  buildAgent2CheckoutIntentDto,
  buildAgent2EntitlementStateDto,
  buildAgent2ProductDetailActivationContract,
  buildAgent2ReceiptReadDto,
  buildAgent3SupportNotificationEnvelope,
  buildVerifiedPurchaseAnalyticsEvent,
} from "./activation-contracts";
export type {
  Agent2CheckoutIntentDto,
  Agent2EntitlementAccessKind,
  Agent2EntitlementStateDto,
  Agent2ProductDetailActivationContract,
  Agent2ReceiptReadDto,
  Agent3NotificationAudience,
  Agent3SupportNotificationEnvelope,
  Agent4PresenceEventName,
  AnalyticsConsent,
  VerifiedPurchaseAnalyticsEvent,
  VerifiedPurchaseAnalyticsResult,
} from "./activation-contracts";
