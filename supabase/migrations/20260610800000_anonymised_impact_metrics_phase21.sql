-- Phase 21 — Anonymised Impact Metrics & Marketing Proof Layer

-- ---------------------------------------------------------------------------
-- 1. Anonymised metric events (counts only — no private content fields)
-- ---------------------------------------------------------------------------
create table if not exists public.anonymised_metric_events (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  installation_id uuid references public.installations (id) on delete set null,
  event_type text not null,
  event_category text not null,
  event_count int not null default 1 check (event_count > 0),
  risk_level text not null default 'low',
  source_module text not null,
  anonymised boolean not null default true,
  year int not null,
  month int not null check (month between 1 and 12),
  created_at timestamptz not null default now()
);

alter table public.anonymised_metric_events
  drop constraint if exists anonymised_metric_events_event_type_check;

alter table public.anonymised_metric_events
  add constraint anonymised_metric_events_event_type_check check (
    event_type in (
      'support_cases_resolved',
      'support_cases_escalated',
      'response_time_improvement',
      'resolution_time_improvement',
      'automated_actions_completed',
      'failed_actions_prevented',
      'self_healing_runs_completed',
      'integration_issues_detected',
      'integration_issues_repaired',
      'emails_drafted',
      'recommendations_generated',
      'recommendations_approved',
      'recommendations_rejected',
      'time_saved_estimate',
      'customer_satisfaction_score',
      'system_health_event',
      'update_success',
      'install_health_score'
    )
  );

alter table public.anonymised_metric_events
  drop constraint if exists anonymised_metric_events_event_category_check;

alter table public.anonymised_metric_events
  add constraint anonymised_metric_events_event_category_check check (
    event_category in (
      'support',
      'automation',
      'integration',
      'recommendations',
      'health',
      'updates',
      'install',
      'satisfaction'
    )
  );

alter table public.anonymised_metric_events
  drop constraint if exists anonymised_metric_events_risk_level_check;

alter table public.anonymised_metric_events
  add constraint anonymised_metric_events_risk_level_check check (
    risk_level in ('low', 'medium', 'high', 'critical')
  );

alter table public.anonymised_metric_events enable row level security;
revoke all on public.anonymised_metric_events from authenticated, anon;

create index if not exists anonymised_metric_events_tenant_created_idx
  on public.anonymised_metric_events (tenant_id, created_at desc);

create index if not exists anonymised_metric_events_type_period_idx
  on public.anonymised_metric_events (event_type, year, month);

-- ---------------------------------------------------------------------------
-- 2. Impact audit log (platform governance actions)
-- ---------------------------------------------------------------------------
create table if not exists public.impact_audit_log (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  actor_id uuid references auth.users (id) on delete set null,
  details jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.impact_audit_log
  drop constraint if exists impact_audit_log_event_type_check;

alter table public.impact_audit_log
  add constraint impact_audit_log_event_type_check check (
    event_type in (
      'metric_event_created',
      'metric_aggregation_completed',
      'marketing_export_generated',
      'report_downloaded',
      'public_metric_approved'
    )
  );

alter table public.impact_audit_log enable row level security;
revoke all on public.impact_audit_log from authenticated, anon;

create index if not exists impact_audit_log_created_idx
  on public.impact_audit_log (created_at desc);

-- ---------------------------------------------------------------------------
-- 3. Record anonymised metric event
-- ---------------------------------------------------------------------------
create or replace function public.record_anonymised_metric_event(
  p_tenant_id uuid,
  p_event_type text,
  p_event_category text,
  p_source_module text,
  p_event_count int default 1,
  p_risk_level text default 'low',
  p_installation_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
  v_now timestamptz := now();
begin
  if p_event_count is null or p_event_count < 1 then
    raise exception 'event_count must be positive';
  end if;

  if p_risk_level not in ('low', 'medium', 'high', 'critical') then
    raise exception 'Invalid risk_level';
  end if;

  insert into public.anonymised_metric_events (
    tenant_id,
    installation_id,
    event_type,
    event_category,
    event_count,
    risk_level,
    source_module,
    anonymised,
    year,
    month
  )
  values (
    p_tenant_id,
    p_installation_id,
    p_event_type,
    p_event_category,
    p_event_count,
    p_risk_level,
    p_source_module,
    true,
    extract(year from v_now)::int,
    extract(month from v_now)::int
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.record_anonymised_metric_event(
  uuid, text, text, text, int, text, uuid
) to authenticated;

-- Install token path (Layer 3)
create or replace function public.record_install_metric_event(
  p_token text,
  p_event_type text,
  p_event_category text,
  p_source_module text,
  p_event_count int default 1,
  p_risk_level text default 'low'
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_hash text;
  v_installation public.installations;
  v_id uuid;
begin
  if p_token is null or length(p_token) < 20 then
    raise exception 'Invalid installation token';
  end if;

  v_hash := public.hash_installation_token(p_token);

  select * into v_installation
  from public.installations i
  where i.installation_token_hash = v_hash
    and i.revoked_at is null
  limit 1;

  if v_installation.id is null then
    raise exception 'Installation not found';
  end if;

  if v_installation.customer_id is null then
    raise exception 'Installation not linked to tenant';
  end if;

  v_id := public.record_anonymised_metric_event(
    v_installation.customer_id,
    p_event_type,
    p_event_category,
    p_source_module,
    p_event_count,
    p_risk_level,
    v_installation.id
  );

  return v_id;
end;
$$;

revoke execute on function public.record_install_metric_event(
  text, text, text, text, int, text
) from public;
grant execute on function public.record_install_metric_event(
  text, text, text, text, int, text
) to anon;

-- ---------------------------------------------------------------------------
-- 4. Customer impact summary (tenant-scoped — Customer App only)
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_impact_summary()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_customer_id uuid;
  v_support_resolved bigint;
  v_actions_completed bigint;
  v_recommendations bigint;
  v_time_saved bigint;
begin
  select c.id into v_customer_id
  from public.customers c
  join public.company_users cu on cu.company_id = c.company_id
  where cu.auth_user_id = auth.uid()
  limit 1;

  if v_customer_id is null then
    raise exception 'Customer not found';
  end if;

  select coalesce(sum(event_count), 0) into v_support_resolved
  from public.anonymised_metric_events
  where tenant_id = v_customer_id
    and event_type = 'support_cases_resolved';

  select coalesce(sum(event_count), 0) into v_actions_completed
  from public.anonymised_metric_events
  where tenant_id = v_customer_id
    and event_type = 'automated_actions_completed';

  select coalesce(sum(event_count), 0) into v_recommendations
  from public.anonymised_metric_events
  where tenant_id = v_customer_id
    and event_type = 'recommendations_generated';

  select coalesce(sum(event_count), 0) into v_time_saved
  from public.anonymised_metric_events
  where tenant_id = v_customer_id
    and event_type = 'time_saved_estimate';

  return jsonb_build_object(
    'support_cases_resolved', v_support_resolved,
    'automated_actions_completed', v_actions_completed,
    'recommendations_generated', v_recommendations,
    'time_saved_minutes', v_time_saved,
    'disclosure',
    'Aipify collects anonymised operational metrics for your workspace. These counts do not include sales data, customer content, emails, transactions, or private business records.'
  );
end;
$$;

grant execute on function public.get_customer_impact_summary() to authenticated;

-- ---------------------------------------------------------------------------
-- 5. Platform impact dashboard (aggregate only — Platform Admin)
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_impact_dashboard()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_year int := extract(year from now())::int;
  v_support_resolved bigint;
  v_actions_completed bigint;
  v_recommendations bigint;
  v_self_healing bigint;
  v_time_saved bigint;
  v_response_improvement bigint;
  v_tenant_count int;
  v_monthly jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select coalesce(sum(event_count), 0) into v_support_resolved
  from public.anonymised_metric_events
  where event_type = 'support_cases_resolved';

  select coalesce(sum(event_count), 0) into v_actions_completed
  from public.anonymised_metric_events
  where event_type = 'automated_actions_completed';

  select coalesce(sum(event_count), 0) into v_recommendations
  from public.anonymised_metric_events
  where event_type = 'recommendations_generated';

  select coalesce(sum(event_count), 0) into v_self_healing
  from public.anonymised_metric_events
  where event_type = 'self_healing_runs_completed';

  select coalesce(sum(event_count), 0) into v_time_saved
  from public.anonymised_metric_events
  where event_type = 'time_saved_estimate';

  select coalesce(sum(event_count), 0) into v_response_improvement
  from public.anonymised_metric_events
  where event_type = 'response_time_improvement';

  select count(distinct tenant_id)::int into v_tenant_count
  from public.anonymised_metric_events
  where year = v_year;

  select coalesce(
    jsonb_agg(row_to_json(m)::jsonb order by m.year, m.month),
    '[]'::jsonb
  )
  into v_monthly
  from (
    select
      year,
      month,
      sum(event_count)::bigint as total_events,
      sum(event_count) filter (where event_type = 'support_cases_resolved')::bigint as support_resolved,
      sum(event_count) filter (where event_type = 'automated_actions_completed')::bigint as actions_completed
    from public.anonymised_metric_events
    where year >= v_year - 1
    group by year, month
    order by year, month
    limit 24
  ) m;

  insert into public.impact_audit_log (event_type, actor_id, details)
  values (
    'metric_aggregation_completed',
    auth.uid(),
    jsonb_build_object('year', v_year, 'tenant_count', v_tenant_count)
  );

  return jsonb_build_object(
    'support_cases_resolved', v_support_resolved,
    'automated_actions_completed', v_actions_completed,
    'recommendations_generated', v_recommendations,
    'self_healing_runs_completed', v_self_healing,
    'response_time_improvement_minutes', v_response_improvement,
    'time_saved_minutes', v_time_saved,
    'year_to_date_tenants', v_tenant_count,
    'minimum_group_size', 5,
    'public_marketing_allowed', v_tenant_count >= 5,
    'monthly_trend', v_monthly,
    'principle',
    'Customer business data stays with the customer. Aipify stores proof of value, not private business data.'
  );
end;
$$;

grant execute on function public.get_platform_impact_dashboard() to authenticated;

-- ---------------------------------------------------------------------------
-- 6. Marketing proof statements (Platform Admin)
-- ---------------------------------------------------------------------------
create or replace function public.generate_marketing_proof_statements(
  p_year int default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_year int := coalesce(p_year, extract(year from now())::int);
  v_support_resolved bigint;
  v_actions_completed bigint;
  v_recommendations bigint;
  v_response_improvement bigint;
  v_time_saved bigint;
  v_tenant_count int;
  v_public_ok boolean;
  v_statements jsonb;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  select coalesce(sum(event_count), 0) into v_support_resolved
  from public.anonymised_metric_events
  where event_type = 'support_cases_resolved'
    and year = v_year;

  select coalesce(sum(event_count), 0) into v_actions_completed
  from public.anonymised_metric_events
  where event_type = 'automated_actions_completed'
    and year = v_year;

  select coalesce(sum(event_count), 0) into v_recommendations
  from public.anonymised_metric_events
  where event_type = 'recommendations_generated'
    and year = v_year;

  select coalesce(sum(event_count), 0) into v_response_improvement
  from public.anonymised_metric_events
  where event_type = 'response_time_improvement'
    and year = v_year;

  select coalesce(sum(event_count), 0) into v_time_saved
  from public.anonymised_metric_events
  where event_type = 'time_saved_estimate'
    and year = v_year;

  select count(distinct tenant_id)::int into v_tenant_count
  from public.anonymised_metric_events
  where year = v_year;

  v_public_ok := v_tenant_count >= 5;

  v_statements := jsonb_build_array(
    format('Aipify resolved %s+ support cases in %s.', to_char(v_support_resolved, 'FM999,999,999'), v_year),
    format('Aipify completed %s+ automated operational actions in %s.', to_char(v_actions_completed, 'FM999,999,999'), v_year),
    format('Aipify generated %s+ operational recommendations in %s.', to_char(v_recommendations, 'FM999,999,999'), v_year),
    format('Aipify saved an estimated %s+ operational minutes across active installations in %s.', to_char(v_time_saved, 'FM999,999,999'), v_year)
  );

  if v_response_improvement > 0 then
    v_statements := v_statements || jsonb_build_array(
      format('Aipify improved aggregate support response time by %s minutes across active installations in %s.', to_char(v_response_improvement, 'FM999,999,999'), v_year)
    );
  end if;

  insert into public.impact_audit_log (event_type, actor_id, details)
  values (
    'marketing_export_generated',
    auth.uid(),
    jsonb_build_object(
      'year', v_year,
      'tenant_count', v_tenant_count,
      'public_ok', v_public_ok,
      'statement_count', jsonb_array_length(v_statements)
    )
  );

  return jsonb_build_object(
    'year', v_year,
    'tenant_count', v_tenant_count,
    'minimum_group_size', 5,
    'public_marketing_allowed', v_public_ok,
    'usage', case
      when v_public_ok then 'public_marketing'
      else 'internal_only'
    end,
    'statements', v_statements
  );
end;
$$;

grant execute on function public.generate_marketing_proof_statements(int) to authenticated;

-- ---------------------------------------------------------------------------
-- 7. Record impact audit event (Platform Admin actions)
-- ---------------------------------------------------------------------------
create or replace function public.record_impact_audit_event(
  p_event_type text,
  p_details jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if not public.is_platform_admin() then
    raise exception 'Not authorized';
  end if;

  if p_event_type not in (
    'metric_event_created',
    'metric_aggregation_completed',
    'marketing_export_generated',
    'report_downloaded',
    'public_metric_approved'
  ) then
    raise exception 'Invalid impact audit event type';
  end if;

  insert into public.impact_audit_log (event_type, actor_id, details)
  values (p_event_type, auth.uid(), coalesce(p_details, '{}'::jsonb))
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.record_impact_audit_event(text, jsonb) to authenticated;
