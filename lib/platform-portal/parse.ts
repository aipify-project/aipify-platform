import type {
  PlatformPortalCustomerDetail,
  PlatformPortalCustomerDetailDomain,
  PlatformPortalCustomerDetailEntitlement,
  PlatformPortalCustomerDetailLicense,
  PlatformPortalCustomerRecord,
  PlatformPortalCustomerSummary,
  PlatformPortalCustomersPayload,
  PlatformPortalDashboard,
} from "./types";

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" ? (raw as Record<string, unknown>) : null;
}

function asString(value: unknown, fallback = ""): string {
  return value == null ? fallback : String(value);
}

function asNumber(value: unknown, fallback = 0): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function asNonNegativeCount(value: unknown, fallback = 0): number {
  const n = asNumber(value, fallback);
  return n < 0 ? 0 : n;
}

function asStrictBoolean(value: unknown, fallback = false): boolean {
  return typeof value === "boolean" ? value : fallback;
}

function asNullableTrimmedString(value: unknown): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asRequiredId(value: unknown): string | null {
  return asNullableTrimmedString(value);
}

function emptyCustomersPayload(): PlatformPortalCustomersPayload {
  return {
    summary: {
      total: 0,
      active: 0,
      new30d: 0,
      requiresAttention: 0,
    },
    customers: [],
  };
}

function parseCustomerSummary(raw: unknown): PlatformPortalCustomerSummary {
  const summary = asRecord(raw);
  if (!summary) {
    return emptyCustomersPayload().summary;
  }

  return {
    total: asNonNegativeCount(summary.total),
    active: asNonNegativeCount(summary.active),
    new30d: asNonNegativeCount(summary.new_30d),
    requiresAttention: asNonNegativeCount(summary.requires_attention),
  };
}

function parseCustomerRecord(raw: unknown): PlatformPortalCustomerRecord | null {
  const row = asRecord(raw);
  if (!row) return null;

  const organizationId = asRequiredId(row.organization_id);
  const customerId = asRequiredId(row.customer_id);
  const companyId = asRequiredId(row.company_id);
  if (!organizationId || !customerId || !companyId) return null;

  const legalNameRaw = asNullableTrimmedString(row.legal_name);

  return {
    organizationId,
    customerId,
    companyId,
    legalName: legalNameRaw ?? "",
    organizationNumber: asNullableTrimmedString(row.organization_number),
    organizationSlug: asNullableTrimmedString(row.organization_slug),
    customerStatus: asNullableTrimmedString(row.customer_status),
    createdAt: asNullableTrimmedString(row.created_at),
    subscriptionStatus: asNullableTrimmedString(row.subscription_status),
    subscriptionPlanKey: asNullableTrimmedString(row.subscription_plan_key),
    subscriptionPlanType: asNullableTrimmedString(row.subscription_plan_type),
    subscriptionPlanName: asNullableTrimmedString(row.subscription_plan_name),
    subscriptionBillingCycle: asNullableTrimmedString(row.subscription_billing_cycle),
    subscriptionCreatedAt: asNullableTrimmedString(row.subscription_created_at),
    subscriptionUpdatedAt: asNullableTrimmedString(row.subscription_updated_at),
    isLifetime: asStrictBoolean(row.is_lifetime),
    primaryContactName: asNullableTrimmedString(row.primary_contact_name),
    memberCount: asNonNegativeCount(row.member_count),
    licenseServiceStatus: asNullableTrimmedString(row.license_service_status),
    paymentOverdueSince: asNullableTrimmedString(row.payment_overdue_since),
    isPartnerAttributed: asStrictBoolean(row.is_partner_attributed),
    growthPartnerProfileId: asNullableTrimmedString(row.growth_partner_profile_id),
    growthPartnerPublicId: asNullableTrimmedString(row.growth_partner_public_id),
    openSupportCount: asNonNegativeCount(row.open_support_count),
    lastActivityAt: asNullableTrimmedString(row.last_activity_at),
    requiresAttention: asStrictBoolean(row.requires_attention),
  };
}

export function parsePlatformPortalDashboard(raw: unknown): PlatformPortalDashboard | null {
  const row = asRecord(raw);
  if (!row) return null;

  const payment = asRecord(row.payment_status_summary) ?? {};
  const customerSuccess = asRecord(row.customer_success_indicators) ?? {};
  const marketplace = asRecord(row.marketplace_moderation) ?? {};

  const productUpdates = Array.isArray(row.product_deployment_updates)
    ? row.product_deployment_updates
        .map((item) => {
          const u = asRecord(item);
          if (!u) return null;
          return {
            id: asString(u.id),
            title: asString(u.title),
            version: asString(u.version),
            classification: asString(u.classification),
            scheduled_at: u.scheduled_at ? asString(u.scheduled_at) : null,
          };
        })
        .filter((u): u is NonNullable<typeof u> => u !== null)
    : [];

  return {
    organizations_requiring_attention: asNumber(row.organizations_requiring_attention),
    active_subscriptions: asNumber(row.active_subscriptions),
    open_support_workload: asNumber(row.open_support_workload),
    payment_status_summary: {
      active: asNumber(payment.active),
      past_due: asNumber(payment.past_due),
      trialing: asNumber(payment.trialing),
    },
    customer_success_indicators: {
      organizations_total: asNumber(customerSuccess.organizations_total),
      organizations_requiring_attention: asNumber(customerSuccess.organizations_requiring_attention),
      healthy_ratio_pct: asNumber(customerSuccess.healthy_ratio_pct, 100),
    },
    marketplace_moderation: {
      pending_review: asNumber(marketplace.pending_review),
      published: asNumber(marketplace.published),
    },
    product_deployment_updates: productUpdates,
  };
}

export function parsePlatformPortalCustomersPayload(value: unknown): PlatformPortalCustomersPayload {
  const row = asRecord(value);
  if (!row) return emptyCustomersPayload();

  const customers = Array.isArray(row.customers)
    ? row.customers
        .map((item) => parseCustomerRecord(item))
        .filter((item): item is PlatformPortalCustomerRecord => item !== null)
    : [];

  return {
    summary: parseCustomerSummary(row.summary),
    customers,
  };
}

function parseLicense(raw: unknown): PlatformPortalCustomerDetailLicense | null {
  const row = asRecord(raw);
  if (!row) return null;
  const id = asRequiredId(row.id);
  const status = asNullableTrimmedString(row.status);
  if (!id || !status) return null;
  return {
    id,
    status,
    productCode: asNullableTrimmedString(row.product_code),
    productName: asNullableTrimmedString(row.product_name),
    domain: asNullableTrimmedString(row.domain),
    installId: asNullableTrimmedString(row.install_id),
    createdAt: asNullableTrimmedString(row.created_at),
    activatedAt: asNullableTrimmedString(row.activated_at),
    expiresAt: asNullableTrimmedString(row.expires_at),
  };
}

function parseDomain(raw: unknown): PlatformPortalCustomerDetailDomain | null {
  const row = asRecord(raw);
  if (!row) return null;
  const id = asRequiredId(row.id);
  const hostname = asNullableTrimmedString(row.hostname);
  const status = asNullableTrimmedString(row.status);
  if (!id || !hostname || !status) return null;
  return {
    id,
    hostname,
    status,
    installId: asNullableTrimmedString(row.install_id),
    createdAt: asNullableTrimmedString(row.created_at),
    verifiedAt: asNullableTrimmedString(row.verified_at),
  };
}

function parseEntitlement(raw: unknown): PlatformPortalCustomerDetailEntitlement | null {
  const row = asRecord(raw);
  if (!row) return null;
  const id = asRequiredId(row.id);
  const code = asNullableTrimmedString(row.code);
  const status = asNullableTrimmedString(row.status);
  if (!id || !code || !status) return null;
  return {
    id,
    code,
    name: asNullableTrimmedString(row.name),
    status,
    grantedAt: asNullableTrimmedString(row.granted_at),
    expiresAt: asNullableTrimmedString(row.expires_at),
  };
}

export function parsePlatformPortalCustomerDetail(
  value: unknown,
): PlatformPortalCustomerDetail | null {
  const row = asRecord(value);
  if (!row) return null;

  const customer = asRecord(row.customer);
  const commercial = asRecord(row.commercial);
  const usage = asRecord(row.usage);
  const metadata = asRecord(row.metadata);
  if (!customer || !commercial || !usage || !metadata) return null;

  const id = asRequiredId(customer.id);
  const companyId = asRequiredId(customer.company_id);
  const name = asNullableTrimmedString(customer.name);
  const status = asNullableTrimmedString(customer.status);
  const generatedAt = asNullableTrimmedString(metadata.generated_at);
  if (!id || !companyId || !name || !status || !generatedAt) return null;

  const licenses = Array.isArray(row.licenses)
    ? row.licenses
        .map((item) => parseLicense(item))
        .filter((item): item is PlatformPortalCustomerDetailLicense => item !== null)
    : [];
  const domains = Array.isArray(row.domains)
    ? row.domains
        .map((item) => parseDomain(item))
        .filter((item): item is PlatformPortalCustomerDetailDomain => item !== null)
    : [];
  const entitlements = Array.isArray(row.entitlements)
    ? row.entitlements
        .map((item) => parseEntitlement(item))
        .filter((item): item is PlatformPortalCustomerDetailEntitlement => item !== null)
    : [];

  return {
    customer: {
      id,
      companyId,
      name,
      legalName: asNullableTrimmedString(customer.legal_name),
      slug: asNullableTrimmedString(customer.slug),
      organizationNumber: asNullableTrimmedString(customer.organization_number),
      status,
      createdAt: asNullableTrimmedString(customer.created_at),
      updatedAt: asNullableTrimmedString(customer.updated_at),
      requiresAttention: asStrictBoolean(customer.requires_attention),
    },
    commercial: {
      lifetime: asStrictBoolean(commercial.lifetime),
      subscriptionStatus: asNullableTrimmedString(commercial.subscription_status),
      planName: asNullableTrimmedString(commercial.plan_name),
      trialStartsAt: asNullableTrimmedString(commercial.trial_starts_at),
      trialEndsAt: asNullableTrimmedString(commercial.trial_ends_at),
      currentPeriodStartsAt: asNullableTrimmedString(commercial.current_period_starts_at),
      currentPeriodEndsAt: asNullableTrimmedString(commercial.current_period_ends_at),
      partnerAttributed: asStrictBoolean(commercial.partner_attributed),
      partnerName: asNullableTrimmedString(commercial.partner_name),
    },
    usage: {
      memberCount: asNonNegativeCount(usage.member_count),
      activeLicenseCount: asNonNegativeCount(usage.active_license_count),
      totalLicenseCount: asNonNegativeCount(usage.total_license_count),
      domainCount: asNonNegativeCount(usage.domain_count),
      installationCount: asNonNegativeCount(usage.installation_count),
      openSupportCount: asNonNegativeCount(usage.open_support_count),
    },
    licenses,
    domains,
    entitlements,
    metadata: {
      generatedAt,
    },
  };
}
