-- Implementation Blueprint Phase 48 — Sales Operations & Business Management Engine
-- Extends Sales Expert Operating System (Phase A.95 + Phase 41 + Phase 45 + Phase 46 + Phase 42).

create table if not exists public.sales_expert_business_goals (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  goal_key text not null,
  target_value numeric,
  period text not null default 'monthly' check (period in ('weekly', 'monthly', 'quarterly', 'annual')),
  status text not null default 'active' check (status in ('active', 'paused', 'achieved', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, goal_key, period)
);

create index if not exists sales_expert_business_goals_org_idx
  on public.sales_expert_business_goals (organization_id, status);

alter table public.sales_expert_business_goals enable row level security;
revoke all on public.sales_expert_business_goals from authenticated, anon;

create or replace function public._sobmbp_distinction_note()
returns text language sql immutable as $$
  select 'Distinct from Value Realization Engine Phase A.48 at /app/value-realization-engine (tenant outcome measurement, baselines, milestones — migration 20260824000000_value_realization_engine_phase_a48.sql). Implementation Blueprint Phase 48 Sales Operations & Business Management extends Sales Expert OS A.95 Operations tab at /app/sales-expert-engine for independent partner business visibility. Cross-links Revenue Intelligence Phase 39 /app/commercial, Performance Phase 41, Renewal Phase 44, Goals OKR A.65, Personal Productivity A.70, Resource Planning A.63 capacity scaffold, Self Love A.76, and portal independent-business notice. Forecasts inform — never pressure.';
$$;

create or replace function public._sobmbp_blueprint_objectives()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'revenue_visibility', 'label', 'Revenue visibility', 'description', 'Implementation revenue, commission estimates, and commercial partner metadata — tenant scoped'),
    jsonb_build_object('key', 'goal_management', 'label', 'Goal management', 'description', 'Realistic monthly customer, revenue, certification, and learning aspirations'),
    jsonb_build_object('key', 'capacity_awareness', 'label', 'Capacity awareness', 'description', 'Sustainable pacing — overload and preparation companion examples'),
    jsonb_build_object('key', 'forecasting_support', 'label', 'Forecasting support', 'description', 'Informative metadata trends — never pressure or guilt'),
    jsonb_build_object('key', 'service_tracking', 'label', 'Service tracking', 'description', 'Implementations, training sessions, outstanding invoice scaffolds, obligations'),
    jsonb_build_object('key', 'operational_awareness', 'label', 'Operational awareness', 'description', 'Active customers, opportunities, follow-ups, and support obligations at a glance')
  );
$$;

create or replace function public._sobmbp_blueprint_business_dashboard_fields()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'implementation_revenue_estimate', 'label', 'Implementation revenue estimate'),
    jsonb_build_object('key', 'commission_estimates', 'label', 'Commission estimates'),
    jsonb_build_object('key', 'active_customers', 'label', 'Active customers'),
    jsonb_build_object('key', 'active_opportunities', 'label', 'Active opportunities'),
    jsonb_build_object('key', 'support_obligations', 'label', 'Support obligations'),
    jsonb_build_object('key', 'customers_onboarding', 'label', 'Customers onboarding'),
    jsonb_build_object('key', 'trends_note', 'label', 'Trends (metadata)')
  );
$$;

create or replace function public._sobmbp_ensure_business_goals(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (
    select 1 from public.sales_expert_business_goals g where g.organization_id = p_organization_id
  ) then
    return;
  end if;
  insert into public.sales_expert_business_goals (organization_id, goal_key, target_value, period, status, metadata)
  values
    (p_organization_id, 'monthly_new_customers', 2, 'monthly', 'active', '{"label":"New customers per month","realistic_note":"Start small — sustainable growth over pressure."}'::jsonb),
    (p_organization_id, 'monthly_revenue_aspiration', 50000, 'monthly', 'active', '{"label":"Revenue aspiration (NOK)","currency":"NOK","realistic_note":"Includes consulting and implementation — you set your own rates."}'::jsonb),
    (p_organization_id, 'certification_progress', 1, 'quarterly', 'active', '{"label":"Certification modules completed","route":"/app/certification-achievement-engine"}'::jsonb),
    (p_organization_id, 'learning_sessions', 4, 'monthly', 'active', '{"label":"Learning sessions","route":"/app/learning-training-engine","realistic_note":"Continuous learning — not cramming."}'::jsonb)
  on conflict (organization_id, goal_key, period) do nothing;
end; $$;

create or replace function public._sobmbp_business_goals_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._sobmbp_ensure_business_goals(p_organization_id);
  return jsonb_build_object(
    'status', 'metadata_scaffold',
    'principle', 'Realistic goals scaffold — you adjust targets; Aipify informs, never dictates outcomes.',
    'goals', coalesce((
      select jsonb_agg(jsonb_build_object(
        'goal_key', g.goal_key,
        'target_value', g.target_value,
        'period', g.period,
        'status', g.status,
        'metadata', g.metadata
      ) order by g.goal_key)
      from public.sales_expert_business_goals g
      where g.organization_id = p_organization_id and g.status in ('active', 'paused')
    ), '[]'::jsonb),
    'goals_okr_route', '/app/goals-okr-engine',
    'privacy_note', 'Goal metadata only — no customer PII.'
  );
exception when others then
  return jsonb_build_object('status', 'metadata_scaffold', 'goals', '[]'::jsonb);
end; $$;

create or replace function public._sobmbp_operations_summary(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_engagement jsonb;
  v_commercial jsonb;
  v_impl_revenue numeric := 0;
  v_training_revenue numeric := 0;
  v_support_obligations int := 0;
  v_onboarding int := 0;
  v_scheduled_follow_ups int := 0;
begin
  v_engagement := public._seos_engagement_summary(p_organization_id);
  v_commercial := public._seos_commercial_commission_summary(p_organization_id);

  select coalesce(sum(amount), 0) into v_impl_revenue
  from public.organization_sales_expert_commissions c
  where c.organization_id = p_organization_id
    and c.commission_type in ('implementation', 'consulting')
    and c.status in ('paid', 'pending', 'approved');

  select coalesce(sum(amount), 0) into v_training_revenue
  from public.organization_sales_expert_commissions c
  where c.organization_id = p_organization_id
    and c.commission_type = 'training'
    and c.status in ('paid', 'pending', 'approved');

  select count(*) into v_support_obligations
  from public.organization_sales_expert_follow_ups f
  where f.organization_id = p_organization_id
    and f.status = 'scheduled'
    and f.scheduled_for <= now() + interval '30 days';

  select count(*) into v_onboarding
  from public.organization_sales_expert_customers c
  where c.organization_id = p_organization_id and c.status = 'onboarding';

  select count(*) into v_scheduled_follow_ups
  from public.organization_sales_expert_follow_ups f
  where f.organization_id = p_organization_id and f.status = 'scheduled';

  return jsonb_build_object(
    'implementation_revenue_estimate', v_impl_revenue,
    'training_revenue_estimate', v_training_revenue,
    'commission_estimates', jsonb_build_object(
      'pending', v_engagement->'monthly_commissions_pending',
      'paid', v_engagement->'monthly_commissions_paid',
      'forecasted', v_engagement->'forecasted_commissions',
      'lifetime', v_engagement->'lifetime_subscription_value'
    ),
    'active_customers', v_engagement->'active_customers',
    'active_opportunities', v_engagement->'active_opportunities',
    'upcoming_follow_ups', v_engagement->'upcoming_follow_ups',
    'scheduled_follow_ups', v_scheduled_follow_ups,
    'support_obligations', v_support_obligations,
    'customers_onboarding', v_onboarding,
    'commercial_partner_commissions', v_commercial,
    'trends_note', 'Metadata trends only — forecasts inform planning, never pressure.',
    'currency', 'NOK',
    'supported_currencies', jsonb_build_array('NOK', 'EUR', 'USD', 'SEK', 'DKK'),
    'privacy_note', 'Business dashboard metadata from _seos_* summary and commercial partner commissions — no customer PII.'
  );
end; $$;

create or replace function public._sobmbp_blueprint_goal_management()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Realistic aspirations — monthly customers, revenue goals, certification progress, and learning sessions.',
    'goal_keys', jsonb_build_array(
      jsonb_build_object('key', 'monthly_new_customers', 'label', 'New customers per month', 'suggested_start', 1),
      jsonb_build_object('key', 'monthly_revenue_aspiration', 'label', 'Revenue aspiration', 'currency', 'NOK'),
      jsonb_build_object('key', 'certification_progress', 'label', 'Certification modules', 'route', '/app/certification-achievement-engine'),
      jsonb_build_object('key', 'learning_sessions', 'label', 'Learning sessions', 'route', '/app/learning-training-engine')
    ),
    'table', 'sales_expert_business_goals',
    'boundary', 'Goal scaffolds — Sales Experts set and adjust their own targets.'
  );
$$;

create or replace function public._sobmbp_blueprint_capacity_awareness()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Sustainable business pacing — capacity awareness prevents overload.',
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🌹', 'key', 'overload', 'example', 'You have several onboarding projects — consider spacing implementations for quality and wellbeing.'),
      jsonb_build_object('emoji', '❤️', 'key', 'preparation', 'example', 'Block preparation time before training sessions — sustainable experts deliver better outcomes.'),
      jsonb_build_object('emoji', '🦉', 'key', 'capacity_check', 'example', 'Before accepting new opportunities, review follow-ups and onboarding load — it is okay to defer.')
    ),
    'resource_planning_route', '/app/resource-planning-engine',
    'resource_planning_note', 'Resource Planning A.63 capacity scaffold — cross-link, not duplicate engine.',
    'personal_productivity_route', '/app/personal-productivity-engine',
    'personal_productivity_note', 'Personal Productivity A.70 — focus blocks and sustainable pacing.'
  );
$$;

create or replace function public._sobmbp_blueprint_service_tracking()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Track implementations, training, and obligations — metadata scaffolds for independent businesses.',
    'categories', jsonb_build_array(
      jsonb_build_object('key', 'implementations', 'label', 'Implementations in progress', 'source', 'organization_sales_expert_customers.onboarding'),
      jsonb_build_object('key', 'training_sessions', 'label', 'Training sessions', 'source', 'commission_type training metadata'),
      jsonb_build_object('key', 'outstanding_invoices', 'label', 'Outstanding invoices', 'status', 'metadata_scaffold', 'note', 'Consulting invoice tracking scaffold — you invoice customers independently'),
      jsonb_build_object('key', 'support_obligations', 'label', 'Support obligations', 'source', 'organization_sales_expert_follow_ups scheduled')
    ),
    'independent_business_note', 'You operate an independent business — Aipify provides visibility scaffolds, not accounting replacement.',
    'renewal_cross_link', 'Renewal conversations Phase 44 — relationship-focused, not pressure.'
  );
$$;

create or replace function public._sobmbp_blueprint_forecasting_support()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Forecasts inform planning — never pressure. Metadata trends from commissions and pipeline.',
    'companion_examples', jsonb_build_array(
      jsonb_build_object('emoji', '🦉', 'key', 'trend_context', 'example', 'Commission trends suggest a quieter month ahead — a good time for learning and certification.'),
      jsonb_build_object('emoji', '🔔', 'key', 'gentle_reminder', 'example', 'Forecasted commissions are estimates — adjust plans without guilt if reality differs.')
    ),
    'signals', jsonb_build_array(
      jsonb_build_object('key', 'forecasted_commissions', 'label', 'Forecasted commissions', 'source', '_seos_engagement_summary'),
      jsonb_build_object('key', 'pipeline_value', 'label', 'Open pipeline metadata', 'source', 'organization_sales_expert_opportunities'),
      jsonb_build_object('key', 'retention_trends', 'label', 'Retention trends', 'source', '_sprbp_milestone_progress retention_rate_pct')
    ),
    'revenue_intelligence_route', '/app/commercial',
    'revenue_intelligence_note', 'Blueprint Phase 39 Revenue Intelligence on Commercial dashboard — partner commission context.',
    'tone', 'inform_not_pressure'
  );
$$;

create or replace function public._sobmbp_blueprint_self_love_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Building an independent Aipify business takes time — sustainable pacing and self-respect matter.',
    'examples', jsonb_build_array(
      jsonb_build_object('emoji', '❤️', 'example', 'Growth at a humane pace is success — compare to your own progress, not others.'),
      jsonb_build_object('emoji', '❤️', 'example', 'It is okay to pause new sales when onboarding quality needs your full attention.')
    ),
    'portal_notice_cross_link', 'Sales Expert portal notice — independent business welcome messaging',
    'route', '/app/self-love-engine',
    'boundary', 'Self Love A.76 influences operations tone — encouragement only, never guilt.'
  );
$$;

create or replace function public._sobmbp_blueprint_trust_connection()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'principle', 'Transparent forecast assumptions — metadata only, honest about scaffolds.',
    'experts_should_understand', jsonb_build_array(
      'Operations dashboard derives from _seos_* customer, commission, opportunity, and follow-up metadata',
      'Commercial partner commissions (Phase 93) are subscription-linked metadata — distinct from your consulting invoices',
      'Forecasted commissions are estimates — not guarantees or pressure targets',
      'Outstanding invoice tracking is scaffold metadata — you maintain your own accounting',
      'Value Realization A.48 measures tenant outcomes — not Sales Expert independent business operations',
      'Revenue Intelligence Phase 39 on /app/commercial complements partner commission visibility'
    ),
    'metadata_only', true,
    'forecast_assumptions_note', 'Forecasts use pending and forecasted commission records — assumptions documented, never hidden.'
  );
$$;

create or replace function public._sobmbp_blueprint_dogfooding()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'aipify_group', jsonb_build_object(
      'role', 'Aipify Group Sales Experts validate operations dashboard fields, goal scaffolds, and forecast tone internally first',
      'focus', jsonb_build_array('Independent business messaging', 'Capacity awareness copy', 'Forecast inform-not-pressure language', 'Cross-link accuracy')
    ),
    'future_pilot', jsonb_build_object(
      'role', 'Pilot Sales Experts test business goal defaults and service tracking scaffolds before broader partner rollout',
      'note', 'Dogfooding ensures operations visibility never replaces professional judgment or accounting'
    )
  );
$$;

create or replace function public._sobmbp_blueprint_vision_phrases()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'Independent Sales Experts build sustainable businesses — visibility supports planning, not pressure.',
    'Forecasts inform; humans decide. Metadata trends are guides, not guilt triggers.',
    'Capacity awareness protects quality — preparation and pacing beat overload.'
  );
$$;

create or replace function public._sobmbp_blueprint_integration_links()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    jsonb_build_object('key', 'customers_tab', 'label', 'Customers tab', 'route', '/app/sales-expert-engine', 'note', 'Active customer records and onboarding progress'),
    jsonb_build_object('key', 'commissions_tab', 'label', 'Commission Overview tab', 'route', '/app/sales-expert-engine', 'note', 'Pending, paid, and forecasted commissions'),
    jsonb_build_object('key', 'opportunities_tab', 'label', 'Opportunities tab', 'route', '/app/sales-expert-engine', 'note', 'Open pipeline metadata'),
    jsonb_build_object('key', 'revenue_intelligence', 'label', 'Revenue Intelligence Phase 39', 'route', '/app/commercial', 'note', 'Commercial partner commissions and revenue context'),
    jsonb_build_object('key', 'performance_recognition', 'label', 'Performance Phase 41', 'route', '/app/sales-expert-engine', 'note', 'Milestones and recognition — complementary visibility'),
    jsonb_build_object('key', 'renewal', 'label', 'Renewal Phase 44', 'route', '/app/sales-expert-engine', 'note', 'Relationship-focused renewal conversations'),
    jsonb_build_object('key', 'goals_okr', 'label', 'Goals OKR A.65', 'route', '/app/goals-okr-engine', 'note', 'Organizational goals — distinct from partner business goal scaffolds'),
    jsonb_build_object('key', 'personal_productivity', 'label', 'Personal Productivity A.70', 'route', '/app/personal-productivity-engine', 'note', 'Focus and sustainable pacing'),
    jsonb_build_object('key', 'resource_planning', 'label', 'Resource Planning A.63', 'route', '/app/resource-planning-engine', 'note', 'Capacity scaffold cross-link'),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine', 'note', 'Sustainable independent business pacing'),
    jsonb_build_object('key', 'value_realization', 'label', 'Value Realization A.48', 'route', '/app/value-realization-engine', 'note', 'Tenant outcome measurement — NOT this blueprint')
  );
$$;

create or replace function public._sobmbp_blueprint_success_criteria(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_ops jsonb;
  v_goals jsonb;
  v_goal_count int := 0;
begin
  v_ops := public._sobmbp_operations_summary(p_organization_id);
  v_goals := public._sobmbp_business_goals_summary(p_organization_id);
  v_goal_count := jsonb_array_length(coalesce(v_goals->'goals', '[]'::jsonb));

  return jsonb_build_array(
    jsonb_build_object('key', 'operations_summary', 'label', 'Operations summary from _seos_* engagement data', 'met', (v_ops->>'active_customers') is not null, 'note', null),
    jsonb_build_object('key', 'business_dashboard_fields', 'label', 'Business dashboard fields documented', 'met', jsonb_array_length(public._sobmbp_blueprint_business_dashboard_fields()) >= 7, 'note', null),
    jsonb_build_object('key', 'goal_scaffold', 'label', 'Business goals table and realistic defaults', 'met', v_goal_count >= 4, 'note', format('%s default goals seeded.', v_goal_count)),
    jsonb_build_object('key', 'capacity_awareness', 'label', 'Capacity companion examples documented', 'met', jsonb_array_length(public._sobmbp_blueprint_capacity_awareness()->'companion_examples') >= 3, 'note', null),
    jsonb_build_object('key', 'service_tracking', 'label', 'Service tracking scaffolds documented', 'met', jsonb_array_length(public._sobmbp_blueprint_service_tracking()->'categories') >= 4, 'note', null),
    jsonb_build_object('key', 'forecast_inform', 'label', 'Forecasting support uses inform-not-pressure tone', 'met', (public._sobmbp_blueprint_forecasting_support()->>'tone') = 'inform_not_pressure', 'note', null),
    jsonb_build_object('key', 'trust_forecast', 'label', 'Trust connection documents forecast assumptions', 'met', (public._sobmbp_blueprint_trust_connection()->>'forecast_assumptions_note') is not null, 'note', null),
    jsonb_build_object('key', 'self_love', 'label', 'Self Love connection for sustainable pacing', 'met', (public._sobmbp_blueprint_self_love_connection()->>'route') is not null, 'note', null),
    jsonb_build_object('key', 'value_realization_distinction', 'label', 'Value Realization A.48 collision documented', 'met', public._sobmbp_distinction_note() like '%Value Realization Engine Phase A.48%', 'note', null),
    jsonb_build_object('key', 'independent_business', 'label', 'Independent business messaging aligned with portal notice', 'met', (public._sobmbp_blueprint_service_tracking()->>'independent_business_note') is not null, 'note', null)
  );
end; $$;





-- Extend dashboard — preserve ALL prior fields; append Phase 49 + restore Phase 43 engagement block
create or replace function public.get_sales_expert_operating_system_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_sales_expert_settings;
  v_summary jsonb;
  v_base jsonb;
begin
  perform public._irp_require_permission('sales_expert.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._seos_ensure_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  perform public._sebbp_ensure_booking_settings(v_org_id);
  perform public._sobmbp_ensure_business_goals(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);

  v_base := jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Sales Expert Operating System — partner portal for pipeline, commissions, training, and one-to-one follow-up. Metadata only — no mass email.',
    'principles', jsonb_build_array(
      'Official partner tiers — never Affiliate publicly',
      'Aipify subscription: Customer ↔ Aipify; consulting: Customer ↔ Sales Expert',
      'One-to-one email only — mass campaigns explicitly not supported',
      'Human approval for sensitive commission and program changes',
      'Metadata only — no raw email bodies or customer PII in logs'
    ),
    'privacy_note', 'Customer org names and commission metadata only — no email content or PII stored.',
    'engine_phase', 'A.95',
    'implementation_blueprint', jsonb_build_object(
      'phase', '33-extension',
      'title', 'Sales Expert Operating System',
      'engine_phase', 'A.95',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE33_SALES_EXPERT_OPERATING_SYSTEM.md',
      'parent', 'IMPLEMENTATION_BLUEPRINT_PHASE33_PARTNER_EXPERT_NETWORK.md'
    ),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', v_summary,
    'sections', jsonb_build_object(
      'dashboard', jsonb_build_object(
        'revenue_overview', v_summary,
        'monthly_commissions', jsonb_build_object(
          'pending', v_summary->'monthly_commissions_pending',
          'paid', v_summary->'monthly_commissions_paid',
          'forecasted', v_summary->'forecasted_commissions'
        ),
        'lifetime_subscription_value', v_summary->'lifetime_subscription_value',
        'upcoming_follow_ups', v_summary->'upcoming_follow_ups',
        'active_opportunities', v_summary->'active_opportunities'
      ),
      'customers', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id, 'org_name', c.org_name, 'status', c.status,
          'subscription_status', c.subscription_status,
          'onboarding_progress', c.onboarding_progress,
          'next_follow_up', c.next_follow_up,
          'notes_metadata', c.notes_metadata
        ) order by c.next_follow_up nulls last)
        from public.organization_sales_expert_customers c
        where c.organization_id = v_org_id limit 50
      ), '[]'::jsonb),
      'opportunities', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', o.id, 'title', o.title, 'pipeline_stage', o.pipeline_stage,
          'estimated_value', o.estimated_value, 'currency', o.currency,
          'next_action', o.next_action, 'recommended_action', o.recommended_action,
          'status', o.status, 'customer_id', o.customer_id
        ) order by
          case o.pipeline_stage
            when 'negotiation' then 0 when 'proposal' then 1 when 'demo' then 2 else 3 end)
        from public.organization_sales_expert_opportunities o
        where o.organization_id = v_org_id and o.status = 'open' limit 50
      ), '[]'::jsonb),
      'commissions', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', c.id, 'commission_type', c.commission_type, 'amount', c.amount,
          'currency', c.currency, 'status', c.status,
          'subscription_plan_key', c.subscription_plan_key, 'period_month', c.period_month
        ) order by c.period_month desc)
        from public.organization_sales_expert_commissions c
        where c.organization_id = v_org_id limit 50
      ), '[]'::jsonb),
      'email_templates', coalesce((
        select jsonb_agg(jsonb_build_object(
          'template_key', t.template_key, 'title', t.title,
          'subject_pattern', t.subject_pattern, 'category', t.category,
          'placeholders', t.placeholders
        ) order by t.template_key)
        from public.organization_sales_expert_email_templates t
        where t.organization_id = v_org_id
      ), '[]'::jsonb),
      'emails', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', e.id, 'template_key', e.template_key, 'subject_metadata', e.subject_metadata,
          'status', e.status, 'delivery_mode', e.delivery_mode,
          'scheduled_for', e.scheduled_for, 'sent_at', e.sent_at
        ) order by e.created_at desc)
        from public.organization_sales_expert_emails e
        where e.organization_id = v_org_id limit 30
      ), '[]'::jsonb),
      'follow_ups', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', f.id, 'cadence_days', f.cadence_days, 'template_key', f.template_key,
          'scheduled_for', f.scheduled_for, 'status', f.status, 'customer_id', f.customer_id
        ) order by f.scheduled_for)
        from public.organization_sales_expert_follow_ups f
        where f.organization_id = v_org_id limit 30
      ), '[]'::jsonb)
    ),
    'official_terminology', public._seos_blueprint_official_terminology(),
    'portal_sections', public._seos_blueprint_portal_sections(),
    'blueprint_email_templates', public._seos_blueprint_email_templates_list(),
    'follow_up_cadences', public._seos_blueprint_follow_up_cadences(),
    'implementation_services', public._seos_blueprint_implementation_services_pricing(),
    'subscription_principles', public._seos_blueprint_subscription_principles(),
    'commercial_commission_summary', public._seos_commercial_commission_summary(v_org_id),
    'mass_email_supported', false,
    'integration_links', jsonb_build_array(
      jsonb_build_object('key', 'marketplace_ecosystem', 'label', 'Partner Ecosystem A.45', 'route', '/app/marketplace-partner-ecosystem-foundation-engine'),
      jsonb_build_object('key', 'partners', 'label', 'Partner Certification Phase 91', 'route', '/app/partners'),
      jsonb_build_object('key', 'learning_training', 'label', 'Learning & Training A.36', 'route', '/app/learning-training-engine'),
      jsonb_build_object('key', 'certification', 'label', 'Certification & Achievement A.37', 'route', '/app/certification-achievement-engine'),
      jsonb_build_object('key', 'partner_success', 'label', 'Partner Success A.73', 'route', '/app/partner-success-engine'),
      jsonb_build_object('key', 'gratitude_recognition', 'label', 'Gratitude & Recognition A.89', 'route', '/app/gratitude-recognition-engine'),
      jsonb_build_object('key', 'self_love', 'label', 'Self Love A.76', 'route', '/app/self-love-engine')
    ),
    'training_center', jsonb_build_object(
      'foundations_route', '/app/learning-training-engine',
      'certification_route', '/app/certification-achievement-engine',
      'demo_simulations_note', 'Demo simulations scaffold — metadata only',
      'product_updates_note', 'Product update briefings via Notification Engine — metadata cross-link'
    ),
    'resource_library', jsonb_build_object(
      'status', 'metadata_scaffold',
      'categories', jsonb_build_array('Marketing materials', 'Playbooks', 'Product sheets', 'Templates', 'Case studies'),
      'privacy_note', 'Resource metadata only — assets stored in approved KC or partner program surfaces.'
    ),
    'distinction_note', public._seos_distinction_note()
  );

  return v_base || jsonb_build_object(
    'implementation_blueprint_phase41', jsonb_build_object(
      'phase', 41,
      'title', 'Sales Performance & Recognition Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE41_SALES_PERFORMANCE_RECOGNITION.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — cross-links Gratitude & Recognition A.89 Phase 9, not a duplicate engine.'
    ),
    'performance_recognition_mission', 'Help Sales Experts maintain momentum, celebrate achievements, and build sustainable businesses around Aipify.',
    'performance_recognition_philosophy', 'Recognition strengthens motivation. Competition should inspire growth. Success should never come at the expense of integrity.',
    'performance_recognition_abos_principle', 'People thrive when their efforts are noticed. Recognition should reinforce values, not ego.',
    'performance_objectives', public._sprbp_blueprint_objectives(),
    'performance_dashboard_fields', public._sprbp_blueprint_performance_dashboard_fields(),
    'performance_summary', public._sprbp_performance_summary(v_org_id),
    'milestone_recognition', public._sprbp_blueprint_milestones(),
    'milestone_progress', public._sprbp_milestone_progress(v_org_id),
    'bell_moments', public._sprbp_blueprint_bell_moments(),
    'recognition_roses', public._sprbp_blueprint_recognition_roses(),
    'leaderboards', public._sprbp_blueprint_leaderboards(),
    'performance_self_love_connection', public._sprbp_blueprint_self_love_connection(),
    'performance_trust_connection', public._sprbp_blueprint_trust_connection(),
    'performance_dogfooding', public._sprbp_blueprint_dogfooding(),
    'performance_vision_phrases', public._sprbp_blueprint_vision_phrases(),
    'performance_integration_links', public._sprbp_blueprint_integration_links(),
    'performance_blueprint_success_criteria', public._sprbp_blueprint_success_criteria(v_org_id),
    'performance_distinction_note', public._sprbp_distinction_note()
  ) || jsonb_build_object(
    'implementation_blueprint_phase45', jsonb_build_object(
      'phase', 45,
      'title', 'Sales Coach & Enablement Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE45_SALES_COACH_ENABLEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Coach & Enablement tab; cross-links Phase 41 bell moments without duplication.'
    ),
    'sales_coach_mission', 'Equip Sales Experts with supportive coaching, enablement guidance, and sustainable pacing — never punitive judgment.',
    'sales_coach_philosophy', 'Coaching strengthens confidence. Guidance should inspire thoughtful action. Success should never come at the expense of wellbeing or integrity.',
    'sales_coach_abos_principle', 'People thrive when they feel equipped and respected. Coaching should reinforce professional growth, not pressure.',
    'sales_companion_roles', public._scebp_blueprint_companion_roles(),
    'sales_coach_dashboard_fields', public._scebp_blueprint_coach_dashboard_fields(),
    'sales_coach_summary', public._scebp_coach_summary(v_org_id),
    'daily_sales_briefing', public._scebp_daily_briefing(v_org_id),
    'sales_activity_recommendations', public._scebp_activity_recommendations(v_org_id),
    'field_sales_coaching', public._scebp_blueprint_field_sales_coaching(),
    'demonstration_guidance', public._scebp_blueprint_demonstration_guidance(),
    'objection_handling_library', public._scebp_blueprint_objection_handling_library(),
    'communication_coaching', public._scebp_blueprint_communication_coaching(),
    'personal_performance_insights', public._scebp_performance_insights(v_org_id),
    'sales_coach_self_love_connection', public._scebp_blueprint_self_love_connection(),
    'sales_coach_bell_moments', public._scebp_blueprint_bell_moments(),
    'sales_training_integration', public._scebp_blueprint_sales_training_integration(),
    'roleplay_simulation', public._scebp_blueprint_roleplay_simulation(),
    'sales_coach_trust_connection', public._scebp_blueprint_trust_connection(),
    'sales_coach_dogfooding', public._scebp_blueprint_dogfooding(),
    'sales_coach_success_criteria', public._scebp_blueprint_success_criteria(v_org_id),
    'sales_coach_vision_phrases', public._scebp_blueprint_vision_phrases(),
    'sales_coach_distinction_note', public._scebp_distinction_note(),
    'sales_coach_integration_links', public._scebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase46', jsonb_build_object(
      'phase', 46,
      'title', 'Sales Coach Certification & Field Enablement Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE46_SALES_COACH_CERTIFICATION_FIELD_ENABLEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Certification & Field Enablement tab; cross-links A.37, A.36, Phase 91, Phase 45 coach tab.'
    ),
    'sales_certification_mission', 'Develop competent professionals — training strengthens confidence; certification reflects genuine competence.',
    'sales_certification_philosophy', 'Assessment encourages growth, not fear. Mastery not exclusion. Field enablement supports excellence at a sustainable pace.',
    'sales_certification_abos_principle', 'Aipify Business Operating System (ABOS) partners grow through genuine capability — certification means readiness to help organizations work smarter.',
    'sales_training_pathway', public._sccfebp_blueprint_sales_training_pathway(),
    'sales_simulation_engine', public._sccfebp_blueprint_sales_simulation_engine(),
    'telephone_sales_coaching', public._sccfebp_blueprint_telephone_sales_coaching(),
    'assessment_principles', public._sccfebp_blueprint_assessment_principles(),
    'certification_requirements', public._sccfebp_blueprint_certification_requirements(),
    'reassessment_principles', public._sccfebp_blueprint_reassessment_principles(),
    'certification_display', public._sccfebp_blueprint_certification_display(),
    'email_enablement_center', public._sccfebp_blueprint_email_enablement_center(),
    'implementation_pricing_guidance', public._sccfebp_blueprint_implementation_pricing_guidance(),
    'installation_experience_journey', public._sccfebp_blueprint_installation_experience_journey(),
    'field_sales_enablement', public._sccfebp_blueprint_field_sales_enablement(),
    'sales_performance_culture', public._sccfebp_blueprint_sales_performance_culture(),
    'sales_certification_summary', public._sccfebp_certification_summary(v_org_id),
    'sales_certification_self_love_connection', public._sccfebp_blueprint_self_love_connection(),
    'sales_certification_trust_connection', public._sccfebp_blueprint_trust_connection(),
    'sales_certification_dogfooding', public._sccfebp_blueprint_dogfooding(),
    'sales_certification_success_criteria', public._sccfebp_blueprint_success_criteria(v_org_id),
    'sales_certification_vision_phrases', public._sccfebp_blueprint_vision_phrases(),
    'sales_certification_distinction_note', public._sccfebp_distinction_note(),
    'sales_certification_integration_links', public._sccfebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'sales_expert_marketing_center', public._seosmc_marketing_center_bundle(v_org_id)
  ) || jsonb_build_object(
    'implementation_blueprint_phase42', jsonb_build_object(
      'phase', 42,
      'title', 'Sales Demo & Experience Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE42_SALES_DEMO_EXPERIENCE.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Demo tab; cross-links Coach Phase 45/46, Certification Module 4, Simulation Lab Phase 78 (NOT sales demos).'
    ),
    'sales_demo_mission', 'Help Sales Experts deliver outcome-focused demonstrations that help prospects envision a better future.',
    'sales_demo_philosophy', 'People invest in outcomes, not features. Demos should inspire confidence through honest, tailored storytelling.',
    'sales_demo_objectives', public._sdebp_blueprint_objectives(),
    'demo_environments', public._sdebp_blueprint_demo_environments(),
    'demo_data_examples', public._sdebp_blueprint_demo_data_examples(),
    'industry_demonstrations', public._sdebp_blueprint_industry_demonstrations(),
    'demo_guidance', public._sdebp_blueprint_demo_guidance(),
    'discovery_question_library', public._sdebp_blueprint_discovery_question_library(),
    'demo_flow_structure', public._sdebp_blueprint_demo_flow_structure(),
    'custom_demo_experiences', public._sdebp_blueprint_custom_demo_experiences(),
    'demo_links_scaffold', public._sdebp_blueprint_demo_links_scaffold(),
    'demo_links_summary', public._sdebp_demo_links_summary(v_org_id),
    'companion_demo_experience', public._sdebp_blueprint_companion_demo_experience(),
    'sales_demo_self_love_connection', public._sdebp_blueprint_self_love_connection(),
    'sales_demo_trust_connection', public._sdebp_blueprint_trust_connection(),
    'sales_demo_dogfooding', public._sdebp_blueprint_dogfooding(),
    'sales_demo_success_criteria', public._sdebp_blueprint_success_criteria(v_org_id),
    'sales_demo_vision_phrases', public._sdebp_blueprint_vision_phrases(),
    'sales_demo_abos_principle', 'Aipify Business Operating System (ABOS) demos show how operational AI augments people — humans decide, Aipify informs and prepares.',
    'sales_demo_distinction_note', public._sdebp_distinction_note(),
    'sales_demo_integration_links', public._sdebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase43', jsonb_build_object(
      'phase', 43,
      'title', 'Sales Engagement & Booking Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE43_SALES_ENGAGEMENT_BOOKING.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Engagement & Booking tab; cross-links Context Engine calendars, Coach 45/46, Unified Tasks A.62, Meeting Collaboration A.61, Self Love A.76.'
    ),
    'engagement_mission', 'Help Sales Experts schedule meetings professionally, follow up consistently, and prepare thoughtfully — trust through consistency.',
    'engagement_philosophy', 'Follow-up demonstrates professionalism. Booking should feel personal and respectful — never pressure or mass outreach.',
    'engagement_abos_principle', 'Aipify Business Operating System (ABOS) partners build trust through prepared, consistent engagement — humans decide; Aipify informs and prepares.',
    'engagement_objectives', public._sebbp_blueprint_objectives(),
    'booking_center', public._sebbp_blueprint_booking_center(),
    'calendar_integrations', public._sebbp_blueprint_calendar_integrations(),
    'discovery_meetings', public._sebbp_blueprint_discovery_meetings(),
    'demonstration_bookings', public._sebbp_blueprint_demonstration_bookings(),
    'follow_up_engagement', public._sebbp_blueprint_follow_up_engagement(),
    'meeting_preparation', public._sebbp_blueprint_meeting_preparation(),
    'engagement_history', public._sebbp_engagement_history(v_org_id),
    'engagement_summary', public._sebbp_engagement_summary(v_org_id),
    'engagement_self_love_connection', public._sebbp_blueprint_self_love_connection(),
    'engagement_trust_connection', public._sebbp_blueprint_trust_connection(),
    'engagement_dogfooding', public._sebbp_blueprint_dogfooding(),
    'engagement_success_criteria', public._sebbp_blueprint_success_criteria(v_org_id),
    'engagement_vision_phrases', public._sebbp_blueprint_vision_phrases(),
    'engagement_distinction_note', public._sebbp_distinction_note(),
    'engagement_integration_links', public._sebbp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase44', jsonb_build_object(
      'phase', 44,
      'title', 'Customer Renewal & Expansion Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE44_CUSTOMER_RENEWAL_EXPANSION.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Renewal & Expansion tab; distinct from Autonomous Execution Framework Phase 44 (/app/action-center).'
    ),
    'renewal_expansion_mission', 'Help Sales Experts nurture long-term customer partnerships through renewal awareness, health insights, and consultative expansion — never aggressive upsell.',
    'renewal_expansion_philosophy', 'Renewals should feel intentional, not accidental. Customer health metadata supports care — never surveillance or blame.',
    'renewal_expansion_abos_principle', 'Aipify Business Operating System (ABOS) partnerships grow when organizations succeed — humans decide, Aipify prepares renewal conversations with clarity.',
    'renewal_expansion_objectives', public._crebp_blueprint_objectives(),
    'renewal_dashboard_fields', public._crebp_blueprint_renewal_dashboard_fields(),
    'renewal_expansion_summary', public._crebp_renewal_summary(v_org_id),
    'renewal_companion_examples', public._crebp_blueprint_companion_examples(),
    'customer_health_insights', public._crebp_blueprint_health_insights(),
    'success_review_questions', public._crebp_blueprint_success_review_questions(),
    'expansion_opportunities', public._crebp_blueprint_expansion_opportunities(),
    'renewal_playbooks', public._crebp_blueprint_renewal_playbooks(),
    'customer_celebration_experiences', public._crebp_blueprint_celebration_experiences(),
    'churn_prevention_support', public._crebp_blueprint_churn_prevention(),
    'renewal_sales_expert_insights', public._crebp_blueprint_sales_expert_insights(),
    'renewal_expansion_self_love_connection', public._crebp_blueprint_self_love_connection(),
    'renewal_expansion_trust_connection', public._crebp_blueprint_trust_connection(),
    'renewal_expansion_dogfooding', public._crebp_blueprint_dogfooding(),
    'renewal_expansion_success_criteria', public._crebp_blueprint_success_criteria(v_org_id),
    'renewal_expansion_vision_phrases', public._crebp_blueprint_vision_phrases(),
    'renewal_expansion_distinction_note', public._crebp_distinction_note(),
    'renewal_expansion_integration_links', public._crebp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase48', jsonb_build_object(
      'phase', 48,
      'title', 'Sales Operations & Business Management Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE48_SALES_OPERATIONS_BUSINESS_MANAGEMENT.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Operations tab; cross-links commercial, performance, renewal, goals, capacity, Self Love; distinct from Value Realization A.48.'
    ),
    'sales_operations_mission', 'Help independent Sales Experts see revenue, goals, capacity, and service obligations clearly — so they can build sustainable Aipify businesses.',
    'sales_operations_philosophy', 'Operational visibility supports planning. Forecasts inform; they never pressure. You operate your own business — Aipify augments awareness.',
    'sales_operations_abos_principle', 'Aipify Business Operating System (ABOS) partners thrive with honest metadata, sustainable pacing, and human judgment — not automated business management.',
    'sales_operations_objectives', public._sobmbp_blueprint_objectives(),
    'sales_operations_dashboard_fields', public._sobmbp_blueprint_business_dashboard_fields(),
    'sales_operations_summary', public._sobmbp_operations_summary(v_org_id),
    'sales_business_goal_management', public._sobmbp_blueprint_goal_management(),
    'sales_business_goals_summary', public._sobmbp_business_goals_summary(v_org_id),
    'sales_capacity_awareness', public._sobmbp_blueprint_capacity_awareness(),
    'sales_service_tracking', public._sobmbp_blueprint_service_tracking(),
    'sales_forecasting_support', public._sobmbp_blueprint_forecasting_support(),
    'sales_operations_self_love_connection', public._sobmbp_blueprint_self_love_connection(),
    'sales_operations_trust_connection', public._sobmbp_blueprint_trust_connection(),
    'sales_operations_dogfooding', public._sobmbp_blueprint_dogfooding(),
    'sales_operations_success_criteria', public._sobmbp_blueprint_success_criteria(v_org_id),
    'sales_operations_vision_phrases', public._sobmbp_blueprint_vision_phrases(),
    'sales_operations_distinction_note', public._sobmbp_distinction_note(),
    'sales_operations_integration_links', public._sobmbp_blueprint_integration_links()
  ) || jsonb_build_object(
    'implementation_blueprint_phase49', jsonb_build_object(
      'phase', 49,
      'title', 'Sales Intelligence & Opportunity Engine',
      'doc', 'IMPLEMENTATION_BLUEPRINT_PHASE49_SALES_INTELLIGENCE_OPPORTUNITY.md',
      'mapping_note', 'Extends Sales Expert OS A.95 — Intelligence tab; partner portal opportunity guidance only. Distinct from Predictive Insights A.66, Strategic Intelligence A.31, Industry Intelligence A.44, Cross-Tenant A.71.'
    ),
    'sales_intelligence_mission', 'Help Sales Experts see their pipeline clearly, prioritize thoughtfully, and act with integrity — intelligence informs, humans decide.',
    'sales_intelligence_philosophy', 'Not every opportunity is urgent. Scores and categories support focus — sustainable pacing protects wellbeing and professional judgment.',
    'sales_intelligence_abos_principle', 'Aipify Business Operating System (ABOS) partners grow through informed, relationship-first sales — Aipify prepares context; Sales Experts choose every action.',
    'sales_intelligence_objectives', public._siobp_blueprint_objectives(),
    'opportunity_insights', public._siobp_blueprint_opportunity_insights(),
    'sales_intelligence_summary', public._siobp_intelligence_summary(v_org_id),
    'pipeline_intelligence', public._siobp_pipeline_insights(v_org_id),
    'industry_insights', public._siobp_blueprint_industry_insights(),
    'follow_up_intelligence', public._siobp_follow_up_intelligence(v_org_id),
    'opportunity_scoring', public._siobp_opportunity_scores(v_org_id),
    'sales_intelligence_self_love_connection', public._siobp_blueprint_self_love_connection(),
    'sales_intelligence_trust_connection', public._siobp_blueprint_trust_connection(),
    'sales_intelligence_dogfooding', public._siobp_blueprint_dogfooding(),
    'sales_intelligence_success_criteria', public._siobp_blueprint_success_criteria(v_org_id),
    'sales_intelligence_vision_phrases', public._siobp_blueprint_vision_phrases(),
    'sales_intelligence_distinction_note', public._siobp_distinction_note(),
    'sales_intelligence_integration_links', public._siobp_blueprint_integration_links()
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_sales_expert_operating_system_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_summary jsonb;
  v_perf jsonb;
  v_coach jsonb;
  v_cert jsonb;
  v_marketing jsonb;
  v_demo_env jsonb;
  v_demo_links jsonb;
  v_renewal jsonb;
  v_intelligence jsonb;
  v_ops jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._seos_ensure_settings(v_org_id);
  perform public._seos_seed_org_data(v_org_id);
  perform public._seosmc_ensure_settings(v_org_id);
  v_summary := public._seos_engagement_summary(v_org_id);
  v_perf := public._sprbp_performance_summary(v_org_id);
  v_coach := public._scebp_coach_summary(v_org_id);
  v_cert := public._sccfebp_certification_summary(v_org_id);
  v_marketing := public._seosmc_performance_tracking(v_org_id);
  v_demo_env := public._sdebp_blueprint_demo_environments();
  v_demo_links := public._sdebp_demo_links_summary(v_org_id);
  v_renewal := public._crebp_renewal_summary(v_org_id);
  v_intelligence := public._siobp_intelligence_summary(v_org_id);
  v_ops := public._sobmbp_operations_summary(v_org_id);

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Professional partner portal — Customers, Opportunities, Pipeline, Commission Overview.',
    'engine_phase', 'A.95',
    'route', '/app/sales-expert-engine',
    'active_opportunities', v_summary->'active_opportunities',
    'monthly_commissions_pending', v_summary->'monthly_commissions_pending',
    'upcoming_follow_ups', v_summary->'upcoming_follow_ups',
    'lifetime_subscription_value', v_summary->'lifetime_subscription_value',
    'milestones_achieved', v_perf->'milestones_achieved',
    'performance_recognition_phase', 41,
    'sales_coach_enablement_phase', 45,
    'sales_certification_field_enablement_phase', 46,
    'sales_expert_marketing_center_phase', '33-extension-marketing',
    'sales_demo_experience_phase', 42,
    'customer_renewal_expansion_phase', 44,
    'sales_intelligence_opportunity_phase', 49,
    'coach_suggested_actions', v_coach->'suggested_next_actions_count',
    'coach_scheduled_demos', v_coach->'scheduled_demos',
    'coach_brief_summary', format(
      '%s follow-ups · %s demos · %s new this month',
      coalesce(v_coach->>'upcoming_follow_ups', '0'),
      coalesce(v_coach->>'scheduled_demos', '0'),
      coalesce(v_coach->>'new_customers_this_month', '0')
    ),
    'certification_tier_label', v_cert->'current_tier_label',
    'certification_attempts_remaining', v_cert->'attempts_remaining',
    'certification_brief_summary', format(
      '%s · %s attempts remaining',
      coalesce(v_cert->>'current_tier_label', 'Training in progress'),
      coalesce(v_cert->>'attempts_remaining', '3')
    ),
    'marketing_link_clicks', v_marketing->'link_clicks',
    'marketing_signups', v_marketing->'signups',
    'marketing_subscriptions', v_marketing->'subscriptions',
    'marketing_brief_summary', format(
      '%s clicks · %s signups · %s subscriptions',
      coalesce(v_marketing->>'link_clicks', '0'),
      coalesce(v_marketing->>'signups', '0'),
      coalesce(v_marketing->>'subscriptions', '0')
    ),
    'demo_environments_count', jsonb_array_length(coalesce(v_demo_env->'environments', '[]'::jsonb)),
    'demo_links_active_count', v_demo_links->'active_links_count',
    'demo_brief_summary', format(
      '%s demo environments · %s active links (scaffold)',
      coalesce(jsonb_array_length(coalesce(v_demo_env->'environments', '[]'::jsonb))::text, '0'),
      coalesce(v_demo_links->>'active_links_count', '0')
    ),
    'renewal_upcoming_count', v_renewal->'upcoming_renewals_count',
    'renewal_at_risk_count', v_renewal->'at_risk_count',
    'renewal_brief_summary', format(
      '%s upcoming · %s at-risk · readiness %s%%',
      coalesce(v_renewal->>'upcoming_renewals_count', '0'),
      coalesce(v_renewal->>'at_risk_count', '0'),
      coalesce(v_renewal->>'average_readiness_pct', '0')
    ),
    'intelligence_stale_count', v_intelligence->'stale_opportunities_count',
    'intelligence_demo_candidates_count', v_intelligence->'demo_candidates_count',
    'intelligence_brief_summary', format(
      '%s open · %s demo candidates · %s stale',
      coalesce(v_intelligence->>'active_opportunities', '0'),
      coalesce(v_intelligence->>'demo_candidates_count', '0'),
      coalesce(v_intelligence->>'stale_opportunities_count', '0')
    ),
    'sales_operations_business_management_phase', 48,
    'operations_active_customers', v_ops->'active_customers',
    'operations_support_obligations', v_ops->'support_obligations',
    'operations_brief_summary', format(
      '%s customers · %s obligations · forecast informs only',
      coalesce(v_ops->>'active_customers', '0'),
      coalesce(v_ops->>'support_obligations', '0')
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;


grant execute on function public._sobmbp_distinction_note() to authenticated;
grant execute on function public._sobmbp_blueprint_objectives() to authenticated;
grant execute on function public._sobmbp_blueprint_business_dashboard_fields() to authenticated;
grant execute on function public._sobmbp_ensure_business_goals(uuid) to authenticated;
grant execute on function public._sobmbp_business_goals_summary(uuid) to authenticated;
grant execute on function public._sobmbp_operations_summary(uuid) to authenticated;
grant execute on function public._sobmbp_blueprint_goal_management() to authenticated;
grant execute on function public._sobmbp_blueprint_capacity_awareness() to authenticated;
grant execute on function public._sobmbp_blueprint_service_tracking() to authenticated;
grant execute on function public._sobmbp_blueprint_forecasting_support() to authenticated;
grant execute on function public._sobmbp_blueprint_self_love_connection() to authenticated;
grant execute on function public._sobmbp_blueprint_trust_connection() to authenticated;
grant execute on function public._sobmbp_blueprint_dogfooding() to authenticated;
grant execute on function public._sobmbp_blueprint_vision_phrases() to authenticated;
grant execute on function public._sobmbp_blueprint_integration_links() to authenticated;
grant execute on function public._sobmbp_blueprint_success_criteria(uuid) to authenticated;
