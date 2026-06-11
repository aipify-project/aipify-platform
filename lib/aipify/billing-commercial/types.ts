export const CUSTOMER_TIERS = ["starter", "professional", "business", "enterprise", "enterprise_plus"] as const;

export const PACK_LAYERS = ["core_platform", "business_pack", "addon_module", "enterprise_service"] as const;

export type BusinessPack = {
  id: string;
  pack_key: string;
  title: string;
  description: string;
  pack_layer: string;
  status: string;
  monthly_price?: number | null;
};

export type AddonModule = {
  id: string;
  addon_key: string;
  title: string;
  description: string;
  status: string;
  monthly_price?: number | null;
};

export type EnterpriseService = {
  id: string;
  service_key: string;
  title: string;
  description: string;
  status: string;
};

export type CommercialInvoice = {
  id: string;
  invoice_number: string;
  status: string;
  amount: number;
  currency: string;
  due_date?: string;
  issued_at?: string;
};

export type RenewalEvent = {
  id: string;
  event_type: string;
  title: string;
  description: string;
  due_at?: string | null;
  status: string;
};

export type PartnerCommission = {
  id: string;
  partner_name: string;
  commission_type: string;
  amount: number;
  currency: string;
  status: string;
};

export type CommercialModelCard = {
  has_customer: boolean;
  customer_tier?: string;
  customer_tier_label?: string;
  health_score?: number;
  mrr?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
};

export type CommercialModelDashboard = {
  has_customer: boolean;
  human_oversight_required?: boolean;
  philosophy?: string;
  safety_note?: string;
  self_service_enabled?: boolean;
  trials_enabled?: boolean;
  partner_billing_enabled?: boolean;
  global_billing_enabled?: boolean;
  downgrade_grace_days?: number;
  customer_tier?: string;
  customer_tier_label?: string;
  health_score?: number;
  engagement_score?: number;
  adoption_score?: number;
  renewal_likelihood?: number;
  expansion_opportunity?: number;
  mrr?: number;
  arr?: number;
  currency?: string;
  billing_cycle?: string;
  subscription_status?: string;
  payment_method?: string;
  packaging_layers?: Array<{ layer: string; label: string }>;
  customer_tiers?: Array<{ tier: string; label: string }>;
  subscription_models?: string[];
  business_packs: BusinessPack[];
  addon_modules: AddonModule[];
  enterprise_services: EnterpriseService[];
  usage_metrics?: Record<string, unknown>;
  invoices: CommercialInvoice[];
  renewal_events: RenewalEvent[];
  partner_commissions: PartnerCommission[];
  commercial_analytics?: Record<string, unknown>;
  downgrade_controls?: unknown[];
  trial_framework?: string[];
  pricing_governance?: string[];
  briefings: Array<{ id: string; summary: string; created_at?: string }>;
  integrations?: Record<string, string>;
};

export type CommercialModelActionResult = {
  status?: string;
  addon_key?: string;
  error?: string;
};

export type CommercialModelBriefingResult = {
  briefing_id?: string;
  summary?: string;
  error?: string;
};
