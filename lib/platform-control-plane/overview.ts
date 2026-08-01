import { buildFreshness, resolveMetricDisplay, type PlatformDataFreshness } from "./freshness";

export type NullableCount = number | null;

export type PlatformControlPlaneOverview = {
  generatedAt: string;
  freshness: PlatformDataFreshness;
  customers: {
    organizationsTotal: NullableCount;
    activeSubscriptions: NullableCount;
    requiringAttention: NullableCount;
    openSupport: NullableCount;
  };
  finance: {
    paymentActive: NullableCount;
    paymentPastDue: NullableCount;
    paymentTrialing: NullableCount;
    outstandingInvoices: NullableCount;
    failedPayments: NullableCount;
    monthlyRecurringRevenue: NullableCount;
    sourceNote: string;
  };
  partners: {
    activePartners: NullableCount;
    earnedCommission: NullableCount;
    pendingPartnerInvoices: NullableCount;
    sourceNote: string;
  };
  operations: {
    systemHealth: "healthy" | "degraded" | "critical" | "unknown" | null;
    openIncidents: NullableCount;
    pendingApprovals: NullableCount;
    sourceNote: string;
  };
};

function asNullableNumber(value: unknown): NullableCount {
  if (value === null || value === undefined) return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "" && Number.isFinite(Number(value))) {
    return Number(value);
  }
  return null;
}

function asIso(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  const t = Date.parse(value);
  return Number.isFinite(t) ? new Date(t).toISOString() : null;
}

export function parsePlatformControlPlaneOverview(raw: unknown): PlatformControlPlaneOverview {
  const root = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const customers = (root.customers && typeof root.customers === "object"
    ? root.customers
    : {}) as Record<string, unknown>;
  const finance = (root.finance && typeof root.finance === "object"
    ? root.finance
    : {}) as Record<string, unknown>;
  const partners = (root.partners && typeof root.partners === "object"
    ? root.partners
    : {}) as Record<string, unknown>;
  const operations = (root.operations && typeof root.operations === "object"
    ? root.operations
    : {}) as Record<string, unknown>;

  const generatedAt =
    asIso(root.generated_at ?? root.generatedAt) ?? new Date(0).toISOString();

  const healthRaw = operations.system_health ?? operations.systemHealth;
  const systemHealth =
    healthRaw === "healthy" ||
    healthRaw === "degraded" ||
    healthRaw === "critical" ||
    healthRaw === "unknown"
      ? healthRaw
      : null;

  return {
    generatedAt,
    freshness: buildFreshness({
      source: String(root.source ?? "get_platform_control_plane_overview"),
      fetchedAt: generatedAt,
      calculatedAt: generatedAt,
      availability: "partial",
      partial: true,
    }),
    customers: {
      organizationsTotal: asNullableNumber(
        customers.organizations_total ?? customers.organizationsTotal,
      ),
      activeSubscriptions: asNullableNumber(
        customers.active_subscriptions ?? customers.activeSubscriptions,
      ),
      requiringAttention: asNullableNumber(
        customers.requiring_attention ?? customers.requiringAttention,
      ),
      openSupport: asNullableNumber(customers.open_support ?? customers.openSupport),
    },
    finance: {
      paymentActive: asNullableNumber(finance.payment_active ?? finance.paymentActive),
      paymentPastDue: asNullableNumber(finance.payment_past_due ?? finance.paymentPastDue),
      paymentTrialing: asNullableNumber(finance.payment_trialing ?? finance.paymentTrialing),
      outstandingInvoices: asNullableNumber(
        finance.outstanding_invoices ?? finance.outstandingInvoices,
      ),
      failedPayments: asNullableNumber(finance.failed_payments ?? finance.failedPayments),
      monthlyRecurringRevenue: asNullableNumber(
        finance.monthly_recurring_revenue ?? finance.monthlyRecurringRevenue,
      ),
      sourceNote: String(
        finance.source_note ??
          finance.sourceNote ??
          "subscription_status_only",
      ),
    },
    partners: {
      activePartners: asNullableNumber(partners.active_partners ?? partners.activePartners),
      earnedCommission: asNullableNumber(
        partners.earned_commission ?? partners.earnedCommission,
      ),
      pendingPartnerInvoices: asNullableNumber(
        partners.pending_partner_invoices ?? partners.pendingPartnerInvoices,
      ),
      sourceNote: String(partners.source_note ?? partners.sourceNote ?? "partial"),
    },
    operations: {
      systemHealth,
      openIncidents: asNullableNumber(operations.open_incidents ?? operations.openIncidents),
      pendingApprovals: asNullableNumber(
        operations.pending_approvals ?? operations.pendingApprovals,
      ),
      sourceNote: String(
        operations.source_note ?? operations.sourceNote ?? "no_fake_health",
      ),
    },
  };
}

export function formatControlPlaneMetric(
  value: NullableCount,
  labels: { noData: string; error: string },
  availability: PlatformDataFreshness["availability"] = "partial",
): string {
  const resolved = resolveMetricDisplay(value, value === null ? "unavailable" : availability);
  if (resolved.kind === "error") return labels.error;
  if (resolved.kind === "unavailable") return labels.noData;
  return String(resolved.value);
}
