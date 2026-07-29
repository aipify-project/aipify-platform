/**
 * Platform Licenses Overview V1 — types, parser, filters.
 * Read-only portal contract. Masked license keys only.
 */

export const PLATFORM_LICENSE_STATUSES = [
  "active",
  "pending",
  "suspended",
  "expired",
  "cancelled",
  "canceled",
  "revoked",
  "failed",
  "unknown",
] as const;

export type PlatformLicenseStatus = (typeof PLATFORM_LICENSE_STATUSES)[number];

export const PLATFORM_LICENSE_PROVISIONING_STATUSES = [
  "requires_domain",
  "requires_installation",
  "ready_for_activation",
  "active",
  "provisioned",
  "failed",
  "suspended",
  "unknown",
] as const;

export type PlatformLicenseProvisioningStatus =
  (typeof PLATFORM_LICENSE_PROVISIONING_STATUSES)[number];

export type PlatformLicensesMetrics = {
  totalLicenses: number;
  activeLicenses: number;
  pendingLicenses: number;
  attentionLicenses: number;
  readyForActivationLicenses: number;
  activeSetupLicenses: number;
};

export type PlatformLicenseAgreementSummary = {
  status: string | null;
  duration: string | null;
  name: string | null;
};

export type PlatformLicenseDomainSummary = {
  hostname: string | null;
  status: string | null;
  verified: boolean | null;
};

export type PlatformLicenseInstallationSummary = {
  id: string | null;
  installId: string | null;
  status: string | null;
};

export type PlatformLicenseServicesSummary = {
  activeCount: number;
  websiteKompisStatus: string | null;
};

export type PlatformLicenseRow = {
  licenseId: string;
  customerId: string;
  companyId: string | null;
  customerKey: string;
  companyName: string;
  registrationNumber: string | null;
  countryCode: string | null;
  licenseProductCode: string;
  licenseStatus: PlatformLicenseStatus;
  rawLicenseStatus: string | null;
  provisioningStatus: PlatformLicenseProvisioningStatus;
  rawProvisioningStatus: string | null;
  maskedLicenseKey: string | null;
  agreement: PlatformLicenseAgreementSummary;
  domain: PlatformLicenseDomainSummary;
  installation: PlatformLicenseInstallationSummary;
  services: PlatformLicenseServicesSummary;
  createdAt: string | null;
  activatedAt: string | null;
  expiresAt: string | null;
};

export type PlatformLicensesOverview = {
  generatedAt: string;
  metrics: PlatformLicensesMetrics;
  licenses: PlatformLicenseRow[];
};

export type PlatformLicensesLabels = {
  title: string;
  subtitle: string;
  lastChecked: string;
  searchPlaceholder: string;
  filterAll: string;
  filterActive: string;
  filterPending: string;
  filterSuspended: string;
  filterExpired: string;
  filterEnded: string;
  filterRevoked: string;
  filterUnknown: string;
  filterProvisioningAll: string;
  filterRequiresDomain: string;
  filterRequiresInstallation: string;
  filterReady: string;
  filterActiveSetup: string;
  filterFailedSetup: string;
  filterUnknownSetup: string;
  filterProductAll: string;
  filterCountry: string;
  filterWebsiteKompis: string;
  kpiTotal: string;
  kpiActive: string;
  kpiPending: string;
  kpiAttention: string;
  kpiReady: string;
  kpiActiveSetup: string;
  columnCustomer: string;
  columnProduct: string;
  columnLicenseStatus: string;
  columnProvisioning: string;
  columnAgreement: string;
  columnDomain: string;
  columnInstallation: string;
  columnServices: string;
  columnLicenseKey: string;
  columnFollowUp: string;
  verified: string;
  notVerified: string;
  installationId: string;
  installationKey: string;
  openCustomer: string;
  notAvailable: string;
  emptyTitle: string;
  emptyDescription: string;
  filteredEmptyTitle: string;
  filteredEmptyDescription: string;
  errorTitle: string;
  errorDescription: string;
  retry: string;
  clearFilters: string;
  unknownStatus: string;
  unknownProduct: string;
  unknownProvisioning: string;
  productCodeLabel: string;
  licenseStatuses: Record<string, string>;
  provisioningStatuses: Record<string, string>;
  agreementStatuses: Record<string, string>;
  durationLabels: Record<string, string>;
  productNames: Record<string, string>;
  serviceStatuses: Record<string, string>;
  unonightPilotAgreement: string;
  unonightUnlimitedAgreement: string;
  lifetimeAgreement: string;
  websiteKompis: string;
  servicesCount: string;
};

const STATUS_SET = new Set<string>(PLATFORM_LICENSE_STATUSES);
const PROV_SET = new Set<string>(PLATFORM_LICENSE_PROVISIONING_STATUSES);

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

function asIsoDate(value: unknown): string | null {
  const raw = asNullableTrimmedString(value);
  if (!raw) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return `${raw}T00:00:00.000Z`;
  const ms = Date.parse(raw);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString();
}

function asNullableBoolean(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (value == null) return null;
  if (value === "true" || value === "t" || value === 1) return true;
  if (value === "false" || value === "f" || value === 0) return false;
  return null;
}

export function normalizeLicenseStatus(value: unknown): PlatformLicenseStatus {
  const raw = asNullableTrimmedString(value)?.toLowerCase();
  if (!raw) return "unknown";
  if (raw === "canceled") return "cancelled";
  if (STATUS_SET.has(raw)) return raw as PlatformLicenseStatus;
  return "unknown";
}

export function normalizeProvisioningStatus(
  value: unknown,
): PlatformLicenseProvisioningStatus {
  const raw = asNullableTrimmedString(value)?.toLowerCase();
  if (!raw) return "unknown";
  if (raw === "provisioned") return "active";
  if (PROV_SET.has(raw)) return raw as PlatformLicenseProvisioningStatus;
  return "unknown";
}

export function licenseStatusVariant(
  status: PlatformLicenseStatus,
): "success" | "warning" | "danger" | "muted" | "info" {
  switch (status) {
    case "active":
      return "success";
    case "pending":
      return "warning";
    case "suspended":
    case "revoked":
    case "failed":
      return "danger";
    case "expired":
    case "cancelled":
    case "canceled":
      return "muted";
    default:
      return "info";
  }
}

export function provisioningStatusVariant(
  status: PlatformLicenseProvisioningStatus,
): "success" | "warning" | "danger" | "muted" | "info" {
  switch (status) {
    case "active":
    case "provisioned":
      return "success";
    case "ready_for_activation":
    case "requires_domain":
    case "requires_installation":
      return "warning";
    case "failed":
    case "suspended":
      return "danger";
    default:
      return "muted";
  }
}

export function isAttentionLicense(row: PlatformLicenseRow): boolean {
  if (["suspended", "revoked", "expired"].includes(row.licenseStatus)) return true;
  return ["failed", "requires_domain", "requires_installation"].includes(
    row.provisioningStatus,
  );
}

function emptyMetrics(): PlatformLicensesMetrics {
  return {
    totalLicenses: 0,
    activeLicenses: 0,
    pendingLicenses: 0,
    attentionLicenses: 0,
    readyForActivationLicenses: 0,
    activeSetupLicenses: 0,
  };
}

function parseMetrics(raw: unknown): PlatformLicensesMetrics {
  const row = asRecord(raw);
  if (!row) return emptyMetrics();
  return {
    totalLicenses: asNonNegativeCount(row.total_licenses ?? row.totalLicenses),
    activeLicenses: asNonNegativeCount(row.active_licenses ?? row.activeLicenses),
    pendingLicenses: asNonNegativeCount(row.pending_licenses ?? row.pendingLicenses),
    attentionLicenses: asNonNegativeCount(
      row.attention_licenses ?? row.attentionLicenses,
    ),
    readyForActivationLicenses: asNonNegativeCount(
      row.ready_for_activation_licenses ?? row.readyForActivationLicenses,
    ),
    activeSetupLicenses: asNonNegativeCount(
      row.active_setup_licenses ?? row.activeSetupLicenses,
    ),
  };
}

function computeMetricsFromRows(licenses: PlatformLicenseRow[]): PlatformLicensesMetrics {
  return {
    totalLicenses: licenses.length,
    activeLicenses: licenses.filter((l) => l.licenseStatus === "active").length,
    pendingLicenses: licenses.filter((l) => l.licenseStatus === "pending").length,
    attentionLicenses: licenses.filter((l) => isAttentionLicense(l)).length,
    readyForActivationLicenses: licenses.filter(
      (l) => l.provisioningStatus === "ready_for_activation",
    ).length,
    activeSetupLicenses: licenses.filter(
      (l) => l.provisioningStatus === "active" || l.provisioningStatus === "provisioned",
    ).length,
  };
}

function parseLicense(raw: unknown): PlatformLicenseRow | null {
  const row = asRecord(raw);
  if (!row) return null;

  const licenseId = asNullableTrimmedString(row.license_id ?? row.licenseId);
  const customerId = asNullableTrimmedString(row.customer_id ?? row.customerId);
  if (!licenseId || !customerId) return null;

  const agreement = asRecord(row.agreement) ?? {};
  const domain = asRecord(row.domain) ?? {};
  const installation = asRecord(row.installation) ?? {};
  const services = asRecord(row.services) ?? {};

  const rawStatus = asNullableTrimmedString(row.license_status ?? row.licenseStatus);
  const rawProv = asNullableTrimmedString(
    row.provisioning_status ?? row.provisioningStatus,
  );

  return {
    licenseId,
    customerId,
    companyId: asNullableTrimmedString(row.company_id ?? row.companyId),
    customerKey:
      asNullableTrimmedString(row.customer_key ?? row.customerKey) ?? customerId,
    companyName:
      asNullableTrimmedString(row.company_name ?? row.companyName) ?? "Customer",
    registrationNumber: asNullableTrimmedString(
      row.registration_number ?? row.registrationNumber,
    ),
    countryCode: asNullableTrimmedString(row.country_code ?? row.countryCode),
    licenseProductCode:
      asNullableTrimmedString(row.license_product_code ?? row.licenseProductCode) ??
      "unknown",
    licenseStatus: normalizeLicenseStatus(rawStatus),
    rawLicenseStatus: rawStatus,
    provisioningStatus: normalizeProvisioningStatus(rawProv),
    rawProvisioningStatus: rawProv,
    maskedLicenseKey: asNullableTrimmedString(
      row.masked_license_key ?? row.maskedLicenseKey ?? row.masked_license_code,
    ),
    agreement: {
      status: asNullableTrimmedString(agreement.status),
      duration: asNullableTrimmedString(agreement.duration),
      name: asNullableTrimmedString(agreement.name),
    },
    domain: {
      hostname: asNullableTrimmedString(domain.hostname ?? domain.domain),
      status: asNullableTrimmedString(domain.status),
      verified: asNullableBoolean(domain.verified),
    },
    installation: {
      id: asNullableTrimmedString(installation.id),
      installId: asNullableTrimmedString(installation.install_id ?? installation.installId),
      status: asNullableTrimmedString(installation.status),
    },
    services: {
      activeCount: asNonNegativeCount(services.active_count ?? services.activeCount),
      websiteKompisStatus: asNullableTrimmedString(
        services.website_kompis_status ?? services.websiteKompisStatus,
      ),
    },
    createdAt: asIsoDate(row.created_at ?? row.createdAt),
    activatedAt: asIsoDate(row.activated_at ?? row.activatedAt),
    expiresAt: asIsoDate(row.expires_at ?? row.expiresAt),
  };
}

export function parsePlatformLicensesOverview(value: unknown): PlatformLicensesOverview {
  const root = asRecord(value);
  const licensesRaw = root?.licenses;
  const licenses = Array.isArray(licensesRaw)
    ? licensesRaw
        .map(parseLicense)
        .filter((item): item is PlatformLicenseRow => item !== null)
    : [];

  const generatedAt =
    asIsoDate(root?.generated_at ?? root?.generatedAt) ?? new Date(0).toISOString();

  let metrics = parseMetrics(root?.metrics);
  if (metrics.totalLicenses === 0 && licenses.length > 0) {
    metrics = computeMetricsFromRows(licenses);
  }

  return { generatedAt, metrics, licenses };
}

export type PlatformLicensesStatusFilter =
  | "all"
  | "active"
  | "pending"
  | "suspended"
  | "expired"
  | "ended"
  | "revoked"
  | "unknown";

export type PlatformLicensesProvisioningFilter =
  | "all"
  | "requires_domain"
  | "requires_installation"
  | "ready_for_activation"
  | "active"
  | "failed"
  | "unknown";

export function filterPlatformLicenses(
  licenses: PlatformLicenseRow[],
  input: {
    query?: string;
    status?: PlatformLicensesStatusFilter;
    provisioning?: PlatformLicensesProvisioningFilter;
    productCode?: string | "all";
    countryCode?: string | "all";
    websiteKompis?: string | "all";
  },
): PlatformLicenseRow[] {
  const query = (input.query ?? "").trim().toLowerCase();
  const status = input.status ?? "all";
  const provisioning = input.provisioning ?? "all";
  const productCode = (input.productCode ?? "all").toLowerCase();
  const countryCode = (input.countryCode ?? "all").toUpperCase();
  const websiteKompis = (input.websiteKompis ?? "all").toLowerCase();

  return licenses.filter((license) => {
    if (status === "active" && license.licenseStatus !== "active") return false;
    if (status === "pending" && license.licenseStatus !== "pending") return false;
    if (status === "suspended" && license.licenseStatus !== "suspended") return false;
    if (status === "expired" && license.licenseStatus !== "expired") return false;
    if (
      status === "ended" &&
      license.licenseStatus !== "cancelled" &&
      license.licenseStatus !== "canceled"
    ) {
      return false;
    }
    if (status === "revoked" && license.licenseStatus !== "revoked") return false;
    if (status === "unknown" && license.licenseStatus !== "unknown") return false;

    if (provisioning !== "all") {
      if (provisioning === "active") {
        if (
          license.provisioningStatus !== "active" &&
          license.provisioningStatus !== "provisioned"
        ) {
          return false;
        }
      } else if (license.provisioningStatus !== provisioning) {
        return false;
      }
    }

    if (productCode !== "all") {
      if (license.licenseProductCode.toLowerCase() !== productCode) return false;
    }

    if (countryCode !== "ALL") {
      if ((license.countryCode ?? "").toUpperCase() !== countryCode) return false;
    }

    if (websiteKompis !== "all") {
      if ((license.services.websiteKompisStatus ?? "").toLowerCase() !== websiteKompis) {
        return false;
      }
    }

    if (!query) return true;

    const haystack = [
      license.companyName,
      license.customerKey,
      license.registrationNumber,
      license.licenseProductCode,
      license.domain.hostname,
      license.maskedLicenseKey,
      license.agreement.name,
      license.countryCode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

/** Reject accidental full-key exposure in parsed payloads. */
export function looksLikeFullLicenseKey(value: string | null | undefined): boolean {
  const raw = (value ?? "").trim();
  if (!raw) return false;
  if (raw.includes("*")) return false;
  return /^AIP-[A-Z0-9-]{16,}$/i.test(raw);
}
