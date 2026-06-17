export type PartnerSettlementsOverview = {
  has_access: boolean;
  positioning: string;
  self_billing_agreement: {
    accepted: boolean;
    accepted_at: string;
    version: string;
  };
  current_period: string;
  has_payable_settlement: boolean;
  no_payable_message: string | null;
  current_settlement_id: string | null;
  pending_total: number;
  history: Array<{
    id: string;
    settlement_period: string;
    total_payable: number;
    settlement_status: string;
    created_at: string;
  }>;
  approval_text: string;
};

export type PartnerSettlementDetail = {
  has_access: boolean;
  has_payable_settlement: boolean;
  message?: string;
  settlement_period?: string;
  settlement?: {
    id: string;
    settlement_key: string;
    settlement_period: string;
    period_from: string;
    period_to: string;
    commission_total: number;
    vat_rate_pct: number;
    vat_amount: number;
    total_payable: number;
    settlement_status: string;
    due_date: string;
    payment_terms: string;
    partner_approved_at: string;
    approval_statement: string;
  };
  seller?: Record<string, string>;
  buyer?: Record<string, string>;
  items?: Array<{
    sale_reference: string;
    customer_name: string;
    package_label: string;
    sale_value: number;
    commission_rate_pct: number;
    commission_amount: number;
    line_description: string;
  }>;
  invoice?: {
    id: string;
    invoice_number: string;
    invoice_date: string;
    due_date: string;
    total_payable: number;
    invoice_status: string;
    immutable: boolean;
    accounting_payload: Record<string, unknown>;
  } | null;
  approval_text: string;
};

export type PartnerSettlementsHistory = {
  has_access: boolean;
  settlements: Array<{
    id: string;
    settlement_key: string;
    settlement_period: string;
    commission_total: number;
    total_payable: number;
    settlement_status: string;
    partner_approved_at: string;
    created_at: string;
    invoice_number: string;
  }>;
  invoices: Array<{
    id: string;
    invoice_number: string;
    settlement_period: string;
    total_payable: number;
    invoice_status: string;
    immutable: boolean;
    invoice_date: string;
    paid_at: string;
  }>;
};
