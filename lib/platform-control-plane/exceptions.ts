import type { PlatformControlPlaneCapability } from "./permissions";

export type PlatformExceptionSeverity = "info" | "attention" | "critical";

export type PlatformExceptionDefinition = {
  id: string;
  category:
    | "customer_setup"
    | "payment_failed"
    | "invoice_mismatch"
    | "commission_dispute"
    | "partner_invoice_mismatch"
    | "provider_template"
    | "integration_failure"
    | "deployment"
    | "support_escalation"
    | "security"
    | "approval";
  href: string;
  severity: PlatformExceptionSeverity;
  labelKey: string;
  nextActionKey: string;
  requiresCapability: PlatformControlPlaneCapability;
  authoritativeSource: string;
};

/**
 * Exception queue is a navigation/workboard over existing authoritative surfaces.
 * It does not create a parallel incident/finance model.
 */
export const PLATFORM_EXCEPTION_DEFINITIONS: PlatformExceptionDefinition[] = [
  {
    id: "customer_requires_follow_up",
    category: "customer_setup",
    href: "/platform/customer-success",
    severity: "attention",
    labelKey: "platform.controlPlane.exceptions.customerFollowUp",
    nextActionKey: "platform.controlPlane.exceptions.next.reviewCustomerSuccess",
    requiresCapability: "customer_read",
    authoritativeSource: "get_platform_portal_customer_success_overview",
  },
  {
    id: "payment_past_due",
    category: "payment_failed",
    href: "/platform/billing/payment-operations",
    severity: "critical",
    labelKey: "platform.controlPlane.exceptions.paymentPastDue",
    nextActionKey: "platform.controlPlane.exceptions.next.reviewPaymentOperations",
    requiresCapability: "finance_read",
    authoritativeSource: "payment operations / subscription past_due",
  },
  {
    id: "invoice_review",
    category: "invoice_mismatch",
    href: "/platform/billing/invoices",
    severity: "attention",
    labelKey: "platform.controlPlane.exceptions.invoiceReview",
    nextActionKey: "platform.controlPlane.exceptions.next.reviewInvoices",
    requiresCapability: "finance_read",
    authoritativeSource: "list_platform_invoices",
  },
  {
    id: "commission_approval",
    category: "commission_dispute",
    href: "/platform/billing/commissions",
    severity: "attention",
    labelKey: "platform.controlPlane.exceptions.commissionApproval",
    nextActionKey: "platform.controlPlane.exceptions.next.reviewCommissions",
    requiresCapability: "partner_read",
    authoritativeSource: "unified billing commissions",
  },
  {
    id: "partner_settlement",
    category: "partner_invoice_mismatch",
    href: "/platform/partners/settlement",
    severity: "attention",
    labelKey: "platform.controlPlane.exceptions.partnerSettlement",
    nextActionKey: "platform.controlPlane.exceptions.next.reviewPartnerSettlement",
    requiresCapability: "partner_read",
    authoritativeSource: "get_platform_partner_settlement_operations",
  },
  {
    id: "provider_template_validation",
    category: "provider_template",
    href: "/platform/provider-onboarding",
    severity: "attention",
    labelKey: "platform.controlPlane.exceptions.providerTemplate",
    nextActionKey: "platform.controlPlane.exceptions.next.reviewProviderOnboarding",
    requiresCapability: "product_publish",
    authoritativeSource: "provider onboarding contracts",
  },
  {
    id: "reliability_incident",
    category: "integration_failure",
    href: "/platform/reliability",
    severity: "critical",
    labelKey: "platform.controlPlane.exceptions.reliabilityIncident",
    nextActionKey: "platform.controlPlane.exceptions.next.reviewReliability",
    requiresCapability: "operations_read",
    authoritativeSource: "get_platform_reliability_center",
  },
  {
    id: "support_escalation",
    category: "support_escalation",
    href: "/platform/support",
    severity: "attention",
    labelKey: "platform.controlPlane.exceptions.supportEscalation",
    nextActionKey: "platform.controlPlane.exceptions.next.reviewSupport",
    requiresCapability: "customer_read",
    authoritativeSource: "list_platform_support_queue",
  },
  {
    id: "security_event",
    category: "security",
    href: "/platform/trust/security",
    severity: "critical",
    labelKey: "platform.controlPlane.exceptions.securityEvent",
    nextActionKey: "platform.controlPlane.exceptions.next.reviewSecurity",
    requiresCapability: "security_read",
    authoritativeSource: "get_platform_trust_governance",
  },
  {
    id: "approval_pending",
    category: "approval",
    href: "/platform/actions",
    severity: "attention",
    labelKey: "platform.controlPlane.exceptions.approvalPending",
    nextActionKey: "platform.controlPlane.exceptions.next.reviewApprovals",
    requiresCapability: "audit_read",
    authoritativeSource: "platform action approvals",
  },
];
