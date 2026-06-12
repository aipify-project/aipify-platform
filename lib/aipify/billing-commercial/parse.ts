import type {
  BlueprintObjective,
  BlueprintSuccessCriterion,
  CommercialModelActionResult,
  CommercialModelBriefingResult,
  CommercialModelCard,
  CommercialModelDashboard,
  CompanionHealthInsight,
  FinancialSystemScaffold,
  ImplementationBlueprintPhase39,
  IntegrationLink,
  RevenueSummary,
} from "./types";

function parseBlueprintPhase39(d: Record<string, unknown>): ImplementationBlueprintPhase39 | undefined {
  const bp = d.implementation_blueprint_phase39;
  if (!bp || typeof bp !== "object") return undefined;
  const b = bp as Record<string, unknown>;
  return {
    phase: typeof b.phase === "number" ? b.phase : undefined,
    title: typeof b.title === "string" ? b.title : undefined,
    doc: typeof b.doc === "string" ? b.doc : undefined,
    engine_phase: typeof b.engine_phase === "string" ? b.engine_phase : undefined,
    route: typeof b.route === "string" ? b.route : undefined,
    mapping_note: typeof b.mapping_note === "string" ? b.mapping_note : undefined,
  };
}

function parseObjectives(value: unknown): BlueprintObjective[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const o = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof o.key === "string" ? o.key : undefined,
      label: typeof o.label === "string" ? o.label : undefined,
      description: typeof o.description === "string" ? o.description : undefined,
    };
  });
}

function parseRevenueSummary(value: unknown): RevenueSummary | undefined {
  if (!value || typeof value !== "object") return undefined;
  const s = value as Record<string, unknown>;
  return {
    mrr: Number(s.mrr ?? 0),
    arr: Number(s.arr ?? 0),
    currency: typeof s.currency === "string" ? s.currency : undefined,
    billing_cycle: typeof s.billing_cycle === "string" ? s.billing_cycle : undefined,
    health_score: Number(s.health_score ?? 0),
    engagement_score: Number(s.engagement_score ?? 0),
    adoption_score: Number(s.adoption_score ?? 0),
    renewal_likelihood: Number(s.renewal_likelihood ?? 0),
    expansion_opportunity: Number(s.expansion_opportunity ?? 0),
    upcoming_renewals: Number(s.upcoming_renewals ?? 0),
    partner_commission_events: Number(s.partner_commission_events ?? 0),
    active_addons: Number(s.active_addons ?? 0),
    available_expansion_packs: Number(s.available_expansion_packs ?? 0),
    upgrade_rate_pct: Number(s.upgrade_rate_pct ?? 0),
    addon_adoption_pct: Number(s.addon_adoption_pct ?? 0),
    revenue_trend_direction: typeof s.revenue_trend_direction === "string" ? s.revenue_trend_direction : undefined,
    retention_signal: typeof s.retention_signal === "string" ? s.retention_signal : undefined,
    renewal_risk_level: typeof s.renewal_risk_level === "string" ? s.renewal_risk_level : undefined,
    privacy_note: typeof s.privacy_note === "string" ? s.privacy_note : undefined,
  };
}

function parseCompanionInsights(value: unknown): CompanionHealthInsight[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const o = (item ?? {}) as Record<string, unknown>;
    return {
      emoji: typeof o.emoji === "string" ? o.emoji : undefined,
      key: typeof o.key === "string" ? o.key : undefined,
      trait: typeof o.trait === "string" ? o.trait : undefined,
      example: typeof o.example === "string" ? o.example : undefined,
    };
  });
}

function parseFinancialSystems(value: unknown): FinancialSystemScaffold[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const o = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof o.key === "string" ? o.key : undefined,
      name: typeof o.name === "string" ? o.name : undefined,
      role: typeof o.role === "string" ? o.role : undefined,
      status: typeof o.status === "string" ? o.status : undefined,
      note: typeof o.note === "string" ? o.note : undefined,
    };
  });
}

function parseIntegrationLinks(value: unknown): IntegrationLink[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const o = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof o.key === "string" ? o.key : undefined,
      label: typeof o.label === "string" ? o.label : undefined,
      route: typeof o.route === "string" ? o.route : undefined,
      note: typeof o.note === "string" ? o.note : undefined,
    };
  });
}

function parseSuccessCriteria(value: unknown): BlueprintSuccessCriterion[] {
  if (!Array.isArray(value)) return [];
  return value.map((item) => {
    const o = (item ?? {}) as Record<string, unknown>;
    return {
      key: typeof o.key === "string" ? o.key : undefined,
      label: typeof o.label === "string" ? o.label : undefined,
      met: Boolean(o.met),
      note: typeof o.note === "string" ? o.note : o.note === null ? null : undefined,
    };
  });
}

function parseStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function parsePhase39BlueprintFields(d: Record<string, unknown>) {
  const healthInsights = d.customer_health_insights;
  const renewalIntel = d.renewal_intelligence;
  const expansion = d.expansion_opportunities;
  const salesExpert = d.sales_expert_revenue_connection;
  const financial = d.financial_system_connection;
  const selfLove = d.revenue_self_love_connection;
  const trust = d.revenue_trust_connection;
  const dogfooding = d.revenue_dogfooding;

  return {
    implementation_blueprint_phase39: parseBlueprintPhase39(d),
    revenue_intelligence_mission:
      typeof d.revenue_intelligence_mission === "string" ? d.revenue_intelligence_mission : undefined,
    revenue_intelligence_philosophy:
      typeof d.revenue_intelligence_philosophy === "string" ? d.revenue_intelligence_philosophy : undefined,
    revenue_objectives: parseObjectives(d.revenue_objectives),
    revenue_dashboard_fields: parseObjectives(d.revenue_dashboard_fields),
    revenue_summary: parseRevenueSummary(d.revenue_summary),
    customer_health_insights:
      healthInsights && typeof healthInsights === "object"
        ? {
            principle: typeof (healthInsights as Record<string, unknown>).principle === "string"
              ? ((healthInsights as Record<string, unknown>).principle as string)
              : undefined,
            examples: parseCompanionInsights((healthInsights as Record<string, unknown>).examples),
            customer_success_route:
              typeof (healthInsights as Record<string, unknown>).customer_success_route === "string"
                ? ((healthInsights as Record<string, unknown>).customer_success_route as string)
                : undefined,
            boundary:
              typeof (healthInsights as Record<string, unknown>).boundary === "string"
                ? ((healthInsights as Record<string, unknown>).boundary as string)
                : undefined,
          }
        : undefined,
    renewal_intelligence:
      renewalIntel && typeof renewalIntel === "object"
        ? {
            principle: typeof (renewalIntel as Record<string, unknown>).principle === "string"
              ? ((renewalIntel as Record<string, unknown>).principle as string)
              : undefined,
            capabilities: parseObjectives((renewalIntel as Record<string, unknown>).capabilities),
            subscription_plan_route:
              typeof (renewalIntel as Record<string, unknown>).subscription_plan_route === "string"
                ? ((renewalIntel as Record<string, unknown>).subscription_plan_route as string)
                : undefined,
            sales_expert_route:
              typeof (renewalIntel as Record<string, unknown>).sales_expert_route === "string"
                ? ((renewalIntel as Record<string, unknown>).sales_expert_route as string)
                : undefined,
          }
        : undefined,
    expansion_opportunities:
      expansion && typeof expansion === "object"
        ? {
            principle: typeof (expansion as Record<string, unknown>).principle === "string"
              ? ((expansion as Record<string, unknown>).principle as string)
              : undefined,
            opportunity_types: parseObjectives((expansion as Record<string, unknown>).opportunity_types),
            module_marketplace_route:
              typeof (expansion as Record<string, unknown>).module_marketplace_route === "string"
                ? ((expansion as Record<string, unknown>).module_marketplace_route as string)
                : undefined,
            commercial_packages_route:
              typeof (expansion as Record<string, unknown>).commercial_packages_route === "string"
                ? ((expansion as Record<string, unknown>).commercial_packages_route as string)
                : undefined,
          }
        : undefined,
    sales_expert_revenue_connection:
      salesExpert && typeof salesExpert === "object"
        ? {
            principle: typeof (salesExpert as Record<string, unknown>).principle === "string"
              ? ((salesExpert as Record<string, unknown>).principle as string)
              : undefined,
            capabilities: parseStringArray((salesExpert as Record<string, unknown>).capabilities),
            sales_expert_route:
              typeof (salesExpert as Record<string, unknown>).sales_expert_route === "string"
                ? ((salesExpert as Record<string, unknown>).sales_expert_route as string)
                : undefined,
            cross_link_note:
              typeof (salesExpert as Record<string, unknown>).cross_link_note === "string"
                ? ((salesExpert as Record<string, unknown>).cross_link_note as string)
                : undefined,
          }
        : undefined,
    financial_system_connection:
      financial && typeof financial === "object"
        ? {
            principle: typeof (financial as Record<string, unknown>).principle === "string"
              ? ((financial as Record<string, unknown>).principle as string)
              : undefined,
            systems: parseFinancialSystems((financial as Record<string, unknown>).systems),
            integration_engine_route:
              typeof (financial as Record<string, unknown>).integration_engine_route === "string"
                ? ((financial as Record<string, unknown>).integration_engine_route as string)
                : undefined,
            accounting_truth_note:
              typeof (financial as Record<string, unknown>).accounting_truth_note === "string"
                ? ((financial as Record<string, unknown>).accounting_truth_note as string)
                : undefined,
            boundary:
              typeof (financial as Record<string, unknown>).boundary === "string"
                ? ((financial as Record<string, unknown>).boundary as string)
                : undefined,
          }
        : undefined,
    revenue_self_love_connection:
      selfLove && typeof selfLove === "object"
        ? {
            principle: typeof (selfLove as Record<string, unknown>).principle === "string"
              ? ((selfLove as Record<string, unknown>).principle as string)
              : undefined,
            connections: parseStringArray((selfLove as Record<string, unknown>).connections),
            self_love_route:
              typeof (selfLove as Record<string, unknown>).self_love_route === "string"
                ? ((selfLove as Record<string, unknown>).self_love_route as string)
                : undefined,
            boundary:
              typeof (selfLove as Record<string, unknown>).boundary === "string"
                ? ((selfLove as Record<string, unknown>).boundary as string)
                : undefined,
          }
        : undefined,
    revenue_trust_connection:
      trust && typeof trust === "object"
        ? {
            principle: typeof (trust as Record<string, unknown>).principle === "string"
              ? ((trust as Record<string, unknown>).principle as string)
              : undefined,
            users_should_understand: parseStringArray((trust as Record<string, unknown>).users_should_understand),
            operators_should_understand: parseStringArray(
              (trust as Record<string, unknown>).operators_should_understand,
            ),
            license_route:
              typeof (trust as Record<string, unknown>).license_route === "string"
                ? ((trust as Record<string, unknown>).license_route as string)
                : undefined,
            security_route:
              typeof (trust as Record<string, unknown>).security_route === "string"
                ? ((trust as Record<string, unknown>).security_route as string)
                : undefined,
            metadata_only: Boolean((trust as Record<string, unknown>).metadata_only),
          }
        : undefined,
    revenue_dogfooding:
      dogfooding && typeof dogfooding === "object"
        ? (() => {
            const df = dogfooding as Record<string, unknown>;
            const parsePilot = (pilot: unknown) => {
              if (!pilot || typeof pilot !== "object") return undefined;
              const p = pilot as Record<string, unknown>;
              return {
                slug: typeof p.slug === "string" ? p.slug : undefined,
                role: typeof p.role === "string" ? p.role : undefined,
                focus: parseStringArray(p.focus),
              };
            };
            return {
              principle: typeof df.principle === "string" ? df.principle : undefined,
              aipify_group: parsePilot(df.aipify_group),
              unonight: parsePilot(df.unonight),
            };
          })()
        : undefined,
    revenue_success_criteria: parseSuccessCriteria(d.revenue_success_criteria),
    revenue_vision_phrases: parseStringArray(d.revenue_vision_phrases),
    revenue_abos_principle: typeof d.revenue_abos_principle === "string" ? d.revenue_abos_principle : undefined,
    revenue_distinction_note:
      typeof d.revenue_distinction_note === "string" ? d.revenue_distinction_note : undefined,
    revenue_integration_links: parseIntegrationLinks(d.revenue_integration_links),
  };
}

export function parseCommercialModelCard(data: unknown): CommercialModelCard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    customer_tier: typeof d.customer_tier === "string" ? d.customer_tier : undefined,
    customer_tier_label: typeof d.customer_tier_label === "string" ? d.customer_tier_label : undefined,
    health_score: Number(d.health_score ?? 0),
    mrr: Number(d.mrr ?? 0),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    human_oversight_required: Boolean(d.human_oversight_required),
    implementation_blueprint_phase39: parseBlueprintPhase39(d),
    revenue_intelligence_phase:
      typeof d.revenue_intelligence_phase === "number" ? d.revenue_intelligence_phase : undefined,
    revenue_abos_principle: typeof d.revenue_abos_principle === "string" ? d.revenue_abos_principle : undefined,
    revenue_summary: parseRevenueSummary(d.revenue_summary),
    blueprint_note: typeof d.blueprint_note === "string" ? d.blueprint_note : undefined,
  };
}

export function parseCommercialModelDashboard(data: unknown): CommercialModelDashboard {
  const d = (data ?? {}) as Record<string, unknown>;
  return {
    has_customer: Boolean(d.has_customer),
    human_oversight_required: Boolean(d.human_oversight_required),
    philosophy: typeof d.philosophy === "string" ? d.philosophy : undefined,
    safety_note: typeof d.safety_note === "string" ? d.safety_note : undefined,
    self_service_enabled: Boolean(d.self_service_enabled ?? true),
    trials_enabled: Boolean(d.trials_enabled ?? true),
    partner_billing_enabled: Boolean(d.partner_billing_enabled ?? true),
    global_billing_enabled: Boolean(d.global_billing_enabled ?? true),
    downgrade_grace_days: Number(d.downgrade_grace_days ?? 14),
    customer_tier: typeof d.customer_tier === "string" ? d.customer_tier : undefined,
    customer_tier_label: typeof d.customer_tier_label === "string" ? d.customer_tier_label : undefined,
    health_score: Number(d.health_score ?? 0),
    engagement_score: Number(d.engagement_score ?? 0),
    adoption_score: Number(d.adoption_score ?? 0),
    renewal_likelihood: Number(d.renewal_likelihood ?? 0),
    expansion_opportunity: Number(d.expansion_opportunity ?? 0),
    mrr: Number(d.mrr ?? 0),
    arr: Number(d.arr ?? 0),
    currency: typeof d.currency === "string" ? d.currency : "EUR",
    billing_cycle: typeof d.billing_cycle === "string" ? d.billing_cycle : undefined,
    subscription_status: typeof d.subscription_status === "string" ? d.subscription_status : undefined,
    payment_method: typeof d.payment_method === "string" ? d.payment_method : undefined,
    packaging_layers: Array.isArray(d.packaging_layers)
      ? (d.packaging_layers as CommercialModelDashboard["packaging_layers"])
      : [],
    customer_tiers: Array.isArray(d.customer_tiers)
      ? (d.customer_tiers as CommercialModelDashboard["customer_tiers"])
      : [],
    subscription_models: Array.isArray(d.subscription_models) ? (d.subscription_models as string[]) : [],
    business_packs: Array.isArray(d.business_packs) ? (d.business_packs as CommercialModelDashboard["business_packs"]) : [],
    addon_modules: Array.isArray(d.addon_modules) ? (d.addon_modules as CommercialModelDashboard["addon_modules"]) : [],
    enterprise_services: Array.isArray(d.enterprise_services)
      ? (d.enterprise_services as CommercialModelDashboard["enterprise_services"])
      : [],
    usage_metrics: typeof d.usage_metrics === "object" && d.usage_metrics
      ? (d.usage_metrics as Record<string, unknown>)
      : undefined,
    invoices: Array.isArray(d.invoices) ? (d.invoices as CommercialModelDashboard["invoices"]) : [],
    renewal_events: Array.isArray(d.renewal_events) ? (d.renewal_events as CommercialModelDashboard["renewal_events"]) : [],
    partner_commissions: Array.isArray(d.partner_commissions)
      ? (d.partner_commissions as CommercialModelDashboard["partner_commissions"])
      : [],
    commercial_analytics: typeof d.commercial_analytics === "object" && d.commercial_analytics
      ? (d.commercial_analytics as Record<string, unknown>)
      : undefined,
    downgrade_controls: Array.isArray(d.downgrade_controls) ? d.downgrade_controls : [],
    trial_framework: Array.isArray(d.trial_framework) ? (d.trial_framework as string[]) : [],
    pricing_governance: Array.isArray(d.pricing_governance) ? (d.pricing_governance as string[]) : [],
    briefings: Array.isArray(d.briefings) ? (d.briefings as CommercialModelDashboard["briefings"]) : [],
    integrations: typeof d.integrations === "object" && d.integrations
      ? (d.integrations as Record<string, string>)
      : undefined,
    ...parsePhase39BlueprintFields(d),
  };
}

export function parseCommercialModelActionResult(data: unknown): CommercialModelActionResult {
  return (data ?? {}) as CommercialModelActionResult;
}

export function parseCommercialModelBriefingResult(data: unknown): CommercialModelBriefingResult {
  return (data ?? {}) as CommercialModelBriefingResult;
}
