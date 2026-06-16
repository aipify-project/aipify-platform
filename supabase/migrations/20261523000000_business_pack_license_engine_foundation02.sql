-- Foundation 02 — Business Pack License Engine
-- Feature owner: PLATFORM FOUNDATION. Helpers: _bple_* (engine), _bplef02_* (blueprint)
-- Core principle: Paid = Access Now

create table if not exists public.business_pack_license_definitions (
  id uuid primary key default gen_random_uuid(),
  pack_key text not null unique,
  pack_name text not null,
  license_metric text not null check (
    license_metric in ('properties', 'stores', 'agents', 'users', 'employees', 'campaigns', 'partner_seats', 'workspaces')
  ),
  metric_label text not null,
  metric_label_plural text not null,
  tiers jsonb not null default '[]'::jsonb,
  trial_config jsonb not null default '{}'::jsonb,
  downgrade_rules jsonb not null default '{}'::jsonb,
  renewal_rules jsonb not null default '{}'::jsonb,
  failed_payment_rules jsonb not null default '{}'::jsonb,
  enterprise_rules jsonb not null default '{}'::jsonb,
  upgrade_path jsonb not null default '[]'::jsonb,
  feature_comparison jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.business_pack_license_definitions enable row level security;
revoke all on public.business_pack_license_definitions from authenticated, anon;

create table if not exists public.business_pack_license_tenant_state (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references public.customers (id) on delete cascade,
  pack_key text not null,
  tier_key text not null default 'growth',
  capacity_limit int,
  custom_capacity int,
  billing_frequency text not null default 'monthly' check (
    billing_frequency in ('monthly', 'annual', 'enterprise_invoice', 'trial')
  ),
  license_status text not null default 'active' check (
    license_status in ('active', 'trial', 'grace_period', 'read_only', 'suspended', 'cancelled')
  ),
  renewal_date date,
  trial_ends_at timestamptz,
  usage_count int not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (tenant_id, pack_key)
);

create index if not exists business_pack_license_tenant_state_tenant_idx
  on public.business_pack_license_tenant_state (tenant_id, pack_key);

alter table public.business_pack_license_tenant_state enable row level security;
revoke all on public.business_pack_license_tenant_state from authenticated, anon;

create table if not exists public.business_pack_license_audit_logs (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid references public.customers (id) on delete set null,
  pack_key text not null,
  action text not null check (
    action in (
      'license_activated', 'license_upgraded', 'license_downgraded', 'trial_activated',
      'trial_expired', 'enterprise_conversion', 'renewal_recorded', 'payment_failed',
      'grace_period_started', 'capacity_check', 'center_view', 'upgrade_started'
    )
  ),
  summary text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists business_pack_license_audit_tenant_idx
  on public.business_pack_license_audit_logs (tenant_id, created_at desc);

alter table public.business_pack_license_audit_logs enable row level security;
revoke all on public.business_pack_license_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'business_pack_license', v.description
from (values
  ('business_pack_license.view', 'View Business Pack Licenses', 'View pack license center and usage'),
  ('business_pack_license.manage', 'Manage Business Pack Licenses', 'Manage marketplace license definitions'),
  ('business_pack_license.upgrade', 'Upgrade Business Pack Licenses', 'Upgrade pack licenses and subscriptions')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'business_pack_license.view'), ('owner', 'business_pack_license.upgrade'),
  ('administrator', 'business_pack_license.view'), ('administrator', 'business_pack_license.upgrade'),
  ('manager', 'business_pack_license.view'),
  ('viewer', 'business_pack_license.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

create or replace function public._bple_require_view()
returns void language plpgsql security definer set search_path = public as $$
begin
  if public.is_platform_admin() then return; end if;
  perform public._irp_require_permission('business_pack_license.view');
exception when others then
  if public.is_platform_admin() then return; end if;
  raise;
end; $$;

create or replace function public._bple_require_tenant()
returns uuid language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
begin
  v_tenant_id := public._presence_tenant_for_auth();
  if v_tenant_id is null then raise exception 'No tenant context'; end if;
  return v_tenant_id;
end; $$;

create or replace function public._bple_log(
  p_tenant_id uuid, p_pack_key text, p_action text, p_summary text, p_context jsonb default '{}'::jsonb
) returns uuid language plpgsql security definer set search_path = public as $$
declare v_id uuid;
begin
  insert into public.business_pack_license_audit_logs (tenant_id, pack_key, action, summary, actor_user_id, context)
  values (p_tenant_id, p_pack_key, p_action, p_summary, public._mta_app_user_id(), coalesce(p_context, '{}'::jsonb))
  returning id into v_id;
  return v_id;
end; $$;

create or replace function public._bplef02_principle()
returns text language sql immutable as $$
  select 'Paid = Access Now. Approved payments activate licenses immediately — no support intervention required.';
$$;

create or replace function public._bplef02_upgrade_flow()
returns jsonb language sql immutable as $$
  select jsonb_build_array(
    'discover', 'select_license', 'checkout', 'payment_approved',
    'feature_flags_updated', 'permissions_updated', 'workspace_refreshed', 'ready_to_use'
  );
$$;

create or replace function public._bple_default_renewal_rules()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'monthly_billing', true,
    'annual_billing', true,
    'renewal_reminder_days', jsonb_build_array(7, 3, 1),
    'failed_payment', jsonb_build_object(
      'grace_period_days', 3,
      'read_only_after_grace', false,
      'suspension_warnings', true,
      'deactivation_timeline_days', 30
    )
  );
$$;

create or replace function public._bple_default_downgrade_rules()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'downgrade_eligible', true,
    'capacity_restriction', 'active_usage_must_fit_new_limit',
    'data_retention', 'settings_and_data_preserved_never_deleted',
    'grace_period_days', 3
  );
$$;

create or replace function public._bple_default_enterprise_rules()
returns jsonb language sql immutable as $$
  select jsonb_build_object(
    'custom_agreements', true,
    'custom_capacity', true,
    'dedicated_onboarding', true,
    'invoice_billing', true,
    'additional_governance', true
  );
$$;

create or replace function public._bple_seed_definitions()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.business_pack_license_definitions (
    pack_key, pack_name, license_metric, metric_label, metric_label_plural,
    tiers, trial_config, downgrade_rules, renewal_rules, failed_payment_rules,
    enterprise_rules, upgrade_path, feature_comparison
  )
  select v.pack_key, v.pack_name, v.metric, v.metric_label, v.metric_plural,
    v.tiers::jsonb, v.trial::jsonb, public._bple_default_downgrade_rules(),
    public._bple_default_renewal_rules(), v.failed::jsonb, public._bple_default_enterprise_rules(),
    v.upgrade_path::jsonb, v.features::jsonb
  from (values
    (
      'aipify_hosts', 'Aipify Hosts', 'properties', 'Property', 'Properties',
      '[{"key":"entry","label":"Hosts Solo","tier_type":"entry","capacity_min":1,"capacity_max":1,"monthly_price":49,"annual_price":470},{"key":"growth","label":"Hosts Growth","tier_type":"growth","capacity_min":1,"capacity_max":5,"monthly_price":149,"annual_price":1430},{"key":"professional","label":"Hosts Professional","tier_type":"professional","capacity_min":5,"capacity_max":10,"monthly_price":249,"annual_price":2390},{"key":"business","label":"Hosts Business","tier_type":"business","capacity_min":10,"capacity_max":20,"monthly_price":399,"annual_price":3830},{"key":"enterprise","label":"Hosts Enterprise","tier_type":"enterprise","capacity_min":null,"capacity_max":null,"custom_capacity":true,"contact_sales":true}]',
      '{"available":true,"duration_days":14,"type":"unrestricted","limitations":{}}',
      '{"grace_period_days":3,"read_only_after_grace":false,"suspension_warnings":true,"deactivation_timeline_days":30}',
      '["entry","growth","professional","business","enterprise","addon_property_license"]',
      '[{"feature":"All Hosts modules","entry":true,"growth":true,"professional":true,"business":true,"enterprise":true},{"feature":"Property capacity","entry":"1","growth":"1–5","professional":"5–10","business":"10–20","enterprise":"Custom"},{"feature":"+1 Property License","entry":false,"growth":true,"professional":true,"business":true,"enterprise":true}]'
    ),
    (
      'aipify_commerce', 'Aipify Commerce', 'stores', 'Store', 'Stores',
      '[{"key":"entry","label":"Commerce Starter","tier_type":"entry","capacity_min":1,"capacity_max":1,"monthly_price":99,"annual_price":950},{"key":"growth","label":"Commerce Growth","tier_type":"growth","capacity_min":1,"capacity_max":3,"monthly_price":149,"annual_price":1430},{"key":"professional","label":"Commerce Professional","tier_type":"professional","capacity_min":3,"capacity_max":10,"monthly_price":249,"annual_price":2390},{"key":"enterprise","label":"Commerce Enterprise","tier_type":"enterprise","custom_capacity":true,"contact_sales":true}]',
      '{"available":true,"duration_days":14,"type":"limited_capacity","limitations":{"stores":1}}',
      '{"grace_period_days":3,"read_only_after_grace":false,"suspension_warnings":true,"deactivation_timeline_days":30}',
      '["entry","growth","professional","enterprise"]',
      '[{"feature":"Order support","entry":true,"growth":true,"professional":true,"enterprise":true},{"feature":"Store capacity","entry":"1","growth":"1–3","professional":"3–10","enterprise":"Custom"},{"feature":"Margin analytics","entry":false,"growth":true,"professional":true,"enterprise":true}]'
    ),
    (
      'aipify_support', 'Aipify Support', 'agents', 'Agent', 'Agents',
      '[{"key":"entry","label":"Support Starter","tier_type":"entry","capacity_min":1,"capacity_max":3,"monthly_price":79,"annual_price":760},{"key":"growth","label":"Support Growth","tier_type":"growth","capacity_min":3,"capacity_max":10,"monthly_price":129,"annual_price":1240},{"key":"professional","label":"Support Professional","tier_type":"professional","capacity_min":10,"capacity_max":25,"monthly_price":199,"annual_price":1910},{"key":"enterprise","label":"Support Enterprise","tier_type":"enterprise","custom_capacity":true,"contact_sales":true}]',
      '{"available":true,"duration_days":30,"type":"limited_capacity","limitations":{"agents":2}}',
      '{"grace_period_days":3,"read_only_after_grace":false,"suspension_warnings":true,"deactivation_timeline_days":30}',
      '["entry","growth","professional","enterprise"]',
      '[{"feature":"Support inbox","entry":true,"growth":true,"professional":true,"enterprise":true},{"feature":"Agent seats","entry":"1–3","growth":"3–10","professional":"10–25","enterprise":"Custom"},{"feature":"Quality governance","entry":false,"growth":true,"professional":true,"enterprise":true}]'
    ),
    (
      'aipify_executive', 'Aipify Executive', 'users', 'User', 'Users',
      '[{"key":"entry","label":"Executive Team","tier_type":"entry","capacity_min":1,"capacity_max":5,"monthly_price":199,"annual_price":1910},{"key":"growth","label":"Executive Growth","tier_type":"growth","capacity_min":5,"capacity_max":15,"monthly_price":349,"annual_price":3350},{"key":"professional","label":"Executive Professional","tier_type":"professional","capacity_min":15,"capacity_max":50,"monthly_price":599,"annual_price":5750},{"key":"enterprise","label":"Executive Enterprise","tier_type":"enterprise","custom_capacity":true,"contact_sales":true}]',
      '{"available":false,"duration_days":0,"type":"none","limitations":{}}',
      '{"grace_period_days":3,"read_only_after_grace":false,"suspension_warnings":true,"deactivation_timeline_days":30}',
      '["entry","growth","professional","enterprise"]',
      '[{"feature":"Executive briefings","entry":true,"growth":true,"professional":true,"enterprise":true},{"feature":"Leadership users","entry":"1–5","growth":"5–15","professional":"15–50","enterprise":"Custom"},{"feature":"Governance visibility","entry":false,"growth":true,"professional":true,"enterprise":true}]'
    ),
    (
      'aipify_growth', 'Aipify Growth', 'employees', 'Employee', 'Employees',
      '[{"key":"entry","label":"Growth Starter","tier_type":"entry","capacity_min":1,"capacity_max":25,"monthly_price":129,"annual_price":1240},{"key":"growth","label":"Growth Team","tier_type":"growth","capacity_min":25,"capacity_max":100,"monthly_price":249,"annual_price":2390},{"key":"professional","label":"Growth Professional","tier_type":"professional","capacity_min":100,"capacity_max":500,"monthly_price":449,"annual_price":4310},{"key":"enterprise","label":"Growth Enterprise","tier_type":"enterprise","custom_capacity":true,"contact_sales":true}]',
      '{"available":true,"duration_days":14,"type":"unrestricted","limitations":{}}',
      '{"grace_period_days":3,"read_only_after_grace":false,"suspension_warnings":true,"deactivation_timeline_days":30}',
      '["entry","growth","professional","enterprise"]',
      '[{"feature":"Growth insights","entry":true,"growth":true,"professional":true,"enterprise":true},{"feature":"Employee scope","entry":"1–25","growth":"25–100","professional":"100–500","enterprise":"Custom"}]'
    ),
    (
      'general_business', 'Aipify Essentials', 'employees', 'Employee', 'Employees',
      '[{"key":"entry","label":"Essentials","tier_type":"entry","capacity_min":1,"capacity_max":10,"monthly_price":49,"annual_price":470},{"key":"growth","label":"Essentials Growth","tier_type":"growth","capacity_min":10,"capacity_max":50,"monthly_price":99,"annual_price":950},{"key":"professional","label":"Essentials Professional","tier_type":"professional","capacity_min":50,"capacity_max":200,"monthly_price":199,"annual_price":1910},{"key":"enterprise","label":"Essentials Enterprise","tier_type":"enterprise","custom_capacity":true,"contact_sales":true}]',
      '{"available":true,"duration_days":14,"type":"unrestricted","limitations":{}}',
      '{"grace_period_days":3,"read_only_after_grace":false,"suspension_warnings":true,"deactivation_timeline_days":30}',
      '["entry","growth","professional","enterprise"]',
      '[{"feature":"Core modules","entry":true,"growth":true,"professional":true,"enterprise":true},{"feature":"Team size","entry":"1–10","growth":"10–50","professional":"50–200","enterprise":"Custom"}]'
    )
  ) as v(pack_key, pack_name, metric, metric_label, metric_plural, tiers, trial, failed, upgrade_path, features)
  on conflict (pack_key) do update set
    pack_name = excluded.pack_name,
    license_metric = excluded.license_metric,
    metric_label = excluded.metric_label,
    metric_label_plural = excluded.metric_label_plural,
    tiers = excluded.tiers,
    trial_config = excluded.trial_config,
    upgrade_path = excluded.upgrade_path,
    feature_comparison = excluded.feature_comparison,
    updated_at = now();
end; $$;

create or replace function public._bple_resolve_pack_usage(p_tenant_id uuid, p_pack_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_usage int := 0;
  v_limit int;
  v_capacity jsonb;
begin
  if p_pack_key = 'aipify_hosts' and exists (select 1 from pg_proc where proname = 'assert_aipify_hosts_property_capacity') then
    v_capacity := public.assert_aipify_hosts_property_capacity(p_tenant_id);
    return jsonb_build_object(
      'usage_count', coalesce((v_capacity->>'active_property_count')::int, 0),
      'capacity_limit', coalesce((v_capacity->>'property_limit')::int, 0),
      'remaining_capacity', coalesce((v_capacity->>'remaining_capacity')::int, 0),
      'at_capacity', coalesce((v_capacity->>'at_capacity')::boolean, false),
      'upgrade_required', coalesce((v_capacity->>'upgrade_required')::boolean, false),
      'capacity_label', v_capacity->>'capacity_label',
      'tier_key', v_capacity->>'plan_type',
      'source', 'aipify_hosts_property_licensing'
    );
  end if;

  select usage_count, capacity_limit into v_usage, v_limit
  from public.business_pack_license_tenant_state
  where tenant_id = p_tenant_id and pack_key = p_pack_key;

  return jsonb_build_object(
    'usage_count', coalesce(v_usage, 0),
    'capacity_limit', v_limit,
    'remaining_capacity', case when v_limit is null then null else greatest(0, v_limit - coalesce(v_usage, 0)) end,
    'at_capacity', case when v_limit is null then false else coalesce(v_usage, 0) >= v_limit end,
    'upgrade_required', case when v_limit is null then false else coalesce(v_usage, 0) >= v_limit end,
    'source', 'tenant_state'
  );
end; $$;

create or replace function public._bple_ensure_tenant_state(p_tenant_id uuid, p_pack_key text)
returns public.business_pack_license_tenant_state language plpgsql security definer set search_path = public as $$
declare v_def public.business_pack_license_definitions;
  v_row public.business_pack_license_tenant_state;
  v_tier jsonb;
  v_limit int;
begin
  select * into v_def from public.business_pack_license_definitions where pack_key = p_pack_key;
  if v_def.id is null then raise exception 'License definition not found'; end if;

  insert into public.business_pack_license_tenant_state (tenant_id, pack_key, tier_key, capacity_limit, billing_frequency, license_status)
  values (p_tenant_id, p_pack_key, 'growth', null, 'monthly', 'active')
  on conflict (tenant_id, pack_key) do nothing;

  select * into v_row from public.business_pack_license_tenant_state where tenant_id = p_tenant_id and pack_key = p_pack_key;

  if v_row.capacity_limit is null then
    select t into v_tier from jsonb_array_elements(v_def.tiers) t where t->>'key' = v_row.tier_key limit 1;
    if v_tier is null then
      select t into v_tier from jsonb_array_elements(v_def.tiers) t where t->>'tier_type' = 'growth' limit 1;
    end if;
    if v_tier is not null then
      v_limit := coalesce((v_tier->>'capacity_max')::int, (v_tier->>'capacity_min')::int);
      update public.business_pack_license_tenant_state
      set capacity_limit = v_limit, updated_at = now()
      where id = v_row.id
      returning * into v_row;
    end if;
  end if;

  return v_row;
end; $$;

create or replace function public.get_business_pack_license_center(p_pack_key text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_tenant_id uuid;
  v_def public.business_pack_license_definitions;
  v_state public.business_pack_license_tenant_state;
  v_usage jsonb;
  v_subscription jsonb := '{}'::jsonb;
begin
  perform public._bple_require_view();
  v_tenant_id := public._bple_require_tenant();
  perform public._bple_seed_definitions();

  select * into v_def from public.business_pack_license_definitions where pack_key = p_pack_key;
  if v_def.id is null then
    return jsonb_build_object('found', false, 'pack_key', p_pack_key);
  end if;

  v_state := public._bple_ensure_tenant_state(v_tenant_id, p_pack_key);
  v_usage := public._bple_resolve_pack_usage(v_tenant_id, p_pack_key);

  if exists (select 1 from pg_proc where proname = 'get_customer_license_center') then
    begin
      v_subscription := coalesce(public.get_customer_license_center()->'subscription', '{}'::jsonb);
    exception when others then
      v_subscription := '{}'::jsonb;
    end;
  end if;

  perform public._bple_log(v_tenant_id, p_pack_key, 'center_view', 'Pack license center viewed', '{}'::jsonb);

  return jsonb_build_object(
    'found', true,
    'principle', public._bplef02_principle(),
    'pack_key', p_pack_key,
    'definition', jsonb_build_object(
      'pack_name', v_def.pack_name,
      'license_metric', v_def.license_metric,
      'metric_label', v_def.metric_label,
      'metric_label_plural', v_def.metric_label_plural,
      'tiers', v_def.tiers,
      'trial_config', v_def.trial_config,
      'downgrade_rules', v_def.downgrade_rules,
      'renewal_rules', v_def.renewal_rules,
      'failed_payment_rules', v_def.failed_payment_rules,
      'enterprise_rules', v_def.enterprise_rules,
      'upgrade_path', v_def.upgrade_path,
      'feature_comparison', v_def.feature_comparison
    ),
    'overview', jsonb_build_object(
      'current_tier', coalesce(v_usage->>'tier_key', v_state.tier_key),
      'license_status', v_state.license_status,
      'billing_frequency', v_state.billing_frequency,
      'renewal_date', v_state.renewal_date,
      'trial_ends_at', v_state.trial_ends_at,
      'plan_name', coalesce(v_subscription->>'plan_name', v_def.pack_name)
    ),
    'usage', jsonb_build_object(
      'usage_count', coalesce((v_usage->>'usage_count')::int, v_state.usage_count),
      'capacity_limit', coalesce((v_usage->>'capacity_limit')::int, v_state.capacity_limit),
      'remaining_capacity', v_usage->'remaining_capacity',
      'capacity_label', v_usage->>'capacity_label',
      'at_capacity', coalesce((v_usage->>'at_capacity')::boolean, false),
      'upgrade_required', coalesce((v_usage->>'upgrade_required')::boolean, false),
      'metric_label', v_def.metric_label,
      'metric_label_plural', v_def.metric_label_plural
    ),
    'upgrade', jsonb_build_object(
      'available_tiers', v_def.tiers,
      'feature_comparison', v_def.feature_comparison,
      'upgrade_flow', public._bplef02_upgrade_flow(),
      'activation_route', '/app/marketplace/activation?pack=' || p_pack_key,
      'billing_route', '/app/settings/billing/packages',
      'landing_route', '/app/marketplace/packs/' || p_pack_key
    ),
    'visibility', jsonb_build_object(
      'current_plan', true,
      'capacity_usage', true,
      'upgrade_options', true,
      'billing_frequency', true,
      'renewal_date', true
    ),
    'governance_note', 'Customers manage their own subscriptions. Growth Partners see partner licensing only.'
  );
end; $$;

create or replace function public.get_business_pack_license_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._bple_require_view();
  perform public._bple_seed_definitions();

  return jsonb_build_object(
    'has_access', true,
    'is_platform_admin', public.is_platform_admin(),
    'principle', public._bplef02_principle(),
    'upgrade_flow', public._bplef02_upgrade_flow(),
    'governance', jsonb_build_object(
      'super_admin', 'Defines licensing standards',
      'platform_admin', 'Manages marketplace licenses',
      'customers', 'Manage their own subscriptions',
      'growth_partners', 'View partner-related licensing information only'
    ),
    'license_metrics', jsonb_build_array(
      jsonb_build_object('pack', 'Hosts', 'metric', 'properties'),
      jsonb_build_object('pack', 'Commerce', 'metric', 'stores'),
      jsonb_build_object('pack', 'Support', 'metric', 'agents'),
      jsonb_build_object('pack', 'Executive', 'metric', 'users'),
      jsonb_build_object('pack', 'Operations', 'metric', 'employees'),
      jsonb_build_object('pack', 'Marketing', 'metric', 'campaigns'),
      jsonb_build_object('pack', 'Growth Partners', 'metric', 'partner_seats')
    ),
    'summary', jsonb_build_object(
      'pack_definitions', (select count(*) from public.business_pack_license_definitions),
      'active_tenant_licenses', (select count(*) from public.business_pack_license_tenant_state where license_status = 'active'),
      'trial_licenses', (select count(*) from public.business_pack_license_tenant_state where license_status = 'trial'),
      'audit_events', (select count(*) from public.business_pack_license_audit_logs)
    ),
    'definitions', coalesce((
      select jsonb_agg(jsonb_build_object(
        'pack_key', d.pack_key,
        'pack_name', d.pack_name,
        'license_metric', d.license_metric,
        'tier_count', jsonb_array_length(d.tiers),
        'trial_available', coalesce((d.trial_config->>'available')::boolean, false),
        'license_center_route', '/app/marketplace/packs/' || d.pack_key || '/license'
      ) order by d.pack_name)
      from public.business_pack_license_definitions d
    ), '[]'::jsonb),
    'recent_audit', coalesce((
      select jsonb_agg(row_to_json(a) order by a.created_at desc)
      from (select * from public.business_pack_license_audit_logs order by created_at desc limit 15) a
    ), '[]'::jsonb),
    'success_criteria', jsonb_build_array(
      'Customers understand what they have',
      'Customers understand what they need',
      'Customers understand what happens if they grow',
      'Customers know how to upgrade'
    )
  );
exception when others then
  return jsonb_build_object('has_access', false);
end; $$;

create or replace function public.get_business_pack_license_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  perform public._bple_seed_definitions();
  return jsonb_build_object(
    'has_access', true,
    'pack_count', (select count(*) from public.business_pack_license_definitions),
    'principle', public._bplef02_principle()
  );
exception when others then
  return jsonb_build_object('has_access', false);
end; $$;

create or replace function public.perform_business_pack_license_action(
  p_action_type text,
  p_pack_key text default null,
  p_payload jsonb default '{}'::jsonb
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_tenant_id uuid;
  v_state public.business_pack_license_tenant_state;
  v_tier_key text;
  v_result jsonb;
begin
  v_tenant_id := public._bple_require_tenant();

  if p_action_type = 'start_upgrade' then
    perform public._irp_require_permission('business_pack_license.upgrade');
    perform public._bple_log(v_tenant_id, p_pack_key, 'upgrade_started', 'License upgrade started', p_payload);
    return jsonb_build_object(
      'action', p_action_type,
      'status', 'redirect',
      'activation_route', '/app/marketplace/activation?pack=' || p_pack_key,
      'billing_route', '/app/settings/billing/packages',
      'message', 'Paid = Access Now — complete checkout to activate immediately.'
    );
  end if;

  if p_action_type = 'activate_trial' then
    perform public._irp_require_permission('business_pack_license.upgrade');
    v_state := public._bple_ensure_tenant_state(v_tenant_id, p_pack_key);
    update public.business_pack_license_tenant_state
    set license_status = 'trial',
        trial_ends_at = now() + interval '14 days',
        billing_frequency = 'trial',
        updated_at = now()
    where tenant_id = v_tenant_id and pack_key = p_pack_key
    returning * into v_state;
    perform public._bple_log(v_tenant_id, p_pack_key, 'trial_activated', 'Trial license activated', p_payload);

    if exists (select 1 from pg_proc where proname = 'perform_marketplace_self_service_action') then
      begin
        v_result := public.perform_marketplace_self_service_action('start_trial', p_pack_key, p_payload);
      exception when others then null;
      end;
    end if;

    return jsonb_build_object('action', p_action_type, 'status', 'trial_active', 'state', row_to_json(v_state)::jsonb);
  end if;

  if p_action_type = 'apply_tier' then
    perform public._irp_require_permission('business_pack_license.upgrade');
    v_tier_key := p_payload->>'tier_key';
    if v_tier_key is null then raise exception 'tier_key required'; end if;

    update public.business_pack_license_tenant_state
    set tier_key = v_tier_key,
        license_status = 'active',
        billing_frequency = coalesce(p_payload->>'billing_frequency', 'monthly'),
        updated_at = now()
    where tenant_id = v_tenant_id and pack_key = p_pack_key
    returning * into v_state;

    v_state := public._bple_ensure_tenant_state(v_tenant_id, p_pack_key);
    perform public._bple_log(v_tenant_id, p_pack_key, 'license_upgraded', 'License tier applied: ' || v_tier_key, p_payload);

    return jsonb_build_object(
      'action', p_action_type,
      'status', 'activated',
      'message', 'License activated. Your workspace has been refreshed — no logout required.',
      'state', row_to_json(v_state)::jsonb
    );
  end if;

  if p_action_type = 'check_capacity' then
    return public._bple_resolve_pack_usage(v_tenant_id, p_pack_key)
      || jsonb_build_object('action', p_action_type, 'principle', public._bplef02_principle());
  end if;

  if p_action_type = 'publish_definition' then
    if not public.is_platform_admin() then raise exception 'Platform admin required'; end if;
    perform public._bple_seed_definitions();
    return jsonb_build_object('action', p_action_type, 'status', 'published');
  end if;

  raise exception 'Unknown action type';
end; $$;

create or replace function public.seed_business_pack_license_knowledge()
returns void language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from pg_proc where proname = '_ahostkc_ensure_category') then return; end if;
  perform public._ahostkc_ensure_category(
    'licensing', 'Licensing',
    'Understand Aipify Business Pack licenses, plans, upgrades, and subscriptions.', 385
  );
  perform public._ahostkc_seed_article('licensing', 'understanding-licenses', 'Understanding licenses',
    'Each Aipify Business Pack licenses operational capacity — properties for Hosts, stores for Commerce, agents for Support. You pay for the capacity you need. All pack features remain available; limits apply to capacity only.');
  perform public._ahostkc_seed_article('licensing', 'choosing-the-right-plan', 'Choosing the right plan',
    'Review Entry, Growth, Professional, and Enterprise tiers on each pack License Center. Match your current usage and expected growth. Aipify recommends upgrades before you reach capacity limits.');
  perform public._ahostkc_seed_article('licensing', 'upgrading-business-packs', 'Upgrading Business Packs',
    'Paid = Access Now. After approved payment, feature flags, permissions, and your workspace refresh automatically — no support ticket and no logout required.');
  perform public._ahostkc_seed_article('licensing', 'managing-subscriptions', 'Managing subscriptions',
    'View current plan, capacity usage, billing frequency, and renewal date in each pack License Center or at /app/license. Downgrades require active usage to fit the new limit.');
  perform public._ahostkc_seed_article('licensing', 'enterprise-licensing', 'Enterprise licensing',
    'Enterprise licenses support custom agreements, custom capacities, dedicated onboarding, invoice billing, and additional governance requirements. Contact Aipify sales for Enterprise activation.');
end; $$;

select public._bple_seed_definitions();
select public.seed_business_pack_license_knowledge();

grant execute on function public.get_business_pack_license_center(text) to authenticated;
grant execute on function public.get_business_pack_license_engine_dashboard() to authenticated;
grant execute on function public.get_business_pack_license_engine_card() to authenticated;
grant execute on function public.perform_business_pack_license_action(text, text, jsonb) to authenticated;
