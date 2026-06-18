export * from "./constants";

export type GrowthPartnerTrainingModule = {
  moduleKey: string;
  moduleTitle: string;
  status: string;
  sortOrder: number;
};

export type GrowthPartnerDashboard = {
  found: boolean;
  error?: string;
  fullName?: string;
  companyName?: string;
  email?: string;
  partnerStatus?: string;
  certificationStatus?: string;
  statusKey?: string;
  statusLabel?: string;
  trainingProgressPct?: number;
  trainingModules: GrowthPartnerTrainingModule[];
  commissionOverview?: {
    note?: string;
    activeCustomers?: number;
    pendingCommissions?: number;
    currency?: string;
  };
  leadsCount?: number;
  customersCount?: number;
  nextSteps: string[];
  academyRoute?: string;
  operationsRoute?: string;
  privacyNote?: string;
};

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : {};
}
function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}
function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function parseGrowthPartnerDashboard(raw: unknown): GrowthPartnerDashboard {
  const d = asRecord(raw);
  if (!d.found) {
    return { found: false, error: asString(d.error) || undefined, trainingModules: [], nextSteps: [] };
  }
  const commission = asRecord(d.commission_overview);
  const modules = Array.isArray(d.training_modules)
    ? d.training_modules.map((item) => {
        const m = asRecord(item);
        return {
          moduleKey: asString(m.module_key),
          moduleTitle: asString(m.module_title),
          status: asString(m.status, "not_started"),
          sortOrder: asNumber(m.sort_order),
        };
      })
    : [];
  return {
    found: true,
    fullName: asString(d.full_name) || undefined,
    companyName: asString(d.company_name) || undefined,
    email: asString(d.email) || undefined,
    partnerStatus: asString(d.partner_status) || undefined,
    certificationStatus: asString(d.certification_status) || undefined,
    statusKey: asString(d.status_key) || undefined,
    statusLabel: asString(d.status_label) || undefined,
    trainingProgressPct: asNumber(d.training_progress_pct),
    trainingModules: modules,
    commissionOverview: {
      note: asString(commission.note) || undefined,
      activeCustomers: asNumber(commission.active_customers),
      pendingCommissions: asNumber(commission.pending_commissions),
      currency: asString(commission.currency, "EUR"),
    },
    leadsCount: asNumber(d.leads_count),
    customersCount: asNumber(d.customers_count),
    nextSteps: Array.isArray(d.next_steps) ? d.next_steps.map((s) => asString(s)).filter(Boolean) : [],
    academyRoute: asString(d.academy_route) || undefined,
    operationsRoute: asString(d.operations_route) || undefined,
    privacyNote: asString(d.privacy_note) || undefined,
  };
}

export function parseGrowthPartnerSignupResult(raw: unknown): { ok: boolean; redirectPath?: string; error?: string } {
  const d = asRecord(raw);
  return {
    ok: d.ok === true,
    redirectPath: asString(d.redirect_path) || undefined,
    error: asString(d.error) || undefined,
  };
}
