/**
 * Customer Success Overview V1 — types, parser, status helpers.
 * Read-only portal contract. No invented health/churn scores.
 */

export const PLATFORM_CUSTOMER_SUCCESS_STATUSES = [
  "healthy",
  "attention",
  "critical",
  "incomplete",
  "unknown",
] as const;

export type PlatformCustomerSuccessStatus =
  (typeof PLATFORM_CUSTOMER_SUCCESS_STATUSES)[number];

export const PLATFORM_CUSTOMER_SUCCESS_REASON_CODES = [
  "agreement_active",
  "agreement_missing",
  "agreement_pending",
  "agreement_suspended",
  "agreement_past_due",
  "license_active",
  "license_missing",
  "license_pending",
  "license_suspended",
  "domain_missing",
  "domain_unverified",
  "installation_missing",
  "installation_revoked",
  "service_ready_for_activation",
  "service_active",
  "setup_failed",
  "setup_incomplete",
  "setup_complete",
  "status_unknown",
] as const;

export type PlatformCustomerSuccessReasonCode =
  (typeof PLATFORM_CUSTOMER_SUCCESS_REASON_CODES)[number];

export type PlatformCustomerSuccessMetrics = {
  totalCustomers: number;
  healthyCustomers: number;
  attentionCustomers: number;
  criticalCustomers: number;
  incompleteCustomers: number;
  unknownCustomers: number;
};

export type PlatformCustomerSuccessAgreement = {
  status: string | null;
  duration: string | null;
  trialEndsAt: string | null;
};

export type PlatformCustomerSuccessLicense = {
  count: number;
  activeCount: number;
  primaryStatus: string | null;
  provisioningStatus: string | null;
};

export type PlatformCustomerSuccessDomains = {
  count: number;
  verifiedCount: number;
  primaryDomain: string | null;
};

export type PlatformCustomerSuccessInstallations = {
  count: number;
  activeCount: number;
  revokedCount: number;
};

export type PlatformCustomerSuccessServices = {
  activeCount: number;
  websiteKompisStatus: string | null;
};

export type PlatformCustomerSuccessSupport = {
  openCount: number | null;
};

export type PlatformCustomerSuccessCustomer = {
  customerId: string;
  companyId: string | null;
  customerKey: string;
  companyName: string;
  organizationNumber: string | null;
  countryCode: string | null;
  lifecycleStatus: string | null;
  successStatus: PlatformCustomerSuccessStatus;
  successReasonCodes: PlatformCustomerSuccessReasonCode[];
  agreement: PlatformCustomerSuccessAgreement;
  license: PlatformCustomerSuccessLicense;
  domains: PlatformCustomerSuccessDomains;
  installations: PlatformCustomerSuccessInstallations;
  services: PlatformCustomerSuccessServices;
  registeredUsers: number | null;
  support: PlatformCustomerSuccessSupport;
  lastRelevantActivityAt: string | null;
};

export type PlatformCustomerSuccessOverview = {
  generatedAt: string;
  metrics: PlatformCustomerSuccessMetrics;
  customers: PlatformCustomerSuccessCustomer[];
};

export type PlatformCustomerSuccessLabels = {
  title: string;
  subtitle: string;
  lastChecked: string;
  searchPlaceholder: string;
  filterAll: string;
  filterHealthy: string;
  filterAttention: string;
  filterCritical: string;
  filterIncomplete: string;
  filterUnknown: string;
  filterAgreement: string;
  filterLicense: string;
  filterService: string;
  filterCountry: string;
  kpiTotal: string;
  kpiHealthy: string;
  kpiAttention: string;
  kpiCritical: string;
  kpiIncomplete: string;
  columnCustomer: string;
  columnStatus: string;
  columnAgreement: string;
  columnLicenseSetup: string;
  columnDomains: string;
  columnInstallations: string;
  columnServices: string;
  columnUsers: string;
  columnFollowUp: string;
  openCustomer: string;
  notAvailable: string;
  emptyTitle: string;
  emptyDescription: string;
  filteredEmptyTitle: string;
  filteredEmptyDescription: string;
  errorTitle: string;
  errorDescription: string;
  retry: string;
  moreReasons: string;
  licenseActive: string;
  licenseMissing: string;
  domainsCount: string;
  verifiedCount: string;
  installationsCount: string;
  revokedHighlight: string;
  servicesCount: string;
  websiteKompis: string;
  successStatuses: Record<PlatformCustomerSuccessStatus, string>;
  reasonCodes: Record<PlatformCustomerSuccessReasonCode, string>;
  agreementStatuses: Record<string, string>;
  durationLabels: Record<string, string>;
  licenseStatuses: Record<string, string>;
  setupStatuses: Record<string, string>;
  serviceStatuses: Record<string, string>;
  unknownStatus: string;
  clearFilters: string;
};

const STATUS_SET = new Set<string>(PLATFORM_CUSTOMER_SUCCESS_STATUSES);
const REASON_SET = new Set<string>(PLATFORM_CUSTOMER_SUCCESS_REASON_CODES);

const CRITICAL_REASONS: PlatformCustomerSuccessReasonCode[] = [
  "agreement_suspended",
  "agreement_past_due",
  "license_suspended",
  "installation_revoked",
  "setup_failed",
];

const ATTENTION_REASONS: PlatformCustomerSuccessReasonCode[] = [
  "agreement_pending",
  "license_pending",
  "domain_missing",
  "domain_unverified",
  "installation_missing",
  "service_ready_for_activation",
];

const INCOMPLETE_REASONS: PlatformCustomerSuccessReasonCode[] = [
  "agreement_missing",
  "license_missing",
  "setup_incomplete",
];

const HEALTHY_REASONS: PlatformCustomerSuccessReasonCode[] = [
  "setup_complete",
  "service_active",
  "license_active",
  "agreement_active",
];

function asRecord(raw: unknown): Record<string, unknown> | null {
  return raw && typeof raw === "object" && !Array.isArray(raw)
    ? (raw as Record<string, unknown>)
    : null;
}

function asNullableTrimmedString(value: unknown): string | null {
  if (value == null) return null;
  const trimmed = String(value).trim();
  return trimmed.length > 0 ? trimmed : null;
}

function asNonNegativeCount(value: unknown, fallback = 0): number {
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return Math.floor(n);
}

function asNullableCount(value: unknown): number | null {
  if (value == null) return null;
  const n = Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.floor(n);
}

function asIsoDate(value: unknown): string | null {
  const raw = asNullableTrimmedString(value);
  if (!raw) return null;
  const ms = Date.parse(raw);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString();
}

function normalizeSuccessStatus(value: unknown): PlatformCustomerSuccessStatus {
  const raw = asNullableTrimmedString(value)?.toLowerCase();
  if (raw && STATUS_SET.has(raw)) {
    return raw as PlatformCustomerSuccessStatus;
  }
  return "unknown";
}

function normalizeReasonCode(value: unknown): PlatformCustomerSuccessReasonCode | null {
  const raw = asNullableTrimmedString(value)?.toLowerCase();
  if (!raw) return null;
  if (REASON_SET.has(raw)) return raw as PlatformCustomerSuccessReasonCode;
  return null;
}

function normalizeReasonCodes(value: unknown): PlatformCustomerSuccessReasonCode[] {
  if (!Array.isArray(value)) return [];
  const out: PlatformCustomerSuccessReasonCode[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    const code = normalizeReasonCode(item);
    if (!code || seen.has(code)) continue;
    seen.add(code);
    out.push(code);
  }
  return out;
}

function emptyMetrics(): PlatformCustomerSuccessMetrics {
  return {
    totalCustomers: 0,
    healthyCustomers: 0,
    attentionCustomers: 0,
    criticalCustomers: 0,
    incompleteCustomers: 0,
    unknownCustomers: 0,
  };
}

function parseMetrics(raw: unknown): PlatformCustomerSuccessMetrics {
  const row = asRecord(raw);
  if (!row) return emptyMetrics();
  return {
    totalCustomers: asNonNegativeCount(row.total_customers ?? row.totalCustomers),
    healthyCustomers: asNonNegativeCount(row.healthy_customers ?? row.healthyCustomers),
    attentionCustomers: asNonNegativeCount(
      row.attention_customers ?? row.attentionCustomers,
    ),
    criticalCustomers: asNonNegativeCount(row.critical_customers ?? row.criticalCustomers),
    incompleteCustomers: asNonNegativeCount(
      row.incomplete_customers ?? row.incompleteCustomers,
    ),
    unknownCustomers: asNonNegativeCount(row.unknown_customers ?? row.unknownCustomers),
  };
}

function parseAgreement(raw: unknown): PlatformCustomerSuccessAgreement {
  const row = asRecord(raw) ?? {};
  return {
    status: asNullableTrimmedString(row.status),
    duration: asNullableTrimmedString(row.duration),
    trialEndsAt: asIsoDate(row.trial_ends_at ?? row.trialEndsAt),
  };
}

function parseLicense(raw: unknown): PlatformCustomerSuccessLicense {
  const row = asRecord(raw) ?? {};
  return {
    count: asNonNegativeCount(row.count),
    activeCount: asNonNegativeCount(row.active_count ?? row.activeCount),
    primaryStatus: asNullableTrimmedString(row.primary_status ?? row.primaryStatus),
    provisioningStatus: asNullableTrimmedString(
      row.provisioning_status ?? row.provisioningStatus,
    ),
  };
}

function parseDomains(raw: unknown): PlatformCustomerSuccessDomains {
  const row = asRecord(raw) ?? {};
  return {
    count: asNonNegativeCount(row.count),
    verifiedCount: asNonNegativeCount(row.verified_count ?? row.verifiedCount),
    primaryDomain: asNullableTrimmedString(row.primary_domain ?? row.primaryDomain),
  };
}

function parseInstallations(raw: unknown): PlatformCustomerSuccessInstallations {
  const row = asRecord(raw) ?? {};
  return {
    count: asNonNegativeCount(row.count),
    activeCount: asNonNegativeCount(row.active_count ?? row.activeCount),
    revokedCount: asNonNegativeCount(row.revoked_count ?? row.revokedCount),
  };
}

function parseServices(raw: unknown): PlatformCustomerSuccessServices {
  const row = asRecord(raw) ?? {};
  return {
    activeCount: asNonNegativeCount(row.active_count ?? row.activeCount),
    websiteKompisStatus: asNullableTrimmedString(
      row.website_kompis_status ?? row.websiteKompisStatus,
    ),
  };
}

function parseCustomer(raw: unknown): PlatformCustomerSuccessCustomer | null {
  const row = asRecord(raw);
  if (!row) return null;

  const customerId = asNullableTrimmedString(row.customer_id ?? row.customerId);
  if (!customerId) return null;

  const companyName =
    asNullableTrimmedString(row.company_name ?? row.companyName) ?? "Customer";
  const customerKey =
    asNullableTrimmedString(row.customer_key ?? row.customerKey) ?? customerId;

  const supportRow = asRecord(row.support) ?? {};
  const registeredRaw = row.registered_users ?? row.registeredUsers;

  return {
    customerId,
    companyId: asNullableTrimmedString(row.company_id ?? row.companyId),
    customerKey,
    companyName,
    organizationNumber: asNullableTrimmedString(
      row.organization_number ?? row.organizationNumber,
    ),
    countryCode: asNullableTrimmedString(row.country_code ?? row.countryCode),
    lifecycleStatus: asNullableTrimmedString(row.lifecycle_status ?? row.lifecycleStatus),
    successStatus: normalizeSuccessStatus(row.success_status ?? row.successStatus),
    successReasonCodes: normalizeReasonCodes(
      row.success_reason_codes ?? row.successReasonCodes,
    ),
    agreement: parseAgreement(row.agreement),
    license: parseLicense(row.license),
    domains: parseDomains(row.domains),
    installations: parseInstallations(row.installations),
    services: parseServices(row.services),
    registeredUsers: asNullableCount(registeredRaw),
    support: {
      openCount: asNullableCount(supportRow.open_count ?? supportRow.openCount),
    },
    lastRelevantActivityAt: asIsoDate(
      row.last_relevant_activity_at ?? row.lastRelevantActivityAt,
    ),
  };
}

export function parsePlatformCustomerSuccessOverview(
  value: unknown,
): PlatformCustomerSuccessOverview {
  const root = asRecord(value);
  const customersRaw = root?.customers;
  const customers = Array.isArray(customersRaw)
    ? customersRaw
        .map(parseCustomer)
        .filter((item): item is PlatformCustomerSuccessCustomer => item !== null)
    : [];

  const generatedAt =
    asIsoDate(root?.generated_at ?? root?.generatedAt) ?? new Date(0).toISOString();

  const metrics = parseMetrics(root?.metrics);
  if (metrics.totalCustomers === 0 && customers.length > 0) {
    metrics.totalCustomers = customers.length;
    metrics.healthyCustomers = customers.filter((c) => c.successStatus === "healthy").length;
    metrics.attentionCustomers = customers.filter(
      (c) => c.successStatus === "attention",
    ).length;
    metrics.criticalCustomers = customers.filter((c) => c.successStatus === "critical").length;
    metrics.incompleteCustomers = customers.filter(
      (c) => c.successStatus === "incomplete",
    ).length;
    metrics.unknownCustomers = customers.filter((c) => c.successStatus === "unknown").length;
  }

  return {
    generatedAt,
    metrics,
    customers,
  };
}

export function primarySuccessReasonCode(
  customer: PlatformCustomerSuccessCustomer,
): PlatformCustomerSuccessReasonCode {
  const codes = customer.successReasonCodes;
  const pick = (preferred: PlatformCustomerSuccessReasonCode[]) => {
    for (const code of preferred) {
      if (codes.includes(code)) return code;
    }
    return null;
  };

  switch (customer.successStatus) {
    case "critical":
      return pick(CRITICAL_REASONS) ?? "status_unknown";
    case "attention":
      return pick(ATTENTION_REASONS) ?? "status_unknown";
    case "incomplete":
      return pick(INCOMPLETE_REASONS) ?? "setup_incomplete";
    case "healthy":
      return pick(HEALTHY_REASONS) ?? "setup_complete";
    default:
      return pick(["status_unknown"]) ?? "status_unknown";
  }
}

export function successStatusVariant(
  status: PlatformCustomerSuccessStatus,
): "success" | "warning" | "danger" | "info" | "muted" {
  switch (status) {
    case "healthy":
      return "success";
    case "attention":
      return "warning";
    case "critical":
      return "danger";
    case "incomplete":
      return "info";
    default:
      return "muted";
  }
}

export function filterCustomerSuccessCustomers(
  customers: PlatformCustomerSuccessCustomer[],
  input: {
    query?: string;
    status?: PlatformCustomerSuccessStatus | "all";
    agreementStatus?: string | "all";
    licenseStatus?: string | "all";
    serviceStatus?: string | "all";
    countryCode?: string | "all";
  },
): PlatformCustomerSuccessCustomer[] {
  const query = (input.query ?? "").trim().toLowerCase();
  const status = input.status ?? "all";
  const agreementStatus = (input.agreementStatus ?? "all").toLowerCase();
  const licenseStatus = (input.licenseStatus ?? "all").toLowerCase();
  const serviceStatus = (input.serviceStatus ?? "all").toLowerCase();
  const countryCode = (input.countryCode ?? "all").toUpperCase();

  return customers.filter((customer) => {
    if (status !== "all" && customer.successStatus !== status) return false;

    if (agreementStatus !== "all") {
      const value = (customer.agreement.status ?? "").toLowerCase();
      if (value !== agreementStatus) return false;
    }

    if (licenseStatus !== "all") {
      const value = (customer.license.primaryStatus ?? "").toLowerCase();
      if (value !== licenseStatus) return false;
    }

    if (serviceStatus !== "all") {
      const value = (customer.services.websiteKompisStatus ?? "").toLowerCase();
      if (value !== serviceStatus) return false;
    }

    if (countryCode !== "ALL") {
      const value = (customer.countryCode ?? "").toUpperCase();
      if (value !== countryCode) return false;
    }

    if (!query) return true;

    const haystack = [
      customer.companyName,
      customer.customerKey,
      customer.organizationNumber,
      customer.domains.primaryDomain,
      customer.countryCode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

/** Pure status priority helper for tests — mirrors RPC priority. */
export function deriveSuccessStatusFromReasons(
  codes: PlatformCustomerSuccessReasonCode[],
): PlatformCustomerSuccessStatus {
  if (codes.some((c) => CRITICAL_REASONS.includes(c))) return "critical";
  if (codes.some((c) => ATTENTION_REASONS.includes(c))) return "attention";
  if (codes.some((c) => INCOMPLETE_REASONS.includes(c))) return "incomplete";
  if (codes.includes("setup_complete")) return "healthy";
  return "unknown";
}
