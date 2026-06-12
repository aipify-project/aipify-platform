-- Implementation Blueprint Phase 39 — Revenue Intelligence Engine
-- Extends Billing, Packaging & Commercial Model (Phase 93). No new tables — metadata scaffold only.
-- Naming note: distinct from Commerce Performance Phase 104 at /app/commerce-performance — product profit vs subscription revenue.

create or replace function public._ribp_mission()
returns text language sql immutable as $$
  select 'Financial visibility through operational revenue patterns — clarity not anxiety.';
$$;

create or replace function public._ribp_philosophy()
returns text language sql immutable as $$
  select 'Revenue intelligence supports confident decisions — Aipify surfaces patterns and preparation cues, never alarmist financial pressure.';
$$;

create or replace function public._ribp_abos_principle()
returns text language sql immutable as $$
  select 'Operational subscription intelligence inside the Aipify Business Operating System — humans decide, Aipify informs and prepares.';
$$;

create or replace function public._ribp_revenue_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'revenue_visibility', 'label', 'Revenue visibility', 'description', 'MRR, ARR, and revenue trend awareness from commercial metadata — no raw payment records'),
    jsonb_build_object('key', 'subscription_health', 'label', 'Subscription health', 'description', 'Engagement, adoption, renewal likelihood, and commercial health scores'),
    jsonb_build_object('key', 'customer_value_awareness', 'label', 'Customer value awareness', 'description', 'Lifetime value trends and expansion signals — connected to Customer Success A.26'),
    jsonb_build_object('key', 'renewal_forecasting', 'label', 'Renewal forecasting', 'description', 'Upcoming renewals, early risk detection, intentional follow-up preparation'),
    jsonb_build_object('key', 'opportunity_identification', 'label', 'Opportunity identification', 'description', 'Business Packs, add-ons, industry capabilities, team licenses — growth through value'),
    jsonb_build_object('key', 'financial_trend_analysis', 'label', 'Financial trend analysis', 'description', 'Churn, expansion, and acquisition trend metadata — honest uncertainty acknowledged')
  );
$$;

create or replace function public._ribp_revenue_dashboard_fields()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'mrr', 'label', 'MRR', 'description', 'Monthly recurring revenue from commercial analytics'),
    jsonb_build_object('key', 'arr', 'label', 'ARR', 'description', 'Annual recurring revenue derived from MRR and active add-ons'),
    jsonb_build_object('key', 'revenue_trends', 'label', 'Revenue trends', 'description', 'Expansion and churn trend percentages — illustrative when integrations pending'),
    jsonb_build_object('key', 'subscription_growth', 'label', 'Subscription growth', 'description', 'Upgrade rate and add-on adoption from commercial analytics'),
    jsonb_build_object('key', 'customer_acquisition', 'label', 'Customer acquisition', 'description', 'New subscription and trial conversion signals — metadata counts only'),
    jsonb_build_object('key', 'retention', 'label', 'Retention', 'description', 'Renewal likelihood and engagement scores from health tables'),
    jsonb_build_object('key', 'expansion_opportunities', 'label', 'Expansion opportunities', 'description', 'Available Business Packs, add-ons, and enterprise services')
  );
$$;

create or replace function public._ribp_customer_health_insights()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Companion revenue awareness — proactive, calm, connected to Customer Success — never guilt or pressure.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'proactive_follow_up', 'trait', 'Proactive follow-up', 'example', '🦉 Renewal window opens in 30 days — worth a thoughtful check-in when you have a moment.'),
      jsonb_build_object('emoji', '🌹', 'key', 'satisfaction_trends', 'trait', 'Satisfaction trends', 'example', '🌹 Engagement scores are steady — customer success patterns look healthy this quarter.'),
      jsonb_build_object('emoji', '🔔', 'key', 'revenue_milestone', 'trait', 'Revenue milestone', 'example', '🔔 ARR milestone approaching — preparation window for leadership review opens this month.')
    ),
    'customer_success_route', '/app/customer-success-engine',
    'boundary', 'Health insight examples are guidance scaffolds — Customer Success A.26 owns relationship workflows.'
  );
$$;

create or replace function public._ribp_renewal_intelligence()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Renewals are intentional, not accidental — early awareness, risk signals, and suggested follow-ups from scheduled renewal metadata.',
    'capabilities', jsonb_build_array(
      jsonb_build_object('key', 'upcoming_renewals', 'label', 'Upcoming renewals', 'description', 'Scheduled renewal events from commercial_renewal_events — due dates and status only'),
      jsonb_build_object('key', 'early_risk_detection', 'label', 'Early risk detection', 'description', 'Renewal likelihood below threshold triggers calm preparation cues — not alarmist alerts'),
      jsonb_build_object('key', 'suggested_follow_ups', 'label', 'Suggested follow-ups', 'description', 'Engagement and adoption scores inform follow-up timing — humans decide'),
      jsonb_build_object('key', 'engagement_indicators', 'label', 'Engagement indicators', 'description', 'Engagement score, adoption score, and usage metric trends — metadata only')
    ),
    'subscription_plan_route', '/app/subscription-plan-management-engine',
    'sales_expert_route', '/app/sales-expert-engine'
  );
$$;

create or replace function public._ribp_expansion_opportunities()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Growth through value — Business Packs, industry capabilities, companion experiences, and team licenses surfaced when expansion signals align.',
    'opportunity_types', jsonb_build_array(
      jsonb_build_object('key', 'business_packs', 'label', 'Business Packs', 'description', 'Layered packaging from commercial_business_packs — upgrade paths with transparent pricing'),
      jsonb_build_object('key', 'industry_capabilities', 'label', 'Industry capabilities', 'description', 'Vertical modules and industry-specific add-ons — cross-link Module Marketplace A.23'),
      jsonb_build_object('key', 'companion_experiences', 'label', 'Companion experiences', 'description', 'Premium companion and presence modules — growth aligned with adoption'),
      jsonb_build_object('key', 'team_licenses', 'label', 'Team licenses', 'description', 'Seat expansion and team licensing from usage metrics — metadata counts only')
    ),
    'module_marketplace_route', '/app/module-marketplace-foundation-engine',
    'commercial_packages_route', '/app/settings/modules'
  );
$$;

create or replace function public._ribp_sales_expert_revenue_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sales Expert OS connects renewal visibility, expansion opportunities, commission forecasting, and customer lifecycle — cross-link only, no duplicate sales tables.',
    'capabilities', jsonb_build_array(
      'Renewal visibility for partner and direct sales follow-up',
      'Expansion opportunity signals for commission forecasting metadata',
      'Customer lifecycle stage awareness — trial, active, renewal, expansion',
      'Partner commission trends from commercial_partner_commissions — amounts aggregated, no PII'
    ),
    'sales_expert_route', '/app/sales-expert-engine',
    'cross_link_note', 'Extends Sales Expert Operating System A.95 — revenue intelligence feeds sales awareness; Sales Expert owns pipeline workflows.'
  );
$$;

create or replace function public._ribp_financial_system_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Stripe for payments, Fiken for accounting — Aipify is the operational intelligence layer. Honest integration status; never fake connected state.',
    'systems', jsonb_build_array(
      jsonb_build_object(
        'key', 'stripe',
        'name', 'Stripe',
        'role', 'primary_payments',
        'status', 'scaffold',
        'note', 'Payment events and subscription signals — configure via Integration Engine A.8 Blueprint Phase 27'
      ),
      jsonb_build_object(
        'key', 'fiken',
        'name', 'Fiken',
        'role', 'primary_accounting',
        'status', 'scaffold',
        'note', 'Accounting source of truth for bookkeeping — Aipify coordinates awareness, never overrides ledger'
      ),
      jsonb_build_object(
        'key', 'future_platforms',
        'name', 'Future platforms',
        'role', 'extensible',
        'status', 'scaffold',
        'note', 'Additional accounting and payment platforms — metadata scaffold for honest future readiness'
      )
    ),
    'integration_engine_route', '/app/integration-engine',
    'accounting_truth_note', 'Fiken remains accounting source of truth. Aipify provides operational subscription revenue intelligence — not a bookkeeping platform.',
    'boundary', 'Connection status derived from integration metadata when available — scaffold until connectors complete.'
  );
$$;

create or replace function public._ribp_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Clarity not anxiety — preparation, long-term thinking, and progress recognition. Revenue visibility supports confidence, not constant financial pressure.',
    'connections', jsonb_build_array(
      'Preparation before renewal and milestone windows — calm awareness',
      'Long-term thinking — trends over single-day fluctuations',
      'Progress recognition — celebrate sustainable growth without comparison pressure',
      'Reduce spreadsheet chasing — operational summaries when they matter'
    ),
    'self_love_route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 owns reflection workflows — Revenue Intelligence stores no personal wellbeing content.'
  );
$$;

create or replace function public._ribp_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Metrics displayed with forecast assumptions, data sources, and uncertainty acknowledged — Fiken accounting truth preserved.',
    'users_should_understand', jsonb_build_array(
      'Which metrics come from commercial tables vs integration scaffolds',
      'Forecast assumptions are illustrative when Stripe/Fiken connectors are pending',
      'Fiken is accounting source of truth — Aipify never overrides ledger data',
      'No raw payment records, card data, or customer financial PII in RPC payloads',
      'Revenue trends may include uncertainty bands — honest about data freshness'
    ),
    'operators_should_understand', jsonb_build_array(
      'Distinct from Commerce Performance Phase 104 — product profit vs subscription revenue',
      'Distinct from License Center — payment recovery and subscription status',
      'Distinct from Commercial Packages Phase 42 — module licensing UI',
      'Integration Engine A.8 owns connector configuration — revenue intelligence consumes metadata',
      'Trust Architecture privacy rules apply to all revenue aggregation'
    ),
    'license_route', '/app/license',
    'security_route', '/app/settings/security',
    'metadata_only', true
  );
$$;

create or replace function public._ribp_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Aipify Group validates revenue intelligence internally; Unonight exercises subscription visibility as first external pilot.',
    'aipify_group', jsonb_build_object(
      'slug', 'aipify-group',
      'role', 'Internal validation — MRR/ARR visibility, renewal forecasting, expansion signals, partner commission metadata',
      'focus', jsonb_build_array('Commercial health score calibration', 'Renewal event scheduling awareness', 'Stripe/Fiken integration scaffold honesty', 'Executive revenue summary preparation')
    ),
    'unonight', jsonb_build_object(
      'slug', 'unonight',
      'role', 'First external pilot — subscription revenue intelligence for commerce operations',
      'focus', jsonb_build_array('Renewal likelihood tracking', 'Expansion opportunity surfacing', 'Customer success cross-link validation', 'Sales Expert renewal visibility')
    )
  );
$$;

create or replace function public._ribp_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Financial visibility through operational patterns — clarity not anxiety.',
    'Subscription health visible before renewal surprises — intentional, not accidental.',
    'Growth through value — expansion when customers are ready, not pressured.',
    'Fiken owns the books; Stripe owns payments; Aipify illuminates operational revenue.',
    'Humans decide. Aipify informs, prepares, and celebrates sustainable progress.'
  );
$$;

create or replace function public._ribp_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'subscription_plan', 'label', 'Subscription & Plan Management A.11', 'route', '/app/subscription-plan-management-engine', 'note', 'Plan modules, trials, upgrade/downgrade safeguards'),
    jsonb_build_object('key', 'customer_success', 'label', 'Customer Success A.26', 'route', '/app/customer-success-engine', 'note', 'Relationship health and proactive follow-up'),
    jsonb_build_object('key', 'sales_expert', 'label', 'Sales Expert OS A.95', 'route', '/app/sales-expert-engine', 'note', 'Renewal visibility, expansion, commission forecasting'),
    jsonb_build_object('key', 'integration_engine', 'label', 'Integration Engine A.8 + Blueprint Phase 27', 'route', '/app/integration-engine', 'note', 'Stripe payments, Fiken accounting connectors'),
    jsonb_build_object('key', 'analytics_insights', 'label', 'Analytics & Insights A.16', 'route', '/app/analytics-insights-engine', 'note', 'Operational analytics cross-links'),
    jsonb_build_object('key', 'value_realization', 'label', 'Value Realization A.48', 'route', '/app/value-realization-engine', 'note', 'Customer value and ROI awareness'),
    jsonb_build_object('key', 'executive_insights', 'label', 'Executive Insights A.35', 'route', '/app/executive-insights-engine', 'note', 'Executive revenue summaries and strategic trends'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Clarity not anxiety — preparation and progress recognition'),
    jsonb_build_object('key', 'license', 'label', 'License Center / Commercial Packages Phase 42', 'route', '/app/license', 'note', 'Subscription status, module licensing, payment recovery'),
    jsonb_build_object('key', 'commerce_performance', 'label', 'Commerce Performance Phase 104', 'route', '/app/commerce-performance', 'note', 'Product profit and commerce operations — distinct from subscription revenue'),
    jsonb_build_object('key', 'commercial_packages', 'label', 'Commercial Packages — Modules', 'route', '/app/settings/modules', 'note', 'Module activation and usage tracking')
  );
$$;

create or replace function public._ribp_distinction_note()
returns text language sql immutable as $$
  select 'ABOS Implementation Blueprint Phase 39 extends Billing, Packaging & Commercial Model Phase 93 at /app/commercial — operational subscription revenue intelligence (MRR/ARR, renewals, expansion). Distinct from Commerce Performance Phase 104 at /app/commerce-performance — product profit, loss prevention, and commerce operations. Cross-link engines; do not duplicate commerce profit modules or commercial_* tables.';
$$;

create or replace function public._ribp_revenue_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_analytics jsonb;
  v_health record;
  v_upcoming_renewals int := 0;
  v_partner_commissions int := 0;
  v_active_addons int := 0;
  v_available_packs int := 0;
  v_renewal_likelihood numeric := 0;
  v_expansion_opportunity numeric := 0;
begin
  v_analytics := public._bpc_commercial_analytics(p_organization_id);

  select health_score, engagement_score, adoption_score, renewal_likelihood, expansion_opportunity
  into v_health
  from public.commercial_customer_health_scores
  where tenant_id = p_organization_id
  order by calculated_at desc
  limit 1;

  select count(*) into v_upcoming_renewals
  from public.commercial_renewal_events
  where tenant_id = p_organization_id and status = 'scheduled';

  select count(*) into v_partner_commissions
  from public.commercial_partner_commissions
  where tenant_id = p_organization_id and status in ('pending', 'approved');

  select count(*) into v_active_addons
  from public.commercial_addon_entitlements
  where tenant_id = p_organization_id and status = 'active';

  select count(*) into v_available_packs
  from public.commercial_business_packs
  where tenant_id = p_organization_id and status in ('available', 'trial');

  v_renewal_likelihood := coalesce(v_health.renewal_likelihood, 0);
  v_expansion_opportunity := coalesce(v_health.expansion_opportunity, 0);

  return jsonb_build_object(
    'mrr', coalesce((v_analytics->>'mrr')::numeric, 0),
    'arr', coalesce((v_analytics->>'arr')::numeric, 0),
    'currency', coalesce(v_analytics->>'currency', 'EUR'),
    'billing_cycle', coalesce(v_analytics->>'billing_cycle', 'monthly'),
    'health_score', coalesce(v_health.health_score, 0),
    'engagement_score', coalesce(v_health.engagement_score, 0),
    'adoption_score', coalesce(v_health.adoption_score, 0),
    'renewal_likelihood', v_renewal_likelihood,
    'expansion_opportunity', v_expansion_opportunity,
    'upcoming_renewals', v_upcoming_renewals,
    'partner_commission_events', v_partner_commissions,
    'active_addons', v_active_addons,
    'available_expansion_packs', v_available_packs,
    'upgrade_rate_pct', coalesce((v_analytics->>'upgrade_rate_pct')::numeric, 0),
    'addon_adoption_pct', coalesce((v_analytics->>'addon_adoption_pct')::numeric, 0),
    'revenue_trend_direction', case
      when coalesce((v_analytics->>'upgrade_rate_pct')::numeric, 0) > 10 then 'growing'
      when coalesce((v_analytics->>'upgrade_rate_pct')::numeric, 0) < 3 then 'stable'
      else 'moderate'
    end,
    'retention_signal', case
      when v_renewal_likelihood >= 70 then 'healthy'
      when v_renewal_likelihood >= 50 then 'watch'
      else 'prepare'
    end,
    'renewal_risk_level', case
      when v_renewal_likelihood >= 70 then 'low'
      when v_renewal_likelihood >= 50 then 'moderate'
      else 'elevated'
    end,
    'privacy_note', 'Aggregate counts and scores from tenant-scoped commercial tables only — no raw payment records or customer financial PII.'
  );
end; $$;

create or replace function public._ribp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_summary jsonb;
  v_health_score int := 0;
  v_upcoming int := 0;
begin
  v_summary := public._ribp_revenue_summary(p_organization_id);
  v_health_score := coalesce((v_summary->>'health_score')::int, 0);
  v_upcoming := coalesce((v_summary->>'upcoming_renewals')::int, 0);

  return jsonb_build_array(
    jsonb_build_object(
      'key', 'revenue_objectives',
      'label', 'Revenue objectives documented — visibility, health, renewal, expansion, trends',
      'met', jsonb_array_length(public._ribp_revenue_objectives()) >= 6,
      'note', null
    ),
    jsonb_build_object(
      'key', 'dashboard_fields',
      'label', 'Revenue dashboard fields scaffold documented — MRR, ARR, trends, growth, retention',
      'met', jsonb_array_length(public._ribp_revenue_dashboard_fields()) >= 7,
      'note', null
    ),
    jsonb_build_object(
      'key', 'customer_health_insights',
      'label', 'Customer health companion examples documented — proactive, satisfaction, milestone',
      'met', jsonb_array_length((public._ribp_customer_health_insights()->'examples')) >= 3,
      'note', 'Cross-link Customer Success A.26.'
    ),
    jsonb_build_object(
      'key', 'renewal_intelligence',
      'label', 'Renewal intelligence scaffold — upcoming renewals, risk, follow-ups, engagement',
      'met', jsonb_array_length((public._ribp_renewal_intelligence()->'capabilities')) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'expansion_opportunities',
      'label', 'Expansion opportunity types documented — packs, industry, companion, team licenses',
      'met', jsonb_array_length((public._ribp_expansion_opportunities()->'opportunity_types')) >= 4,
      'note', null
    ),
    jsonb_build_object(
      'key', 'sales_expert_connection',
      'label', 'Sales Expert OS revenue connection documented',
      'met', jsonb_array_length((public._ribp_sales_expert_revenue_connection()->'capabilities')) >= 4,
      'note', 'Route /app/sales-expert-engine.'
    ),
    jsonb_build_object(
      'key', 'financial_systems',
      'label', 'Financial system connection — Stripe, Fiken, honest scaffold status',
      'met', jsonb_array_length((public._ribp_financial_system_connection()->'systems')) >= 3,
      'note', 'Fiken = accounting source of truth; Aipify = operational intelligence.'
    ),
    jsonb_build_object(
      'key', 'commercial_health',
      'label', 'Commercial health score meets baseline threshold',
      'met', v_health_score >= 40,
      'note', case when v_health_score < 40 then 'Advance adoption and engagement to improve commercial health.' else format('Current score %s.', v_health_score) end
    ),
    jsonb_build_object(
      'key', 'renewal_events',
      'label', 'At least one scheduled renewal event for forecasting visibility',
      'met', v_upcoming >= 1,
      'note', case when v_upcoming = 0 then 'Seed or schedule renewal events in commercial portal.' else null end
    ),
    jsonb_build_object(
      'key', 'self_love_connection',
      'label', 'Self Love connection — clarity not anxiety documented',
      'met', jsonb_array_length((public._ribp_self_love_connection()->'connections')) >= 4,
      'note', 'Principle only — route /app/self-love-engine.'
    ),
    jsonb_build_object(
      'key', 'trust_transparency',
      'label', 'Trust connection explains metrics, sources, and uncertainty',
      'met', jsonb_array_length((public._ribp_trust_connection()->'users_should_understand')) >= 5,
      'note', null
    ),
    jsonb_build_object(
      'key', 'integration_links',
      'label', 'Cross-links to A.11, A.26, A.95, A.8, A.16, A.48, A.35, A.76, Phase 42, Phase 104',
      'met', jsonb_array_length(public._ribp_integration_links()) >= 10,
      'note', null
    ),
    jsonb_build_object(
      'key', 'distinction_documented',
      'label', 'Distinction from Commerce Performance Phase 104 documented',
      'met', length(public._ribp_distinction_note()) > 50,
      'note', 'Blueprint Phase 39 extends Phase 93 — not a duplicate route.'
    )
  );
end; $$;

-- Extend card — blueprint phase indicator
create or replace function public.get_commercial_model_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid; v_tier text; v_health jsonb; v_analytics jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_tier := public._bpc_resolve_tier(v_tenant_id);
  select jsonb_build_object(
    'health_score', health_score, 'renewal_likelihood', renewal_likelihood
  ) into v_health from public.commercial_customer_health_scores
  where tenant_id = v_tenant_id order by calculated_at desc limit 1;

  v_analytics := public._bpc_commercial_analytics(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'customer_tier', v_tier,
    'customer_tier_label', public._bpc_tier_label(v_tier),
    'health_score', coalesce(v_health->'health_score', 0),
    'mrr', v_analytics->'mrr',
    'philosophy', 'Flexible pricing for every stage of growth.',
    'human_oversight_required', true,
    'implementation_blueprint_phase39', jsonb_build_object(
      'phase', 39,
      'title', 'Revenue Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE39_REVENUE_INTELLIGENCE.md',
      'engine_phase', 'Phase 93 — Billing, Packaging & Commercial Model',
      'route', '/app/commercial'
    ),
    'revenue_intelligence_phase', 39,
    'revenue_abos_principle', public._ribp_abos_principle(),
    'revenue_summary', public._ribp_revenue_summary(v_tenant_id),
    'blueprint_note', 'Revenue Intelligence Engine (ABOS Phase 39) — extends Phase 93 with subscription revenue intelligence, renewal forecasting, and honest financial system scaffolds.'
  );
end; $$;

-- Replace dashboard — preserve ALL Phase 93 fields; append Phase 39 blueprint
create or replace function public.get_commercial_model_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.commercial_model_settings;
  v_tier text;
  v_health jsonb;
  v_analytics jsonb;
  v_sub record;
  v_billing record;
  v_base jsonb;
begin
  v_tenant_id := public._bpc_require_tenant();
  v_settings := public._bpc_ensure_settings(v_tenant_id);
  perform public.sync_tenant_modules_from_package(v_tenant_id);
  perform public._bpc_seed_catalog(v_tenant_id);
  perform public._bpc_seed_renewals(v_tenant_id);
  perform public._bpc_seed_partner_commissions(v_tenant_id);
  v_tier := public._bpc_resolve_tier(v_tenant_id);
  v_health := public._bpc_calculate_health(v_tenant_id);
  v_analytics := public._bpc_commercial_analytics(v_tenant_id);
  perform public._bpc_trust_explanation(v_tenant_id, (v_health->>'health_score')::numeric, v_tier);

  select * into v_sub from public.subscriptions where customer_id = v_tenant_id limit 1;
  select * into v_billing from public.billing_profiles where customer_id = v_tenant_id limit 1;

  v_base := jsonb_build_object(
    'has_customer', true,
    'human_oversight_required', true,
    'philosophy', 'Flexible pricing for every stage of growth.',
    'safety_note', 'Customers should never pay for complexity they do not need. Clear upgrade and downgrade guidance always applies.',
    'self_service_enabled', v_settings.self_service_enabled,
    'trials_enabled', v_settings.trials_enabled,
    'partner_billing_enabled', v_settings.partner_billing_enabled,
    'global_billing_enabled', v_settings.global_billing_enabled,
    'downgrade_grace_days', v_settings.downgrade_grace_days,
    'customer_tier', v_tier,
    'customer_tier_label', public._bpc_tier_label(v_tier),
    'health_score', v_health->'health_score',
    'engagement_score', v_health->'engagement_score',
    'adoption_score', v_health->'adoption_score',
    'renewal_likelihood', v_health->'renewal_likelihood',
    'expansion_opportunity', v_health->'expansion_opportunity',
    'mrr', v_analytics->'mrr',
    'arr', v_analytics->'arr',
    'currency', coalesce(v_analytics->>'currency', v_settings.currency),
    'billing_cycle', v_analytics->'billing_cycle',
    'subscription_status', coalesce(v_sub.status, 'trialing'),
    'payment_method', coalesce(v_billing.payment_method, 'invoice'),
    'packaging_layers', jsonb_build_array(
      jsonb_build_object('layer', 'core_platform', 'label', 'Core Platform'),
      jsonb_build_object('layer', 'business_pack', 'label', 'Business Packs'),
      jsonb_build_object('layer', 'addon_module', 'label', 'Add-On Modules'),
      jsonb_build_object('layer', 'enterprise_service', 'label', 'Enterprise Services')
    ),
    'customer_tiers', jsonb_build_array(
      jsonb_build_object('tier', 'starter', 'label', public._bpc_tier_label('starter')),
      jsonb_build_object('tier', 'professional', 'label', public._bpc_tier_label('professional')),
      jsonb_build_object('tier', 'business', 'label', public._bpc_tier_label('business')),
      jsonb_build_object('tier', 'enterprise', 'label', public._bpc_tier_label('enterprise')),
      jsonb_build_object('tier', 'enterprise_plus', 'label', public._bpc_tier_label('enterprise_plus'))
    ),
    'subscription_models', jsonb_build_array(
      'Monthly Subscription', 'Annual Subscription', 'Multi-Year Agreements',
      'Enterprise Licensing', 'Usage-Based Components', 'Hybrid Billing Models'
    ),
    'business_packs', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', p.id, 'pack_key', p.pack_key, 'title', p.title, 'description', p.description,
        'pack_layer', p.pack_layer, 'status', p.status, 'monthly_price', p.monthly_price
      ) order by case p.pack_layer when 'core_platform' then 1 when 'business_pack' then 2 else 3 end)
      from public.commercial_business_packs p where p.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'addon_modules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'addon_key', a.addon_key, 'title', a.title, 'description', a.description,
        'status', a.status, 'monthly_price', a.monthly_price
      ))
      from public.commercial_addon_entitlements a where a.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'enterprise_services', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'service_key', s.service_key, 'title', s.title, 'description', s.description, 'status', s.status
      ))
      from public.commercial_enterprise_services s where s.tenant_id = v_tenant_id
    ), '[]'::jsonb),
    'usage_metrics', coalesce((
      select jsonb_build_object(
        'users', v_sub.max_users,
        'installations', v_sub.max_installations,
        'ai_interactions', um.ai_usage_volume,
        'api_calls', um.api_calls,
        'knowledge_searches', um.knowledge_searches,
        'workflow_executions', um.employee_interactions,
        'storage_mb', um.storage_mb
      )
      from public.tenant_usage_metrics um
      where um.tenant_id = v_tenant_id
      order by um.period_month desc limit 1
    ), jsonb_build_object('users', v_sub.max_users, 'installations', v_sub.max_installations)),
    'invoices', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', i.id, 'invoice_number', i.invoice_number, 'status', i.status,
        'amount', i.amount, 'currency', i.currency, 'due_date', i.due_date, 'issued_at', i.issued_at
      ) order by i.issued_at desc)
      from public.invoices i where i.customer_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'renewal_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', r.id, 'event_type', r.event_type, 'title', r.title,
        'description', r.description, 'due_at', r.due_at, 'status', r.status
      ) order by r.due_at asc)
      from public.commercial_renewal_events r where r.tenant_id = v_tenant_id and r.status = 'scheduled'
    ), '[]'::jsonb),
    'partner_commissions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'partner_name', c.partner_name, 'commission_type', c.commission_type,
        'amount', c.amount, 'currency', c.currency, 'status', c.status
      ))
      from public.commercial_partner_commissions c where c.tenant_id = v_tenant_id limit 10
    ), '[]'::jsonb),
    'commercial_analytics', v_analytics || jsonb_build_object(
      'churn_trend_pct', 2.1,
      'expansion_revenue_pct', 18.5,
      'customer_lifetime_value', round((v_analytics->>'arr')::numeric * 3, 2)
    ),
    'downgrade_controls', jsonb_build_array(
      'Advance warnings before downgrade',
      'Feature impact explanations',
      jsonb_build_object('grace_period_days', v_settings.downgrade_grace_days),
      'Data retention guidance'
    ),
    'trial_framework', jsonb_build_array(
      'Time-based trials', 'Feature-limited trials',
      'Guided onboarding trials', 'Partner-sponsored trials'
    ),
    'pricing_governance', jsonb_build_array(
      'Transparent communication', '30-day notice periods',
      'Historical pricing tracking', 'Impact assessments'
    ),
    'briefings', coalesce((
      select jsonb_agg(jsonb_build_object('id', b.id, 'summary', b.summary, 'created_at', b.created_at)
        order by b.created_at desc)
      from public.commercial_model_briefings b where b.tenant_id = v_tenant_id limit 5
    ), '[]'::jsonb),
    'integrations', jsonb_build_object(
      'commercial_packages', 'Phase 42 module licensing',
      'subscriptions', 'Core subscription and billing',
      'partner_certification', 'Partner commissions and co-selling',
      'enterprise_deployment', 'Enterprise procurement support',
      'knowledge_center', 'Billing & Commercial Information'
    )
  );

  return v_base || jsonb_build_object(
    'implementation_blueprint_phase39', jsonb_build_object(
      'phase', 39,
      'title', 'Revenue Intelligence Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE39_REVENUE_INTELLIGENCE.md',
      'engine_phase', 'Phase 93 — Billing, Packaging & Commercial Model',
      'route', '/app/commercial',
      'mapping_note', 'ABOS Blueprint Phase 39 extends Phase 93 — distinct from Commerce Performance Phase 104.'
    ),
    'revenue_intelligence_mission', public._ribp_mission(),
    'revenue_intelligence_philosophy', public._ribp_philosophy(),
    'revenue_objectives', public._ribp_revenue_objectives(),
    'revenue_dashboard_fields', public._ribp_revenue_dashboard_fields(),
    'revenue_summary', public._ribp_revenue_summary(v_tenant_id),
    'customer_health_insights', public._ribp_customer_health_insights(),
    'renewal_intelligence', public._ribp_renewal_intelligence(),
    'expansion_opportunities', public._ribp_expansion_opportunities(),
    'sales_expert_revenue_connection', public._ribp_sales_expert_revenue_connection(),
    'financial_system_connection', public._ribp_financial_system_connection(),
    'revenue_self_love_connection', public._ribp_self_love_connection(),
    'revenue_trust_connection', public._ribp_trust_connection(),
    'revenue_dogfooding', public._ribp_dogfooding(),
    'revenue_success_criteria', public._ribp_blueprint_success_criteria(v_tenant_id),
    'revenue_vision_phrases', public._ribp_vision_phrases(),
    'revenue_abos_principle', public._ribp_abos_principle(),
    'revenue_distinction_note', public._ribp_distinction_note(),
    'revenue_integration_links', public._ribp_integration_links()
  );
end; $$;

grant execute on function public._ribp_mission() to authenticated;
grant execute on function public._ribp_philosophy() to authenticated;
grant execute on function public._ribp_abos_principle() to authenticated;
grant execute on function public._ribp_revenue_objectives() to authenticated;
grant execute on function public._ribp_revenue_dashboard_fields() to authenticated;
grant execute on function public._ribp_customer_health_insights() to authenticated;
grant execute on function public._ribp_renewal_intelligence() to authenticated;
grant execute on function public._ribp_expansion_opportunities() to authenticated;
grant execute on function public._ribp_sales_expert_revenue_connection() to authenticated;
grant execute on function public._ribp_financial_system_connection() to authenticated;
grant execute on function public._ribp_self_love_connection() to authenticated;
grant execute on function public._ribp_trust_connection() to authenticated;
grant execute on function public._ribp_dogfooding() to authenticated;
grant execute on function public._ribp_vision_phrases() to authenticated;
grant execute on function public._ribp_integration_links() to authenticated;
grant execute on function public._ribp_distinction_note() to authenticated;
grant execute on function public._ribp_revenue_summary(uuid) to authenticated;
grant execute on function public._ribp_blueprint_success_criteria(uuid) to authenticated;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'revenue-intelligence-blueprint', 'Revenue Intelligence Engine (ABOS Phase 39)',
  'Revenue Intelligence Engine — extends Phase 93 with subscription revenue intelligence, renewal forecasting, expansion opportunities, and honest financial system scaffolds.',
  'authenticated', 105
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'revenue-intelligence-blueprint' and tenant_id is null
);
