export type PartnerVerificationStatus = "pending" | "in_review" | "verified" | "rejected" | "no_company";

export type PartnerCompanyType = "norwegian_as" | "norwegian_enk" | "foreign_equivalent";

export type EconomySale = {
  id: string;
  sale_key: string;
  customer_label: string;
  plan_key: string;
  sale_amount: number;
  sale_status: string;
  is_enterprise?: boolean;
  created_at?: string;
};

export type EconomyCommission = {
  id: string;
  customer_label: string;
  commission_rate_pct: number;
  commission_basis: number;
  commission_amount: number;
  commission_status: string;
  created_at?: string;
};

export type EconomyMilestone = {
  milestone_key: string;
  label: string;
  achieved: boolean;
  achieved_at?: string | null;
};

export type EconomySettlement = {
  id: string;
  settlement_key?: string;
  settlement_period: string;
  total_payable: number;
  settlement_status: string;
  created_at?: string;
};

export type EconomyInvoice = {
  id: string;
  invoice_number: string;
  issue_date: string;
  settlement_period: string;
  total_amount: number;
  invoice_status: string;
  finalized_at?: string | null;
};

export type EconomyAgreement = {
  agreement_type: string;
  accepted: boolean;
  accepted_at?: string | null;
};

export type EconomyOverview = {
  found: boolean;
  principle?: string;
  no_company?: boolean;
  can_earn_commissions?: boolean;
  verification_status?: PartnerVerificationStatus | string;
  company_name?: string;
  approved_sales_count?: number;
  current_commission_tier_pct?: number;
  pending_commission_total?: number;
  milestones?: EconomyMilestone[];
  pending_settlements?: EconomySettlement[];
  recent_settlements?: EconomySettlement[];
  agreements?: EconomyAgreement[];
};

export type EconomySettlementDetail = EconomySettlement & {
  found: boolean;
  period_from?: string;
  period_to?: string;
  commission_total?: number;
  bonus_total?: number;
  vat_amount?: number;
  approval_statement?: string;
  commissions?: { customer_label: string; commission_amount: number }[];
};

export type GrowthPartnerEconomyLabels = {
  title: string;
  subtitle: string;
  loading: string;
  principle: string;
  oneTimeNote: string;
  noCompanyTitle: string;
  noCompanyBody: string;
  createBusinessCta: string;
  norwayGuidance: string;
  brregLink: string;
  accessDenied: string;
  sections: {
    overview: string;
    salesHistory: string;
    commissionHistory: string;
    commissionTier: string;
    milestones: string;
    pendingSettlements: string;
    settlementHistory: string;
    invoices: string;
    companyInfo: string;
    bankDetails: string;
    agreements: string;
  };
  tier: {
    current: string;
    salesCount: string;
    ladderNote: string;
  };
  settlement: {
    prepare: string;
    approve: string;
    approvalStatement: string;
    approveSuccess: string;
    prepareSuccess: string;
    reviewDetails: string;
  };
  agreements: {
    growthPartner: string;
    selfBilling: string;
    partnerTerms: string;
    accept: string;
    acceptSuccess: string;
  };
  onboarding: {
    companyType: string;
    companyName: string;
    organizationNumber: string;
    vatNumber: string;
    vatRegistered: string;
    address: string;
    bankAccount: string;
    submit: string;
  };
  companyTypes: Record<string, string>;
  faq: {
    title: string;
    notEmployee: string;
    notEmployeeAnswer: string;
    recurring: string;
    recurringAnswer: string;
    selfBilling: string;
    selfBillingAnswer: string;
  };
};

export const COMMISSION_TIER_LADDER = [
  { min: 1, max: 9, pct: 5 },
  { min: 10, max: 24, pct: 10 },
  { min: 25, max: 49, pct: 15 },
  { min: 50, max: 99, pct: 20 },
  { min: 100, max: null, pct: 25 },
] as const;
