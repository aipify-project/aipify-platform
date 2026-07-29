/**
 * Customer Agreements Overview V1 — types, parser, filters.
 * Read-only portal contract. No invented revenue or renewal dates.
 */

export const PLATFORM_AGREEMENT_STATUSES = [
  "active",
  "trialing",
  "pending",
  "past_due",
  "paused",
  "suspended",
  "cancelled",
  "canceled",
  "expired",
  "unpaid",
  "unknown",
] as const;

export type PlatformAgreementStatus = (typeof PLATFORM_AGREEMENT_STATUSES)[number];

export const PLATFORM_AGREEMENT_DURATIONS = [
  "monthly",
  "yearly",
  "lifetime",
  "unknown",
] as const;

export type PlatformAgreementDuration = (typeof PLATFORM_AGREEMENT_DURATIONS)[number];

export type PlatformCustomerAgreementsMetrics = {
  totalAgreements: number;
  activeAgreements: number;
  trialAgreements: number;
  attentionAgreements: number;
  endedAgreements: number;
  unlimitedAgreements: number;
};

export type PlatformCustomerAgreement = {
  agreementId: string;
  customerId: string;
  companyId: string | null;
  customerKey: string;
  companyName: string;
  registrationNumber: string | null;
  countryCode: string | null;
  agreementName: string;
  planKey: string | null;
  planType: string | null;
  agreementStatus: PlatformAgreementStatus;
  rawAgreementStatus: string | null;
  duration: PlatformAgreementDuration;
  rawDuration: string | null;
  isCurrent: boolean;
  startedAt: string | null;
  endsAt: string | null;
  trialStartsAt: string | null;
  trialEndsAt: string | null;
  renewsAt: string | null;
  pausedAt: string | null;
  cancelledAt: string | null;
  currency: string | null;
  amount: number | null;
  billingInterval: string | null;
};

export type PlatformCustomerAgreementsOverview = {
  generatedAt: string;
  metrics: PlatformCustomerAgreementsMetrics;
  agreements: PlatformCustomerAgreement[];
};

export type PlatformCustomerAgreementsLabels = {
  title: string;
  subtitle: string;
  lastChecked: string;
  searchPlaceholder: string;
  filterAll: string;
  filterActive: string;
  filterTrial: string;
  filterAttention: string;
  filterEnded: string;
  filterExpired: string;
  filterUnknown: string;
  filterDurationAll: string;
  filterDurationMonthly: string;
  filterDurationYearly: string;
  filterDurationUnlimited: string;
  filterCountry: string;
  kpiTotal: string;
  kpiActive: string;
  kpiTrial: string;
  kpiAttention: string;
  kpiEnded: string;
  kpiUnlimited: string;
  columnCustomer: string;
  columnAgreement: string;
  columnStatus: string;
  columnDuration: string;
  columnPeriod: string;
  columnRenewal: string;
  columnAmount: string;
  columnFollowUp: string;
  startDate: string;
  endDate: string;
  noEndDate: string;
  noTrial: string;
  currentAgreement: string;
  historicalAgreement: string;
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
  agreementStatuses: Record<string, string>;
  durationLabels: Record<string, string>;
  unonightPilotAgreement: string;
  unonightUnlimitedAgreement: string;
  lifetimeAgreement: string;
};

const STATUS_SET = new Set<string>(PLATFORM_AGREEMENT_STATUSES);
const DURATION_SET = new Set<string>(PLATFORM_AGREEMENT_DURATIONS);

const ATTENTION_STATUSES = new Set([
  "pending",
  "past_due",
  "unpaid",
  "paused",
  "suspended",
]);

const ENDED_STATUSES = new Set(["cancelled", "canceled", "expired"]);

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
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return `${raw}T00:00:00.000Z`;
  }
  const ms = Date.parse(raw);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString();
}

function asNullableAmount(value: unknown): number | null {
  if (value == null || value === "") return null;
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

export function normalizeAgreementStatus(value: unknown): PlatformAgreementStatus {
  const raw = asNullableTrimmedString(value)?.toLowerCase();
  if (!raw) return "unknown";
  if (raw === "canceled") return "cancelled";
  if (STATUS_SET.has(raw)) return raw as PlatformAgreementStatus;
  return "unknown";
}

export function normalizeAgreementDuration(value: unknown): PlatformAgreementDuration {
  const raw = asNullableTrimmedString(value)?.toLowerCase();
  if (!raw) return "unknown";
  if (raw === "annual") return "yearly";
  if (DURATION_SET.has(raw)) return raw as PlatformAgreementDuration;
  return "unknown";
}

export function agreementStatusVariant(
  status: PlatformAgreementStatus,
): "success" | "warning" | "danger" | "muted" | "info" {
  switch (status) {
    case "active":
      return "success";
    case "trialing":
    case "pending":
    case "paused":
      return "warning";
    case "past_due":
    case "unpaid":
    case "suspended":
      return "danger";
    case "cancelled":
    case "canceled":
    case "expired":
      return "muted";
    default:
      return "info";
  }
}

export function isAttentionAgreementStatus(status: PlatformAgreementStatus): boolean {
  return ATTENTION_STATUSES.has(status);
}

export function isEndedAgreementStatus(status: PlatformAgreementStatus): boolean {
  return ENDED_STATUSES.has(status);
}

function emptyMetrics(): PlatformCustomerAgreementsMetrics {
  return {
    totalAgreements: 0,
    activeAgreements: 0,
    trialAgreements: 0,
    attentionAgreements: 0,
    endedAgreements: 0,
    unlimitedAgreements: 0,
  };
}

function parseMetrics(raw: unknown): PlatformCustomerAgreementsMetrics {
  const row = asRecord(raw);
  if (!row) return emptyMetrics();
  return {
    totalAgreements: asNonNegativeCount(row.total_agreements ?? row.totalAgreements),
    activeAgreements: asNonNegativeCount(row.active_agreements ?? row.activeAgreements),
    trialAgreements: asNonNegativeCount(row.trial_agreements ?? row.trialAgreements),
    attentionAgreements: asNonNegativeCount(
      row.attention_agreements ?? row.attentionAgreements,
    ),
    endedAgreements: asNonNegativeCount(row.ended_agreements ?? row.endedAgreements),
    unlimitedAgreements: asNonNegativeCount(
      row.unlimited_agreements ?? row.unlimitedAgreements,
    ),
  };
}

function computeMetricsFromRows(
  agreements: PlatformCustomerAgreement[],
): PlatformCustomerAgreementsMetrics {
  return {
    totalAgreements: agreements.length,
    activeAgreements: agreements.filter((a) => a.agreementStatus === "active").length,
    trialAgreements: agreements.filter((a) => a.agreementStatus === "trialing").length,
    attentionAgreements: agreements.filter((a) =>
      isAttentionAgreementStatus(a.agreementStatus),
    ).length,
    endedAgreements: agreements.filter((a) => isEndedAgreementStatus(a.agreementStatus))
      .length,
    unlimitedAgreements: agreements.filter((a) => a.duration === "lifetime").length,
  };
}

function parseAgreement(raw: unknown): PlatformCustomerAgreement | null {
  const row = asRecord(raw);
  if (!row) return null;

  const agreementId = asNullableTrimmedString(row.agreement_id ?? row.agreementId);
  const customerId = asNullableTrimmedString(row.customer_id ?? row.customerId);
  if (!agreementId || !customerId) return null;

  const companyName =
    asNullableTrimmedString(row.company_name ?? row.companyName) ?? "Customer";
  const customerKey =
    asNullableTrimmedString(row.customer_key ?? row.customerKey) ?? customerId;
  const rawStatus = asNullableTrimmedString(
    row.agreement_status ?? row.agreementStatus,
  );
  const rawDuration = asNullableTrimmedString(row.duration);

  return {
    agreementId,
    customerId,
    companyId: asNullableTrimmedString(row.company_id ?? row.companyId),
    customerKey,
    companyName,
    registrationNumber: asNullableTrimmedString(
      row.registration_number ?? row.registrationNumber ?? row.organization_number,
    ),
    countryCode: asNullableTrimmedString(row.country_code ?? row.countryCode),
    agreementName:
      asNullableTrimmedString(row.agreement_name ?? row.agreementName) ?? companyName,
    planKey: asNullableTrimmedString(row.plan_key ?? row.planKey),
    planType: asNullableTrimmedString(row.plan_type ?? row.planType),
    agreementStatus: normalizeAgreementStatus(rawStatus),
    rawAgreementStatus: rawStatus,
    duration: normalizeAgreementDuration(rawDuration),
    rawDuration,
    isCurrent: row.is_current === true || row.isCurrent === true || row.is_current == null,
    startedAt: asIsoDate(row.started_at ?? row.startedAt),
    endsAt: asIsoDate(row.ends_at ?? row.endsAt),
    trialStartsAt: asIsoDate(row.trial_starts_at ?? row.trialStartsAt),
    trialEndsAt: asIsoDate(row.trial_ends_at ?? row.trialEndsAt),
    renewsAt: asIsoDate(row.renews_at ?? row.renewsAt),
    pausedAt: asIsoDate(row.paused_at ?? row.pausedAt),
    cancelledAt: asIsoDate(row.cancelled_at ?? row.cancelledAt),
    currency: asNullableTrimmedString(row.currency)?.toUpperCase() ?? null,
    amount: asNullableAmount(row.amount),
    billingInterval: asNullableTrimmedString(row.billing_interval ?? row.billingInterval),
  };
}

export function parsePlatformCustomerAgreementsOverview(
  value: unknown,
): PlatformCustomerAgreementsOverview {
  const root = asRecord(value);
  const agreementsRaw = root?.agreements;
  const agreements = Array.isArray(agreementsRaw)
    ? agreementsRaw
        .map(parseAgreement)
        .filter((item): item is PlatformCustomerAgreement => item !== null)
    : [];

  const generatedAt =
    asIsoDate(root?.generated_at ?? root?.generatedAt) ?? new Date(0).toISOString();

  let metrics = parseMetrics(root?.metrics);
  if (metrics.totalAgreements === 0 && agreements.length > 0) {
    metrics = computeMetricsFromRows(agreements);
  }

  return {
    generatedAt,
    metrics,
    agreements,
  };
}

export type PlatformCustomerAgreementsStatusFilter =
  | "all"
  | "active"
  | "trialing"
  | "attention"
  | "ended"
  | "expired"
  | "unknown";

export type PlatformCustomerAgreementsDurationFilter =
  | "all"
  | "monthly"
  | "yearly"
  | "lifetime";

export function filterCustomerAgreements(
  agreements: PlatformCustomerAgreement[],
  input: {
    query?: string;
    status?: PlatformCustomerAgreementsStatusFilter;
    duration?: PlatformCustomerAgreementsDurationFilter;
    countryCode?: string | "all";
  },
): PlatformCustomerAgreement[] {
  const query = (input.query ?? "").trim().toLowerCase();
  const status = input.status ?? "all";
  const duration = input.duration ?? "all";
  const countryCode = (input.countryCode ?? "all").toUpperCase();

  return agreements.filter((agreement) => {
    if (status === "active" && agreement.agreementStatus !== "active") return false;
    if (status === "trialing" && agreement.agreementStatus !== "trialing") return false;
    if (status === "attention" && !isAttentionAgreementStatus(agreement.agreementStatus)) {
      return false;
    }
    if (status === "ended" && !isEndedAgreementStatus(agreement.agreementStatus)) {
      return false;
    }
    if (status === "expired" && agreement.agreementStatus !== "expired") return false;
    if (status === "unknown" && agreement.agreementStatus !== "unknown") return false;

    if (duration !== "all" && agreement.duration !== duration) return false;

    if (countryCode !== "ALL") {
      const value = (agreement.countryCode ?? "").toUpperCase();
      if (value !== countryCode) return false;
    }

    if (!query) return true;

    const haystack = [
      agreement.companyName,
      agreement.customerKey,
      agreement.registrationNumber,
      agreement.agreementName,
      agreement.planKey,
      agreement.countryCode,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(query);
  });
}

export function formatAgreementAmount(
  amount: number | null,
  currency: string | null,
  locale: string,
): string | null {
  if (amount == null || amount < 0 || !currency) return null;
  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency}`;
  }
}
