-- Phase 42 — Commercial Packages & Modular Architecture
-- Subscription packages, tenant module licensing, usage tracking, billing & module centers.

-- ---------------------------------------------------------------------------
-- 1. subscription_packages (commercial catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.subscription_packages (
  id uuid primary key default gen_random_uuid(),
  package_key text not null unique,
  package_name text not null,
  package_type text not null check (
    package_type in ('core', 'suite', 'addon', 'enterprise')
  ),
  description text not null default '',
  features jsonb not null default '[]'::jsonb,
  module_keys jsonb not null default '[]'::jsonb,
  plan_key text references public.plans (plan_key) on delete set null,
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.subscription_packages enable row level security;
revoke all on public.subscription_packages from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. tenant_modules
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_modules (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  module_key text not null,
  suite_key text,
  enabled boolean not null default true,
  licensed boolean not null default false,
  status text not null default 'enabled' check (
    status in ('enabled', 'disabled', 'trial', 'beta', 'deprecated', 'enterprise_only')
  ),
  activated_at timestamptz,
  expires_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, module_key)
);

create index if not exists tenant_modules_tenant_idx
  on public.tenant_modules (tenant_id, licensed, enabled);

alter table public.tenant_modules enable row level security;
revoke all on public.tenant_modules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. tenant_usage_metrics (monthly rollup)
-- ---------------------------------------------------------------------------
create table if not exists public.tenant_usage_metrics (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  period_month date not null,
  support_cases_handled integer not null default 0,
  autonomous_resolutions integer not null default 0,
  knowledge_searches integer not null default 0,
  employee_interactions integer not null default 0,
  insight_reports_generated integer not null default 0,
  connected_systems integer not null default 0,
  api_calls integer not null default 0,
  storage_mb integer not null default 0,
  ai_usage_volume integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, period_month)
);

alter table public.tenant_usage_metrics enable row level security;
revoke all on public.tenant_usage_metrics from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Seed subscription packages
-- ---------------------------------------------------------------------------
insert into public.subscription_packages (
  package_key, package_name, package_type, description, features, module_keys, plan_key, sort_order
)
values
  (
    'starter', 'Aipify Starter', 'core',
    'Businesses beginning their AI journey — support assistant and FAQ knowledge.',
    '["Aipify Core","Install Engine","Support Assistant","FAQ Knowledge","Human Approval","Basic Analytics"]'::jsonb,
    '["aipify_core","install_engine","skillos_foundation","support_assistant","email_draft_assistant","faq_knowledge_base","audit_logging","multi_language","human_approval_mode","basic_analytics"]'::jsonb,
    'starter', 1
  ),
  (
    'professional', 'Aipify Professional', 'suite',
    'Growing businesses requiring support automation and Business DNA.',
    '["Business DNA","Autonomous Support","Workflow Automation","Confidence Engine","Proactive Support"]'::jsonb,
    '["business_dna","support_templates","workflow_automation","autonomous_support","support_dashboards","escalation_engine","self_healing_support","proactive_support","support_knowledge_gaps","confidence_engine"]'::jsonb,
    'growth', 2
  ),
  (
    'business', 'Aipify Business', 'suite',
    'Organizations with employees and internal processes — Employee Knowledge Engine.',
    '["Employee Knowledge","Role-Based Access","Onboarding Assistant","Knowledge Health","Internal Search"]'::jsonb,
    '["employee_knowledge","internal_knowledge_search","role_based_knowledge","policy_assistant","training_content","video_knowledge","onboarding_assistant","knowledge_health","employee_knowledge_gaps","knowledge_permissions","internal_learning"]'::jsonb,
    'business', 3
  ),
  (
    'insights', 'Aipify Insights', 'addon',
    'Optional operational intelligence — trends, bottlenecks, and executive insights.',
    '["Insight Engine","Opportunity Detection","Support Trends","Executive Insight Feed"]'::jsonb,
    '["insights_engine","opportunity_detection","support_trend_analysis","knowledge_gap_analytics","bottleneck_detection","risk_signals","customer_friction_analysis","executive_insight_feed","weekly_insight_reports","insight_dashboard","improvement_recommendations"]'::jsonb,
    null, 4
  ),
  (
    'enterprise', 'Aipify Enterprise', 'enterprise',
    'Advanced intelligence, governance, and scalability for large organizations.',
    '["All Suites","Executive Dashboards","Advanced Security","SLA","Multi-Region"]'::jsonb,
    '["executive_dashboards","advanced_automation_controls","custom_integrations","dedicated_infrastructure","priority_support","advanced_audit","sla_agreements","multi_region","advanced_security","advanced_reporting","custom_workflows","enterprise_success"]'::jsonb,
    'enterprise', 5
  )
on conflict (package_key) do update set
  package_name = excluded.package_name,
  description = excluded.description,
  features = excluded.features,
  module_keys = excluded.module_keys,
  plan_key = excluded.plan_key,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- 5. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._cpa_resolve_package_key(p_tenant_id uuid)
returns text
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_plan_key text;
begin
  select coalesce(s.plan_key, s.plan_type, 'starter') into v_plan_key
  from public.subscriptions s
  where s.customer_id = p_tenant_id
  limit 1;

  return case v_plan_key
    when 'growth' then 'professional'
    when 'starter' then 'starter'
    when 'business' then 'business'
    when 'enterprise' then 'enterprise'
    else 'starter'
  end;
end;
$$;

create or replace function public._cpa_modules_for_package(p_package_key text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_modules jsonb := '[]'::jsonb;
  v_pkg record;
begin
  if p_package_key = 'enterprise' then
    select coalesce(jsonb_agg(distinct m), '[]'::jsonb) into v_modules
    from (
      select jsonb_array_elements_text(sp.module_keys) as m
      from public.subscription_packages sp
      where sp.package_key in ('starter', 'professional', 'business', 'insights', 'enterprise')
    ) mods;
    return v_modules;
  end if;

  for v_pkg in
    select sp.package_key, sp.module_keys
    from public.subscription_packages sp
    where sp.sort_order <= (
      select sort_order from public.subscription_packages where package_key = p_package_key
    )
    and sp.package_type in ('core', 'suite', 'enterprise')
    order by sp.sort_order
  loop
    v_modules := v_modules || v_pkg.module_keys;
  end loop;

  return v_modules;
end;
$$;

create or replace function public.sync_tenant_modules_from_package(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_package_key text;
  v_modules jsonb;
  v_module text;
  v_has_insights boolean;
begin
  v_package_key := public._cpa_resolve_package_key(p_tenant_id);
  v_modules := public._cpa_modules_for_package(v_package_key);

  v_has_insights := v_package_key in ('enterprise')
    or exists (
      select 1 from public.tenant_modules
      where tenant_id = p_tenant_id and module_key = 'insights_engine' and licensed
    );

  if v_has_insights or v_package_key = 'enterprise' then
    v_modules := v_modules || public._cpa_modules_for_package('insights');
  end if;

  for v_module in
    select distinct jsonb_array_elements_text(v_modules)
  loop
    insert into public.tenant_modules (
      tenant_id, module_key, licensed, enabled, status, activated_at
    )
    values (
      p_tenant_id, v_module, true, true, 'enabled', now()
    )
    on conflict (tenant_id, module_key) do update set
      licensed = true,
      enabled = case
        when tenant_modules.status = 'disabled' then tenant_modules.enabled
        else true
      end,
      updated_at = now();
  end loop;
end;
$$;

create or replace function public.ensure_tenant_commercial_setup(p_tenant_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public.sync_tenant_modules_from_package(p_tenant_id);

  insert into public.tenant_usage_metrics (tenant_id, period_month)
  values (p_tenant_id, date_trunc('month', now())::date)
  on conflict (tenant_id, period_month) do nothing;
end;
$$;

create or replace function public.is_tenant_module_enabled(
  p_tenant_id uuid,
  p_module_key text
)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.tenant_modules;
begin
  perform public.ensure_tenant_commercial_setup(p_tenant_id);

  select * into v_row
  from public.tenant_modules
  where tenant_id = p_tenant_id and module_key = p_module_key;

  if v_row.id is null then return false; end if;
  return v_row.licensed and v_row.enabled and v_row.status in ('enabled', 'trial', 'beta');
end;
$$;

create or replace function public.track_tenant_usage(
  p_metric_key text,
  p_amount integer default 1
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_period date := date_trunc('month', now())::date;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  perform public.ensure_tenant_commercial_setup(v_tenant_id);

  insert into public.tenant_usage_metrics (tenant_id, period_month)
  values (v_tenant_id, v_period)
  on conflict (tenant_id, period_month) do nothing;

  update public.tenant_usage_metrics
  set
    support_cases_handled = support_cases_handled + case when p_metric_key = 'support_cases' then p_amount else 0 end,
    autonomous_resolutions = autonomous_resolutions + case when p_metric_key = 'autonomous_resolutions' then p_amount else 0 end,
    knowledge_searches = knowledge_searches + case when p_metric_key = 'knowledge_searches' then p_amount else 0 end,
    employee_interactions = employee_interactions + case when p_metric_key = 'employee_interactions' then p_amount else 0 end,
    insight_reports_generated = insight_reports_generated + case when p_metric_key = 'insight_reports' then p_amount else 0 end,
    api_calls = api_calls + case when p_metric_key = 'api_calls' then p_amount else 0 end,
    ai_usage_volume = ai_usage_volume + case when p_metric_key = 'ai_usage' then p_amount else 0 end,
    updated_at = now()
  where tenant_id = v_tenant_id and period_month = v_period;

  return jsonb_build_object('tracked', true, 'metric', p_metric_key);
end;
$$;

create or replace function public.update_tenant_module(
  p_module_key text,
  p_enabled boolean default null,
  p_status text default null
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
begin
  perform public._bde_require_admin();
  v_tenant_id := public._presence_tenant_for_auth();

  update public.tenant_modules
  set
    enabled = coalesce(p_enabled, enabled),
    status = coalesce(p_status, status),
    activated_at = case when coalesce(p_enabled, enabled) then coalesce(activated_at, now()) else activated_at end,
    updated_at = now()
  where tenant_id = v_tenant_id
    and module_key = p_module_key
    and licensed;

  if not found then
    raise exception 'Module not licensed for this tenant';
  end if;

  return jsonb_build_object('updated', true);
end;
$$;

create or replace function public.get_upgrade_recommendations(p_tenant_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_package text;
  v_usage public.tenant_usage_metrics;
  v_recs jsonb := '[]'::jsonb;
begin
  v_package := public._cpa_resolve_package_key(p_tenant_id);

  select * into v_usage
  from public.tenant_usage_metrics
  where tenant_id = p_tenant_id
  order by period_month desc
  limit 1;

  if v_package = 'starter' and coalesce(v_usage.support_cases_handled, 0) > 20 then
    v_recs := v_recs || jsonb_build_object(
      'package_key', 'professional',
      'reason', 'Support volume suggests automation would reduce workload',
      'priority', 'high'
    );
  end if;

  if v_package in ('starter', 'professional') and coalesce(v_usage.employee_interactions, 0) > 5 then
    v_recs := v_recs || jsonb_build_object(
      'package_key', 'business',
      'reason', 'Employee knowledge interactions indicate internal process needs',
      'priority', 'medium'
    );
  end if;

  if v_package in ('starter', 'professional', 'business') then
    v_recs := v_recs || jsonb_build_object(
      'package_key', 'insights',
      'reason', 'Operational intelligence helps identify trends and bottlenecks',
      'priority', 'low',
      'addon', true
    );
  end if;

  if v_package <> 'enterprise' and coalesce(v_usage.support_cases_handled, 0) > 100 then
    v_recs := v_recs || jsonb_build_object(
      'package_key', 'enterprise',
      'reason', 'High operational scale may benefit from enterprise governance',
      'priority', 'medium'
    );
  end if;

  return v_recs;
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. Billing center
-- ---------------------------------------------------------------------------
create or replace function public.get_customer_billing_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_package_key text;
  v_pkg public.subscription_packages;
  v_limits jsonb;
  v_usage public.tenant_usage_metrics;
  v_modules jsonb;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_package_key := public._cpa_resolve_package_key(v_tenant_id);
  select * into v_pkg from public.subscription_packages where package_key = v_package_key;
  v_limits := public.get_customer_license_limits(v_tenant_id);

  select * into v_usage
  from public.tenant_usage_metrics
  where tenant_id = v_tenant_id
  order by period_month desc
  limit 1;

  select coalesce(
    jsonb_agg(jsonb_build_object(
      'module_key', tm.module_key,
      'enabled', tm.enabled,
      'licensed', tm.licensed,
      'status', tm.status
    ) order by tm.module_key),
    '[]'::jsonb
  ) into v_modules
  from public.tenant_modules tm
  where tm.tenant_id = v_tenant_id and tm.licensed;

  return jsonb_build_object(
    'has_customer', true,
    'current_package', jsonb_build_object(
      'package_key', v_package_key,
      'package_name', coalesce(v_pkg.package_name, 'Aipify Starter'),
      'description', coalesce(v_pkg.description, ''),
      'features', coalesce(v_pkg.features, '[]'::jsonb)
    ),
    'enabled_modules', v_modules,
    'usage', jsonb_build_object(
      'period_month', v_usage.period_month,
      'support_cases_handled', coalesce(v_usage.support_cases_handled, 0),
      'autonomous_resolutions', coalesce(v_usage.autonomous_resolutions, 0),
      'knowledge_searches', coalesce(v_usage.knowledge_searches, 0),
      'employee_interactions', coalesce(v_usage.employee_interactions, 0),
      'insight_reports_generated', coalesce(v_usage.insight_reports_generated, 0),
      'api_calls', coalesce(v_usage.api_calls, 0),
      'ai_usage_volume', coalesce(v_usage.ai_usage_volume, 0)
    ),
    'tenant_limits', v_limits,
    'upgrade_options', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'package_key', sp.package_key,
        'package_name', sp.package_name,
        'description', sp.description,
        'package_type', sp.package_type
      ) order by sp.sort_order)
      from public.subscription_packages sp
      where sp.active and sp.sort_order > coalesce(v_pkg.sort_order, 0)),
      '[]'::jsonb
    ),
    'addon_marketplace', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'addon_key', sp.package_key,
        'name', sp.package_name,
        'description', sp.description,
        'features', sp.features
      ))
      from public.subscription_packages sp
      where sp.package_type = 'addon' and sp.active),
      '[]'::jsonb
    ),
    'upgrade_recommendations', public.get_upgrade_recommendations(v_tenant_id),
    'billing_history', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'plan_name', s.plan_name,
        'status', s.status,
        'next_billing_date', s.next_billing_date,
        'updated_at', s.updated_at
      ) order by s.updated_at desc)
      from public.subscriptions s where s.customer_id = v_tenant_id limit 6),
      '[]'::jsonb
    ),
    'suites', jsonb_build_array(
      jsonb_build_object('key', 'aipify_core', 'label', 'Aipify Core'),
      jsonb_build_object('key', 'support_suite', 'label', 'Support Suite'),
      jsonb_build_object('key', 'operations_suite', 'label', 'Operations Suite'),
      jsonb_build_object('key', 'knowledge_suite', 'label', 'Knowledge Suite'),
      jsonb_build_object('key', 'insights_suite', 'label', 'Insights Suite'),
      jsonb_build_object('key', 'enterprise_intelligence_suite', 'label', 'Enterprise Intelligence Suite')
    ),
    'privacy_note', 'Billing shows package and usage aggregates. Payment details remain in your subscription provider.',
    'positioning', 'A modular AI-powered business operations platform designed to help organizations automate customer support, preserve institutional knowledge, improve operational efficiency, and scale through intelligent automation.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. Modules center
-- ---------------------------------------------------------------------------
create or replace function public._cpa_read_module_enabled(p_tenant_id uuid, p_module_key text)
returns boolean
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_row public.tenant_modules;
begin
  select * into v_row
  from public.tenant_modules
  where tenant_id = p_tenant_id and module_key = p_module_key;

  if v_row.id is null then
    return false;
  end if;

  return v_row.licensed
    and v_row.enabled
    and v_row.status in ('enabled', 'trial', 'beta');
end;
$$;

create or replace function public.get_customer_modules_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_tenant_id uuid;
  v_package_key text;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then return jsonb_build_object('has_customer', false); end if;

  v_package_key := public._cpa_resolve_package_key(v_tenant_id);

  return jsonb_build_object(
    'has_customer', true,
    'current_package', v_package_key,
    'installed_modules', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'module_key', tm.module_key,
        'enabled', tm.enabled,
        'licensed', tm.licensed,
        'status', tm.status,
        'activated_at', tm.activated_at,
        'expires_at', tm.expires_at
      ) order by tm.module_key)
      from public.tenant_modules tm where tm.tenant_id = v_tenant_id and tm.licensed),
      '[]'::jsonb
    ),
    'available_modules', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'module_key', m,
        'licensed', public._cpa_read_module_enabled(v_tenant_id, m)
      ))
      from (
        select distinct jsonb_array_elements_text(sp.module_keys) as m
        from public.subscription_packages sp where sp.active
      ) all_mods
      where not exists (
        select 1 from public.tenant_modules tm
        where tm.tenant_id = v_tenant_id and tm.module_key = all_mods.m and tm.licensed
      )),
      '[]'::jsonb
    ),
    'trial_modules', coalesce(
      (select jsonb_agg(jsonb_build_object('module_key', tm.module_key, 'status', tm.status))
      from public.tenant_modules tm
      where tm.tenant_id = v_tenant_id and tm.status = 'trial'),
      '[]'::jsonb
    ),
    'upgrade_recommendations', public.get_upgrade_recommendations(v_tenant_id),
    'feature_flag_states', jsonb_build_array('enabled', 'disabled', 'trial', 'beta', 'deprecated', 'enterprise_only'),
    'packages', coalesce(
      (select jsonb_agg(jsonb_build_object(
        'package_key', sp.package_key,
        'package_name', sp.package_name,
        'package_type', sp.package_type,
        'module_count', jsonb_array_length(sp.module_keys)
      ) order by sp.sort_order)
      from public.subscription_packages sp where sp.active),
      '[]'::jsonb
    ),
    'documentation_note', 'Each module maps to an Aipify capability. Enable only purchased modules.',
    'integrations', jsonb_build_object(
      'license_center', 'Subscription status at /app/license',
      'skillos', 'Skills respect plan and module gates',
      'trust_actions', 'Enterprise-only actions require enterprise package'
    )
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 8. Platform overview
-- ---------------------------------------------------------------------------
create or replace function public.get_platform_commercial_packages_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_platform_admin() then raise exception 'Not authorized'; end if;

  return jsonb_build_object(
    'privacy_note', 'Aggregates only — no tenant billing details exposed.',
    'packages', (select count(*) from public.subscription_packages where active),
    'tenants_with_modules', (select count(distinct tenant_id) from public.tenant_modules),
    'licensed_modules', (select count(*) from public.tenant_modules where licensed),
    'enabled_modules', (select count(*) from public.tenant_modules where licensed and enabled),
    'trial_modules', (select count(*) from public.tenant_modules where status = 'trial'),
    'by_package', coalesce(
      (select jsonb_object_agg(pkg, cnt)
      from (
        select public._cpa_resolve_package_key(c.id) as pkg, count(*) as cnt
        from public.customers c
        group by 1
      ) x),
      '{}'::jsonb
    )
  );
end;
$$;

grant execute on function public._cpa_resolve_package_key(uuid) to authenticated;
grant execute on function public._cpa_modules_for_package(text) to authenticated;
grant execute on function public.sync_tenant_modules_from_package(uuid) to authenticated;
grant execute on function public.ensure_tenant_commercial_setup(uuid) to authenticated;
grant execute on function public.is_tenant_module_enabled(uuid, text) to authenticated;
grant execute on function public.track_tenant_usage(text, integer) to authenticated;
grant execute on function public.update_tenant_module(text, boolean, text) to authenticated;
grant execute on function public.get_upgrade_recommendations(uuid) to authenticated;
grant execute on function public.get_customer_billing_center() to authenticated;
grant execute on function public._cpa_read_module_enabled(uuid, text) to authenticated;
grant execute on function public.get_customer_modules_center() to authenticated;
grant execute on function public.get_platform_commercial_packages_overview() to authenticated;
