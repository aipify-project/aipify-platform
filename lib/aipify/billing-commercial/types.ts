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

export type BlueprintObjective = {
  key?: string;
  label?: string;
  description?: string;
};

export type BlueprintSuccessCriterion = {
  key?: string;
  label?: string;
  met?: boolean;
  note?: string | null;
};

export type IntegrationLink = {
  key?: string;
  label?: string;
  route?: string;
  note?: string;
};

export type CompanionHealthInsight = {
  emoji?: string;
  key?: string;
  trait?: string;
  example?: string;
};

export type FinancialSystemScaffold = {
  key?: string;
  name?: string;
  role?: string;
  status?: string;
  note?: string;
};

export type RevenueSummary = {
  mrr?: number;
  arr?: number;
  currency?: string;
  billing_cycle?: string;
  health_score?: number;
  engagement_score?: number;
  adoption_score?: number;
  renewal_likelihood?: number;
  expansion_opportunity?: number;
  upcoming_renewals?: number;
  partner_commission_events?: number;
  active_addons?: number;
  available_expansion_packs?: number;
  upgrade_rate_pct?: number;
  addon_adoption_pct?: number;
  revenue_trend_direction?: string;
  retention_signal?: string;
  renewal_risk_level?: string;
  privacy_note?: string;
};

export type ImplementationBlueprintPhase39 = {
  phase?: number;
  title?: string;
  doc?: string;
  engine_phase?: string;
  route?: string;
  mapping_note?: string;
};

export type CommercialModelCard = {
  has_customer: boolean;
  customer_tier?: string;
  customer_tier_label?: string;
  health_score?: number;
  mrr?: number;
  philosophy?: string;
  human_oversight_required?: boolean;
  implementation_blueprint_phase39?: ImplementationBlueprintPhase39;
  revenue_intelligence_phase?: number;
  revenue_abos_principle?: string;
  revenue_summary?: RevenueSummary;
  blueprint_note?: string;
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
  implementation_blueprint_phase39?: ImplementationBlueprintPhase39;
  revenue_intelligence_mission?: string;
  revenue_intelligence_philosophy?: string;
  revenue_objectives?: BlueprintObjective[];
  revenue_dashboard_fields?: BlueprintObjective[];
  revenue_summary?: RevenueSummary;
  customer_health_insights?: {
    principle?: string;
    examples?: CompanionHealthInsight[];
    customer_success_route?: string;
    boundary?: string;
  };
  renewal_intelligence?: {
    principle?: string;
    capabilities?: BlueprintObjective[];
    subscription_plan_route?: string;
    sales_expert_route?: string;
  };
  expansion_opportunities?: {
    principle?: string;
    opportunity_types?: BlueprintObjective[];
    module_marketplace_route?: string;
    commercial_packages_route?: string;
  };
  sales_expert_revenue_connection?: {
    principle?: string;
    capabilities?: string[];
    sales_expert_route?: string;
    cross_link_note?: string;
  };
  financial_system_connection?: {
    principle?: string;
    systems?: FinancialSystemScaffold[];
    integration_engine_route?: string;
    accounting_truth_note?: string;
    boundary?: string;
  };
  revenue_self_love_connection?: {
    principle?: string;
    connections?: string[];
    self_love_route?: string;
    boundary?: string;
  };
  revenue_trust_connection?: {
    principle?: string;
    users_should_understand?: string[];
    operators_should_understand?: string[];
    license_route?: string;
    security_route?: string;
    metadata_only?: boolean;
  };
  revenue_dogfooding?: {
    principle?: string;
    aipify_group?: { slug?: string; role?: string; focus?: string[] };
    unonight?: { slug?: string; role?: string; focus?: string[] };
  };
  revenue_success_criteria?: BlueprintSuccessCriterion[];
  revenue_vision_phrases?: string[];
  revenue_abos_principle?: string;
  revenue_distinction_note?: string;
  revenue_integration_links?: IntegrationLink[];
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
