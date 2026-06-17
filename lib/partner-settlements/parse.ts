import type {
  PartnerSettlementDetail,
  PartnerSettlementsHistory,
  PartnerSettlementsOverview,
} from "./types";

function asRecord(data: unknown): Record<string, unknown> {
  return data && typeof data === "object" ? (data as Record<string, unknown>) : {};
}

function asArray<T>(data: unknown): T[] {
  return Array.isArray(data) ? (data as T[]) : [];
}

export function parsePartnerSettlementsOverview(data: unknown): PartnerSettlementsOverview | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const agreement = asRecord(d.self_billing_agreement);
  return {
    has_access: true,
    positioning: String(d.positioning ?? ""),
    self_billing_agreement: {
      accepted: Boolean(agreement.accepted),
      accepted_at: String(agreement.accepted_at ?? ""),
      version: String(agreement.version ?? "1.0"),
    },
    current_period: String(d.current_period ?? ""),
    has_payable_settlement: Boolean(d.has_payable_settlement),
    no_payable_message: d.no_payable_message ? String(d.no_payable_message) : null,
    current_settlement_id: d.current_settlement_id ? String(d.current_settlement_id) : null,
    pending_total: Number(d.pending_total ?? 0),
    history: asArray<unknown>(d.history).map((row) => {
      const h = asRecord(row);
      return {
        id: String(h.id ?? ""),
        settlement_period: String(h.settlement_period ?? ""),
        total_payable: Number(h.total_payable ?? 0),
        settlement_status: String(h.settlement_status ?? ""),
        created_at: String(h.created_at ?? ""),
      };
    }),
    approval_text: String(d.approval_text ?? ""),
  };
}

export function parsePartnerSettlementDetail(data: unknown): PartnerSettlementDetail | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  const settlement = d.settlement ? asRecord(d.settlement) : null;
  return {
    has_access: true,
    has_payable_settlement: Boolean(d.has_payable_settlement),
    message: d.message ? String(d.message) : undefined,
    settlement_period: d.settlement_period ? String(d.settlement_period) : undefined,
    settlement: settlement
      ? {
          id: String(settlement.id ?? ""),
          settlement_key: String(settlement.settlement_key ?? ""),
          settlement_period: String(settlement.settlement_period ?? ""),
          period_from: String(settlement.period_from ?? ""),
          period_to: String(settlement.period_to ?? ""),
          commission_total: Number(settlement.commission_total ?? 0),
          vat_rate_pct: Number(settlement.vat_rate_pct ?? 0),
          vat_amount: Number(settlement.vat_amount ?? 0),
          total_payable: Number(settlement.total_payable ?? 0),
          settlement_status: String(settlement.settlement_status ?? ""),
          due_date: String(settlement.due_date ?? ""),
          payment_terms: String(settlement.payment_terms ?? ""),
          partner_approved_at: String(settlement.partner_approved_at ?? ""),
          approval_statement: String(settlement.approval_statement ?? ""),
        }
      : undefined,
    seller: d.seller ? (asRecord(d.seller) as Record<string, string>) : undefined,
    buyer: d.buyer ? (asRecord(d.buyer) as Record<string, string>) : undefined,
    items: asArray<unknown>(d.items).map((row) => {
      const i = asRecord(row);
      return {
        sale_reference: String(i.sale_reference ?? ""),
        customer_name: String(i.customer_name ?? ""),
        package_label: String(i.package_label ?? ""),
        sale_value: Number(i.sale_value ?? 0),
        commission_rate_pct: Number(i.commission_rate_pct ?? 0),
        commission_amount: Number(i.commission_amount ?? 0),
        line_description: String(i.line_description ?? ""),
      };
    }),
    invoice: d.invoice
      ? (() => {
          const inv = asRecord(d.invoice);
          return {
            id: String(inv.id ?? ""),
            invoice_number: String(inv.invoice_number ?? ""),
            invoice_date: String(inv.invoice_date ?? ""),
            due_date: String(inv.due_date ?? ""),
            total_payable: Number(inv.total_payable ?? 0),
            invoice_status: String(inv.invoice_status ?? ""),
            immutable: Boolean(inv.immutable),
            accounting_payload: asRecord(inv.accounting_payload),
          };
        })()
      : null,
    approval_text: String(d.approval_text ?? ""),
  };
}

export function parsePartnerSettlementsHistory(data: unknown): PartnerSettlementsHistory | null {
  const d = asRecord(data);
  if (!d.has_access) return null;
  return {
    has_access: true,
    settlements: asArray<unknown>(d.settlements).map((row) => {
      const s = asRecord(row);
      return {
        id: String(s.id ?? ""),
        settlement_key: String(s.settlement_key ?? ""),
        settlement_period: String(s.settlement_period ?? ""),
        commission_total: Number(s.commission_total ?? 0),
        total_payable: Number(s.total_payable ?? 0),
        settlement_status: String(s.settlement_status ?? ""),
        partner_approved_at: String(s.partner_approved_at ?? ""),
        created_at: String(s.created_at ?? ""),
        invoice_number: String(s.invoice_number ?? ""),
      };
    }),
    invoices: asArray<unknown>(d.invoices).map((row) => {
      const i = asRecord(row);
      return {
        id: String(i.id ?? ""),
        invoice_number: String(i.invoice_number ?? ""),
        settlement_period: String(i.settlement_period ?? ""),
        total_payable: Number(i.total_payable ?? 0),
        invoice_status: String(i.invoice_status ?? ""),
        immutable: Boolean(i.immutable),
        invoice_date: String(i.invoice_date ?? ""),
        paid_at: String(i.paid_at ?? ""),
      };
    }),
  };
}
