import type {
  EconomyAgreement,
  EconomyCommission,
  EconomyInvoice,
  EconomyMilestone,
  EconomyOverview,
  EconomySale,
  EconomySettlement,
  EconomySettlementDetail,
} from "./types";

function str(v: unknown, fb = ""): string {
  return typeof v === "string" ? v : fb;
}

function num(v: unknown, fb = 0): number {
  return typeof v === "number" ? v : typeof v === "string" ? Number(v) || fb : fb;
}

function bool(v: unknown): boolean {
  return v === true;
}

export function parseEconomyOverview(data: unknown): EconomyOverview {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  const milestones = Array.isArray(d.milestones)
    ? d.milestones.map((m) => {
        const x = m as Record<string, unknown>;
        return {
          milestone_key: str(x.milestone_key),
          label: str(x.label),
          achieved: bool(x.achieved),
          achieved_at: str(x.achieved_at) || null,
        } satisfies EconomyMilestone;
      })
    : [];
  const parseSettlements = (raw: unknown): EconomySettlement[] =>
    Array.isArray(raw)
      ? raw.map((s) => {
          const x = s as Record<string, unknown>;
          return {
            id: str(x.id),
            settlement_key: str(x.settlement_key) || undefined,
            settlement_period: str(x.settlement_period),
            total_payable: num(x.total_payable),
            settlement_status: str(x.settlement_status),
            created_at: str(x.created_at) || undefined,
          };
        })
      : [];
  const agreements = Array.isArray(d.agreements)
    ? d.agreements.map((a) => {
        const x = a as Record<string, unknown>;
        return {
          agreement_type: str(x.agreement_type),
          accepted: bool(x.accepted),
          accepted_at: str(x.accepted_at) || null,
        } satisfies EconomyAgreement;
      })
    : [];

  return {
    found: d.found === true,
    principle: str(d.principle),
    no_company: bool(d.no_company),
    can_earn_commissions: bool(d.can_earn_commissions),
    verification_status: str(d.verification_status),
    company_name: str(d.company_name),
    approved_sales_count: num(d.approved_sales_count),
    current_commission_tier_pct: num(d.current_commission_tier_pct),
    pending_commission_total: num(d.pending_commission_total),
    milestones,
    pending_settlements: parseSettlements(d.pending_settlements),
    recent_settlements: parseSettlements(d.recent_settlements),
    agreements,
  };
}

export function parseEconomySales(data: unknown): EconomySale[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.sales)) return [];
  return d.sales.map((s) => {
    const x = s as Record<string, unknown>;
    return {
      id: str(x.id),
      sale_key: str(x.sale_key),
      customer_label: str(x.customer_label),
      plan_key: str(x.plan_key),
      sale_amount: num(x.sale_amount),
      sale_status: str(x.sale_status),
      is_enterprise: bool(x.is_enterprise),
      created_at: str(x.created_at) || undefined,
    };
  });
}

export function parseEconomyCommissions(data: unknown): EconomyCommission[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.commissions)) return [];
  return d.commissions.map((c) => {
    const x = c as Record<string, unknown>;
    return {
      id: str(x.id),
      customer_label: str(x.customer_label),
      commission_rate_pct: num(x.commission_rate_pct),
      commission_basis: num(x.commission_basis),
      commission_amount: num(x.commission_amount),
      commission_status: str(x.commission_status),
      created_at: str(x.created_at) || undefined,
    };
  });
}

export function parseEconomyInvoices(data: unknown): EconomyInvoice[] {
  if (!data || typeof data !== "object") return [];
  const d = data as Record<string, unknown>;
  if (!Array.isArray(d.invoices)) return [];
  return d.invoices.map((i) => {
    const x = i as Record<string, unknown>;
    return {
      id: str(x.id),
      invoice_number: str(x.invoice_number),
      issue_date: str(x.issue_date),
      settlement_period: str(x.settlement_period),
      total_amount: num(x.total_amount),
      invoice_status: str(x.invoice_status),
      finalized_at: str(x.finalized_at) || null,
    };
  });
}

export function parseEconomySettlementDetail(data: unknown): EconomySettlementDetail {
  if (!data || typeof data !== "object") return { found: false, id: "", settlement_period: "", total_payable: 0, settlement_status: "" };
  const d = data as Record<string, unknown>;
  const commissions = Array.isArray(d.commissions)
    ? d.commissions.map((c) => {
        const x = c as Record<string, unknown>;
        return { customer_label: str(x.customer_label), commission_amount: num(x.commission_amount) };
      })
    : [];
  return {
    found: d.found === true,
    id: str(d.id),
    settlement_key: str(d.settlement_key) || undefined,
    settlement_period: str(d.settlement_period),
    period_from: str(d.period_from) || undefined,
    period_to: str(d.period_to) || undefined,
    commission_total: num(d.commission_total),
    bonus_total: num(d.bonus_total),
    vat_amount: num(d.vat_amount),
    total_payable: num(d.total_payable),
    settlement_status: str(d.settlement_status),
    approval_statement: str(d.approval_statement),
    commissions,
  };
}

export function parseEconomyActionResult(data: unknown): { found: boolean; message?: string; settlement_id?: string; invoice_number?: string } {
  if (!data || typeof data !== "object") return { found: false };
  const d = data as Record<string, unknown>;
  return {
    found: d.found === true,
    message: str(d.message) || undefined,
    settlement_id: str(d.settlement_id) || undefined,
    invoice_number: str(d.invoice_number) || undefined,
  };
}
