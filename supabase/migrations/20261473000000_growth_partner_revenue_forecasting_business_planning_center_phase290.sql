-- Phase 290 — Growth Partner Revenue Forecasting & Business Planning Center

-- ---------------------------------------------------------------------------
-- 1. Global probability assumptions (Super Admin)
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_forecast_global_settings (
  id uuid primary key default gen_random_uuid(),
  discovery_pct numeric(5, 2) not null default 10 check (discovery_pct between 0 and 100),
  demonstration_pct numeric(5, 2) not null default 25,
  proposal_pct numeric(5, 2) not null default 50,
  negotiation_pct numeric(5, 2) not null default 75,
  verbal_agreement_pct numeric(5, 2) not null default 90,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.growth_partner_forecast_global_settings enable row level security;
revoke all on public.growth_partner_forecast_global_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Partner goals
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_forecast_goals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  goal_period text not null check (goal_period in ('monthly', 'quarterly', 'annual')),
  period_key text not null,
  target_revenue numeric(14, 2) not null default 0,
  current_revenue numeric(14, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, goal_period, period_key)
);

alter table public.growth_partner_forecast_goals enable row level security;
revoke all on public.growth_partner_forecast_goals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. Pipeline opportunities (forecast input)
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_forecast_opportunities (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  company_name text not null,
  pipeline_stage text not null default 'discovery' check (
    pipeline_stage in (
      'discovery', 'demonstration', 'proposal', 'negotiation', 'verbal_agreement', 'closed_won', 'closed_lost'
    )
  ),
  estimated_value numeric(14, 2) not null default 0,
  expected_close_date date,
  opportunity_type text not null default 'new_business' check (
    opportunity_type in ('new_business', 'renewal', 'expansion')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists growth_partner_forecast_opportunities_tenant_idx
  on public.growth_partner_forecast_opportunities (tenant_id, pipeline_stage);

alter table public.growth_partner_forecast_opportunities enable row level security;
revoke all on public.growth_partner_forecast_opportunities from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Renewal forecast entries
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_forecast_renewals (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  customer_name text not null,
  renewal_date date not null,
  renewal_value numeric(14, 2) not null default 0,
  renewal_probability numeric(5, 2) not null default 85 check (renewal_probability between 0 and 100),
  requires_attention boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.growth_partner_forecast_renewals enable row level security;
revoke all on public.growth_partner_forecast_renewals from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Expansion opportunities
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_forecast_expansions (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  customer_name text not null,
  expansion_type text not null check (
    expansion_type in (
      'additional_users', 'higher_tier_plan', 'additional_modules',
      'multi_domain', 'enterprise_transition'
    )
  ),
  estimated_value numeric(14, 2) not null default 0,
  probability numeric(5, 2) not null default 50 check (probability between 0 and 100),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.growth_partner_forecast_expansions enable row level security;
revoke all on public.growth_partner_forecast_expansions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Scenario snapshots
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_forecast_scenarios (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  scenario_key text not null check (scenario_key in ('conservative', 'expected', 'ambitious')),
  forecast_period text not null check (
    forecast_period in ('next_30_days', 'next_quarter', 'next_6_months', 'next_12_months')
  ),
  projected_revenue numeric(14, 2) not null default 0,
  projected_commissions numeric(14, 2) not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (tenant_id, scenario_key, forecast_period)
);

alter table public.growth_partner_forecast_scenarios enable row level security;
revoke all on public.growth_partner_forecast_scenarios from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. Audit logs
-- ---------------------------------------------------------------------------
create table if not exists public.growth_partner_forecast_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete set null,
  event_type text not null check (
    event_type in (
      'forecast_generated', 'goal_modified', 'scenario_created',
      'assumptions_updated', 'report_exported'
    )
  ),
  summary text not null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_forecast_audit_created_idx
  on public.growth_partner_forecast_audit_logs (created_at desc);

alter table public.growth_partner_forecast_audit_logs enable row level security;
revoke all on public.growth_partner_forecast_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._gprf290_require_super_admin()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (
    select 1 from public.platform_admins pa
    where pa.auth_user_id = auth.uid() and pa.role = 'super_admin'
  ) then raise exception 'Not authorized'; end if;
end; $$;

create or replace function public._gprf290_resolve_tenant()
returns uuid language plpgsql stable security definer set search_path = public as $$
begin return public._presence_tenant_for_auth(); end; $$;

create or replace function public._gprf290_log_audit(
  p_tenant_id uuid, p_event_type text, p_summary text, p_context jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_forecast_audit_logs (tenant_id, event_type, summary, context)
  values (p_tenant_id, p_event_type, p_summary, coalesce(p_context, '{}'::jsonb));
end; $$;

create or replace function public._gprf290_stage_probability(p_stage text, p_settings public.growth_partner_forecast_global_settings)
returns numeric language plpgsql immutable as $$
begin
  return case p_stage
    when 'discovery' then p_settings.discovery_pct
    when 'demonstration' then p_settings.demonstration_pct
    when 'proposal' then p_settings.proposal_pct
    when 'negotiation' then p_settings.negotiation_pct
    when 'verbal_agreement' then p_settings.verbal_agreement_pct
    when 'closed_won' then 100
    else 0
  end;
end; $$;

create or replace function public._gprf290_ensure_global_settings()
returns public.growth_partner_forecast_global_settings
language plpgsql security definer set search_path = public as $$
declare v_row public.growth_partner_forecast_global_settings;
begin
  select * into v_row from public.growth_partner_forecast_global_settings limit 1;
  if not found then
    insert into public.growth_partner_forecast_global_settings default values returning * into v_row;
  end if;
  return v_row;
end; $$;

create or replace function public._gprf290_seed_partner(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_settings public.growth_partner_forecast_global_settings;
begin
  if p_tenant_id is null then return; end if;
  v_settings := public._gprf290_ensure_global_settings();

  if exists (select 1 from public.growth_partner_forecast_opportunities where tenant_id = p_tenant_id limit 1) then
    return;
  end if;

  insert into public.growth_partner_forecast_opportunities (
    tenant_id, company_name, pipeline_stage, estimated_value, expected_close_date, opportunity_type
  ) values
    (p_tenant_id, 'Nordic Retail Group', 'negotiation', 48000, current_date + 21, 'new_business'),
    (p_tenant_id, 'Bergen Logistics AS', 'proposal', 24000, current_date + 45, 'new_business'),
    (p_tenant_id, 'Oslo FinTech AS', 'demonstration', 62000, current_date + 60, 'new_business'),
    (p_tenant_id, 'Stavanger Energy', 'discovery', 18000, current_date + 90, 'expansion');

  insert into public.growth_partner_forecast_renewals (
    tenant_id, customer_name, renewal_date, renewal_value, renewal_probability, requires_attention
  ) values
    (p_tenant_id, 'Nordic Retail Group', current_date + 30, 36000, 92, false),
    (p_tenant_id, 'Trondheim Media', current_date + 14, 12000, 68, true);

  insert into public.growth_partner_forecast_expansions (
    tenant_id, customer_name, expansion_type, estimated_value, probability
  ) values
    (p_tenant_id, 'Nordic Retail Group', 'additional_users', 8400, 70),
    (p_tenant_id, 'Bergen Logistics AS', 'higher_tier_plan', 15600, 45);

  insert into public.growth_partner_forecast_goals (
    tenant_id, goal_period, period_key, target_revenue, current_revenue
  ) values
    (p_tenant_id, 'monthly', to_char(now(), 'YYYY-MM'), 50000, 42800),
    (p_tenant_id, 'quarterly', to_char(now(), 'YYYY') || '-Q' || ceil(extract(month from now()) / 3)::int, 150000, 118400),
    (p_tenant_id, 'annual', to_char(now(), 'YYYY'), 600000, 118400)
  on conflict (tenant_id, goal_period, period_key) do nothing;

  insert into public.growth_partner_forecast_scenarios (
    tenant_id, scenario_key, forecast_period, projected_revenue, projected_commissions
  ) values
    (p_tenant_id, 'conservative', 'next_30_days', 38000, 5700),
    (p_tenant_id, 'expected', 'next_30_days', 52000, 7800),
    (p_tenant_id, 'ambitious', 'next_30_days', 68000, 10200),
    (p_tenant_id, 'conservative', 'next_quarter', 98000, 14700),
    (p_tenant_id, 'expected', 'next_quarter', 142000, 21300),
    (p_tenant_id, 'ambitious', 'next_quarter', 186000, 27900),
    (p_tenant_id, 'expected', 'next_12_months', 520000, 78000)
  on conflict (tenant_id, scenario_key, forecast_period) do nothing;

  perform public._gprf290_log_audit(p_tenant_id, 'forecast_generated', 'Initial forecast data seeded for partner.', '{}'::jsonb);
end; $$;

-- ---------------------------------------------------------------------------
-- 9. Overview RPC
-- ---------------------------------------------------------------------------
create or replace function public.get_growth_partner_forecast_center(p_surface text default 'partner')
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_settings public.growth_partner_forecast_global_settings;
  v_overview jsonb;
  v_pipeline jsonb;
  v_renewals jsonb;
  v_expansions jsonb;
  v_goals jsonb;
  v_scenarios jsonb;
  v_periods jsonb;
  v_recommendations jsonb;
  v_audit jsonb;
  v_partners jsonb;
  v_weighted_pipeline numeric;
  v_principle text := 'Visibility creates confidence. Planning creates resilience.';
begin
  v_settings := public._gprf290_ensure_global_settings();

  if p_surface = 'super' then
    perform public._gprf290_require_super_admin();
    v_tenant_id := null;
  elsif p_surface = 'partner' then
    v_tenant_id := public._gprf290_resolve_tenant();
    if v_tenant_id is null then return jsonb_build_object('has_access', false); end if;
    perform public._gprf290_seed_partner(v_tenant_id);
  else
    raise exception 'Unknown surface';
  end if;

  if p_surface = 'super' then
    select coalesce(jsonb_agg(jsonb_build_object(
      'tenant_id', g.tenant_id,
      'forecasted_annual', coalesce(sum(s.projected_revenue) filter (where s.forecast_period = 'next_12_months' and s.scenario_key = 'expected'), 0),
      'weighted_pipeline', coalesce((
        select sum(o.estimated_value * public._gprf290_stage_probability(o.pipeline_stage, v_settings) / 100)
        from public.growth_partner_forecast_opportunities o where o.tenant_id = g.tenant_id
          and o.pipeline_stage not in ('closed_won', 'closed_lost')
      ), 0)
    )), '[]'::jsonb)
    into v_partners
    from (select distinct tenant_id from public.growth_partner_forecast_goals) g;
  end if;

  if v_tenant_id is not null then
    select coalesce(sum(o.estimated_value * public._gprf290_stage_probability(o.pipeline_stage, v_settings) / 100), 0)
    into v_weighted_pipeline
    from public.growth_partner_forecast_opportunities o
    where o.tenant_id = v_tenant_id and o.pipeline_stage not in ('closed_won', 'closed_lost');

    v_overview := jsonb_build_object(
      'forecasted_monthly_revenue', coalesce((
        select projected_revenue from public.growth_partner_forecast_scenarios
        where tenant_id = v_tenant_id and scenario_key = 'expected' and forecast_period = 'next_30_days'
      ), 0),
      'forecasted_annual_revenue', coalesce((
        select projected_revenue from public.growth_partner_forecast_scenarios
        where tenant_id = v_tenant_id and scenario_key = 'expected' and forecast_period = 'next_12_months'
      ), 0),
      'active_opportunities_value', coalesce((
        select sum(estimated_value) from public.growth_partner_forecast_opportunities
        where tenant_id = v_tenant_id and pipeline_stage not in ('closed_won', 'closed_lost')
      ), 0),
      'expected_commissions', coalesce((
        select projected_commissions from public.growth_partner_forecast_scenarios
        where tenant_id = v_tenant_id and scenario_key = 'expected' and forecast_period = 'next_30_days'
      ), 0),
      'renewal_opportunities', (select count(*)::int from public.growth_partner_forecast_renewals where tenant_id = v_tenant_id),
      'expansion_opportunities', (select count(*)::int from public.growth_partner_forecast_expansions where tenant_id = v_tenant_id),
      'weighted_pipeline_value', v_weighted_pipeline
    );

    select jsonb_build_object(
      'qualified', coalesce(sum(estimated_value) filter (where pipeline_stage in ('demonstration', 'proposal', 'negotiation', 'verbal_agreement')), 0),
      'proposal_stage', coalesce(sum(estimated_value) filter (where pipeline_stage = 'proposal'), 0),
      'negotiation_stage', coalesce(sum(estimated_value) filter (where pipeline_stage = 'negotiation'), 0),
      'weighted_value', v_weighted_pipeline,
      'opportunities', coalesce((
        select jsonb_agg(jsonb_build_object(
          'id', o.id, 'company_name', o.company_name, 'pipeline_stage', o.pipeline_stage,
          'estimated_value', o.estimated_value, 'expected_close_date', o.expected_close_date,
          'opportunity_type', o.opportunity_type,
          'weighted_value', round(o.estimated_value * public._gprf290_stage_probability(o.pipeline_stage, v_settings) / 100, 2)
        ) order by o.expected_close_date nulls last)
        from public.growth_partner_forecast_opportunities o where o.tenant_id = v_tenant_id
          and o.pipeline_stage not in ('closed_won', 'closed_lost')
      ), '[]'::jsonb)
    ) into v_pipeline;

    select coalesce(jsonb_agg(jsonb_build_object(
      'id', r.id, 'customer_name', r.customer_name, 'renewal_date', r.renewal_date,
      'renewal_value', r.renewal_value, 'renewal_probability', r.renewal_probability,
      'requires_attention', r.requires_attention
    ) order by r.renewal_date), '[]'::jsonb)
    into v_renewals from public.growth_partner_forecast_renewals r where r.tenant_id = v_tenant_id;

    select coalesce(jsonb_agg(jsonb_build_object(
      'id', e.id, 'customer_name', e.customer_name, 'expansion_type', e.expansion_type,
      'estimated_value', e.estimated_value, 'probability', e.probability
    ) order by e.estimated_value desc), '[]'::jsonb)
    into v_expansions from public.growth_partner_forecast_expansions e where e.tenant_id = v_tenant_id;

    select coalesce(jsonb_agg(jsonb_build_object(
      'id', g.id, 'goal_period', g.goal_period, 'period_key', g.period_key,
      'target_revenue', g.target_revenue, 'current_revenue', g.current_revenue,
      'progress_pct', round(100.0 * g.current_revenue / nullif(g.target_revenue, 0), 1)
    ) order by g.goal_period), '[]'::jsonb)
    into v_goals from public.growth_partner_forecast_goals g where g.tenant_id = v_tenant_id;

    select coalesce(jsonb_agg(jsonb_build_object(
      'scenario_key', s.scenario_key, 'forecast_period', s.forecast_period,
      'projected_revenue', s.projected_revenue, 'projected_commissions', s.projected_commissions
    ) order by s.scenario_key, s.forecast_period), '[]'::jsonb)
    into v_scenarios from public.growth_partner_forecast_scenarios s where s.tenant_id = v_tenant_id;

    v_recommendations := coalesce((
      select jsonb_agg(r) from (
        select jsonb_build_object('key', 'focus_renewals', 'message_key', 'focus_renewals')
        where exists (select 1 from public.growth_partner_forecast_renewals rr where rr.tenant_id = v_tenant_id and rr.requires_attention)
        union all
        select jsonb_build_object('key', 'pipeline_activity', 'message_key', 'pipeline_activity')
        where (select count(*) from public.growth_partner_forecast_opportunities oo where oo.tenant_id = v_tenant_id and oo.pipeline_stage = 'discovery') >= 2
        union all
        select jsonb_build_object('key', 'expansion_detected', 'message_key', 'expansion_detected')
        where exists (select 1 from public.growth_partner_forecast_expansions ee where ee.tenant_id = v_tenant_id)
        union all
        select jsonb_build_object('key', 'retention_improvement', 'message_key', 'retention_improvement')
        where exists (select 1 from public.growth_partner_forecast_renewals rr where rr.tenant_id = v_tenant_id and rr.renewal_probability < 75)
      ) recs
    ), '[]'::jsonb);

    select coalesce(jsonb_agg(jsonb_build_object(
      'id', a.id, 'event_type', a.event_type, 'summary', a.summary, 'created_at', a.created_at
    ) order by a.created_at desc), '[]'::jsonb)
    into v_audit from public.growth_partner_forecast_audit_logs a
    where a.tenant_id = v_tenant_id limit 12;
  end if;

  v_periods := jsonb_build_array('next_30_days', 'next_quarter', 'next_6_months', 'next_12_months');

  return jsonb_build_object(
    'has_access', true,
    'surface', p_surface,
    'tenant_id', v_tenant_id,
    'overview', coalesce(v_overview, '{}'::jsonb),
    'pipeline', coalesce(v_pipeline, '{}'::jsonb),
    'renewals', coalesce(v_renewals, '[]'::jsonb),
    'expansions', coalesce(v_expansions, '[]'::jsonb),
    'goals', coalesce(v_goals, '[]'::jsonb),
    'scenarios', coalesce(v_scenarios, '[]'::jsonb),
    'forecast_periods', v_periods,
    'probability_assumptions', jsonb_build_object(
      'discovery', v_settings.discovery_pct,
      'demonstration', v_settings.demonstration_pct,
      'proposal', v_settings.proposal_pct,
      'negotiation', v_settings.negotiation_pct,
      'verbal_agreement', v_settings.verbal_agreement_pct
    ),
    'recommendations', coalesce(v_recommendations, '[]'::jsonb),
    'audit', coalesce(v_audit, '[]'::jsonb),
    'partners', coalesce(v_partners, '[]'::jsonb),
    'principle', v_principle
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Actions RPC
-- ---------------------------------------------------------------------------
create or replace function public.record_growth_partner_forecast_action(
  p_surface text default 'partner',
  p_action text default '',
  p_payload jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_tenant_id uuid;
  v_export jsonb;
begin
  p_payload := coalesce(p_payload, '{}'::jsonb);

  if p_surface = 'super' then
    perform public._gprf290_require_super_admin();
    v_tenant_id := nullif(p_payload->>'tenant_id', '')::uuid;
  else
    v_tenant_id := public._gprf290_resolve_tenant();
  end if;

  if p_action = 'export_report' then
    v_export := jsonb_build_object(
      'format', coalesce(p_payload->>'format', 'pdf'),
      'sections', jsonb_build_array('overview', 'pipeline', 'renewals', 'expansions', 'goals', 'scenarios'),
      'generated_at', now()
    );
    perform public._gprf290_log_audit(v_tenant_id, 'report_exported', 'Forecast report exported.', p_payload);
    return jsonb_build_object('ok', true, 'export', v_export);
  end if;

  if p_action = 'set_goal' and v_tenant_id is not null then
    insert into public.growth_partner_forecast_goals (
      tenant_id, goal_period, period_key, target_revenue, current_revenue
    ) values (
      v_tenant_id,
      coalesce(p_payload->>'goal_period', 'monthly'),
      coalesce(p_payload->>'period_key', to_char(now(), 'YYYY-MM')),
      coalesce((p_payload->>'target_revenue')::numeric, 0),
      coalesce((p_payload->>'current_revenue')::numeric, 0)
    )
    on conflict (tenant_id, goal_period, period_key)
    do update set target_revenue = excluded.target_revenue, current_revenue = excluded.current_revenue, updated_at = now();
    perform public._gprf290_log_audit(v_tenant_id, 'goal_modified', 'Forecast goal updated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_action = 'generate_forecast' and v_tenant_id is not null then
    perform public._gprf290_log_audit(v_tenant_id, 'forecast_generated', 'Forecast regenerated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  if p_surface <> 'super' then
    raise exception 'Action requires Super Admin authorization';
  end if;

  if p_action = 'update_assumptions' then
    update public.growth_partner_forecast_global_settings set
      discovery_pct = coalesce((p_payload->>'discovery')::numeric, discovery_pct),
      demonstration_pct = coalesce((p_payload->>'demonstration')::numeric, demonstration_pct),
      proposal_pct = coalesce((p_payload->>'proposal')::numeric, proposal_pct),
      negotiation_pct = coalesce((p_payload->>'negotiation')::numeric, negotiation_pct),
      verbal_agreement_pct = coalesce((p_payload->>'verbal_agreement')::numeric, verbal_agreement_pct),
      updated_at = now();
    perform public._gprf290_log_audit(null, 'assumptions_updated', 'Global forecast assumptions updated.', p_payload);
    return jsonb_build_object('ok', true);
  end if;

  raise exception 'Unknown action: %', p_action;
end; $$;

revoke all on function public.get_growth_partner_forecast_center(text) from public;
revoke all on function public.record_growth_partner_forecast_action(text, text, jsonb) from public;
grant execute on function public.get_growth_partner_forecast_center(text) to authenticated;
grant execute on function public.record_growth_partner_forecast_action(text, text, jsonb) to authenticated;
