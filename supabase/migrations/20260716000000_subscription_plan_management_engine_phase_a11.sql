-- Phase A.11 — Subscription & Plan Management Engine
-- Principle: tenant-aware subscriptions, plan-based module access, upgrade readiness, downgrade safeguards.

alter table public.decision_explanations drop constraint if exists decision_explanations_decision_type_check;
alter table public.decision_explanations add constraint decision_explanations_decision_type_check check (
  decision_type in (
    'governance', 'policy', 'marketplace', 'blueprint', 'desktop', 'action',
    'briefing', 'support', 'knowledge_gap', 'automation', 'value', 'evolution',
    'learning', 'security', 'agent_collaboration', 'simulation', 'continuity',
    'strategy', 'human_success', 'workstyle', 'evolution_governance', 'outcomes',
    'customer_success', 'platform_integrity', 'ecosystem', 'community',
    'marketplace_governance', 'partner_certification', 'enterprise_deployment',
    'billing_commercial', 'academy_learning', 'global_localization',
    'innovation_experimentation', 'future_technologies', 'aipify_constitution',
    'aipify_manifesto', 'platform_install', 'commerce_intelligence',
    'product_automation', 'dropshipping_operations', 'commerce_performance',
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture',
    'identity_permissions', 'secure_ai_action', 'audit_accountability',
    'knowledge_center_engine', 'admin_assistant_engine', 'support_ai_engine',
    'integration_engine', 'operations_dashboard_engine', 'customer_onboarding_engine',
    'subscription_plan_management_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_subscriptions
-- ---------------------------------------------------------------------------
create table if not exists public.organization_subscriptions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  plan_key text not null default 'starter' check (
    plan_key in ('starter', 'business', 'professional', 'enterprise', 'internal')
  ),
  status text not null default 'trial' check (
    status in ('trial', 'active', 'past_due', 'cancelled', 'expired', 'internal')
  ),
  started_at timestamptz not null default now(),
  expires_at timestamptz,
  trial_ends_at timestamptz,
  billing_cycle text not null default 'monthly' check (billing_cycle in ('monthly', 'yearly')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_subscriptions_org_idx
  on public.organization_subscriptions (organization_id, status, plan_key);

alter table public.organization_subscriptions enable row level security;
revoke all on public.organization_subscriptions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. plan_modules
-- ---------------------------------------------------------------------------
create table if not exists public.plan_modules (
  id uuid primary key default gen_random_uuid(),
  plan_key text not null check (
    plan_key in ('starter', 'business', 'professional', 'enterprise', 'internal')
  ),
  module_key text not null,
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  unique (plan_key, module_key)
);

create index if not exists plan_modules_plan_idx on public.plan_modules (plan_key, enabled);

alter table public.plan_modules enable row level security;
revoke all on public.plan_modules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. spm_settings (trial + billing readiness scaffold)
-- ---------------------------------------------------------------------------
create table if not exists public.spm_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  trial_duration_days int not null default 14 check (trial_duration_days between 1 and 90),
  trial_notifications_enabled boolean not null default true,
  billing_provider text not null default 'manual' check (
    billing_provider in ('stripe', 'paddle', 'manual')
  ),
  billing_ready boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.spm_settings enable row level security;
revoke all on public.spm_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. Seed plan_modules
-- ---------------------------------------------------------------------------
insert into public.plan_modules (plan_key, module_key, enabled)
select v.plan, v.module, true
from (values
  ('starter', 'aipify_core_platform'),
  ('starter', 'knowledge_center_engine'),
  ('starter', 'operations_dashboard_engine'),
  ('business', 'aipify_core_platform'),
  ('business', 'knowledge_center_engine'),
  ('business', 'operations_dashboard_engine'),
  ('business', 'support_ai_engine'),
  ('business', 'admin_assistant_engine'),
  ('business', 'integration_engine'),
  ('professional', 'aipify_core_platform'),
  ('professional', 'knowledge_center_engine'),
  ('professional', 'operations_dashboard_engine'),
  ('professional', 'support_ai_engine'),
  ('professional', 'admin_assistant_engine'),
  ('professional', 'integration_engine'),
  ('professional', 'advanced_analytics'),
  ('professional', 'enhanced_approvals'),
  ('professional', 'additional_automation'),
  ('enterprise', 'aipify_core_platform'),
  ('enterprise', 'knowledge_center_engine'),
  ('enterprise', 'operations_dashboard_engine'),
  ('enterprise', 'support_ai_engine'),
  ('enterprise', 'admin_assistant_engine'),
  ('enterprise', 'integration_engine'),
  ('enterprise', 'advanced_analytics'),
  ('enterprise', 'enhanced_approvals'),
  ('enterprise', 'additional_automation'),
  ('enterprise', 'custom_agreements'),
  ('enterprise', 'hybrid_deployment'),
  ('enterprise', 'priority_support'),
  ('internal', 'aipify_core_platform'),
  ('internal', 'knowledge_center_engine'),
  ('internal', 'operations_dashboard_engine'),
  ('internal', 'support_ai_engine'),
  ('internal', 'admin_assistant_engine'),
  ('internal', 'integration_engine'),
  ('internal', 'advanced_analytics'),
  ('internal', 'enhanced_approvals'),
  ('internal', 'additional_automation'),
  ('internal', 'custom_agreements'),
  ('internal', 'hybrid_deployment'),
  ('internal', 'priority_support'),
  ('internal', 'subscription_plan_management_engine')
) as v(plan, module)
where not exists (
  select 1 from public.plan_modules pm where pm.plan_key = v.plan and pm.module_key = v.module
);

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'subscription_plan_management', v.description
from (values
  ('subscription.view', 'View Subscription', 'View subscription plan and module access'),
  ('subscription.manage', 'Manage Subscription', 'Create and configure subscriptions'),
  ('subscription.upgrade', 'Upgrade Subscription', 'Upgrade or downgrade subscription plans')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'subscription.view'), ('owner', 'subscription.manage'), ('owner', 'subscription.upgrade'),
  ('administrator', 'subscription.view'), ('administrator', 'subscription.manage'), ('administrator', 'subscription.upgrade'),
  ('manager', 'subscription.view'),
  ('viewer', 'subscription.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_spm_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._spm_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'subscription',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._spm_plan_rank(p_plan_key text)
returns int language sql immutable as $$
  select case p_plan_key
    when 'starter' then 1
    when 'business' then 2
    when 'professional' then 3
    when 'enterprise' then 4
    when 'internal' then 5
    else 0
  end;
$$;

create or replace function public._spm_legacy_plan_type(p_plan_key text)
returns text language sql immutable as $$
  select case p_plan_key
    when 'professional' then 'growth'
    when 'internal' then 'enterprise'
    else p_plan_key
  end;
$$;

create or replace function public._spm_package_key(p_plan_key text)
returns text language sql immutable as $$
  select case p_plan_key
    when 'starter' then 'starter'
    when 'business' then 'business'
    when 'professional' then 'professional'
    when 'enterprise' then 'enterprise'
    when 'internal' then 'enterprise'
    else 'starter'
  end;
$$;

create or replace function public._spm_ensure_settings(p_organization_id uuid)
returns public.spm_settings language plpgsql security definer set search_path = public as $$
declare v_row public.spm_settings;
begin
  insert into public.spm_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row from public.spm_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._spm_ensure_subscription(p_organization_id uuid)
returns public.organization_subscriptions language plpgsql security definer set search_path = public as $$
declare
  v_row public.organization_subscriptions;
  v_settings public.spm_settings;
  v_org_plan text;
begin
  perform public._spm_ensure_settings(p_organization_id);

  select subscription_plan into v_org_plan
  from public.organizations where id = p_organization_id;

  insert into public.organization_subscriptions (
    organization_id, plan_key, status, trial_ends_at, started_at
  )
  select
    p_organization_id,
    coalesce(v_org_plan, 'starter'),
    case when coalesce(v_org_plan, 'starter') = 'internal' then 'internal' else 'trial' end,
    case when coalesce(v_org_plan, 'starter') = 'internal' then null else now() + (s.trial_duration_days || ' days')::interval end,
    now()
  from public.spm_settings s
  where s.organization_id = p_organization_id
  on conflict (organization_id) do nothing;

  select * into v_row from public.organization_subscriptions where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._spm_sync_legacy_subscription(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_sub public.organization_subscriptions;
  v_legacy_status text;
  v_plan_type text;
begin
  select * into v_sub from public.organization_subscriptions where organization_id = p_organization_id;
  if v_sub.id is null then return; end if;

  v_plan_type := public._spm_legacy_plan_type(v_sub.plan_key);

  v_legacy_status := case v_sub.status
    when 'trial' then 'trialing'
    when 'active' then 'active'
    when 'past_due' then 'past_due'
    when 'cancelled' then 'cancelled'
    when 'expired' then 'paused'
    when 'internal' then 'active'
    else 'active'
  end;

  update public.organizations set
    subscription_plan = v_sub.plan_key,
    updated_at = now()
  where id = p_organization_id;

  insert into public.subscriptions (
    customer_id, plan_name, plan_type, status, trial_starts_at, trial_ends_at, billing_cycle
  )
  values (
    p_organization_id,
    initcap(v_sub.plan_key) || ' Plan',
    v_plan_type,
    v_legacy_status,
    case when v_sub.status = 'trial' then v_sub.started_at else null end,
    v_sub.trial_ends_at,
    v_sub.billing_cycle
  )
  on conflict (customer_id) do update set
    plan_name = excluded.plan_name,
    plan_type = excluded.plan_type,
    status = excluded.status,
    trial_starts_at = excluded.trial_starts_at,
    trial_ends_at = excluded.trial_ends_at,
    billing_cycle = excluded.billing_cycle,
    updated_at = now();
end; $$;

create or replace function public._spm_sync_tenant_modules(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_sub public.organization_subscriptions;
  v_module text;
begin
  select * into v_sub from public.organization_subscriptions where organization_id = p_organization_id;
  if v_sub.id is null then return; end if;

  for v_module in
    select pm.module_key
    from public.plan_modules pm
    where pm.plan_key = v_sub.plan_key and pm.enabled
  loop
    insert into public.tenant_modules (
      tenant_id, module_key, licensed, enabled, status, activated_at
    )
    values (
      p_organization_id, v_module, true, true,
      case when v_sub.status in ('trial', 'active', 'internal') then 'enabled' else 'disabled' end,
      now()
    )
    on conflict (tenant_id, module_key) do update set
      licensed = true,
      enabled = case
        when v_sub.status in ('trial', 'active', 'internal') then true
        else tenant_modules.enabled
      end,
      status = case
        when v_sub.status in ('trial', 'active', 'internal') then 'enabled'
        else tenant_modules.status
      end,
      updated_at = now();
  end loop;

  perform public.sync_tenant_modules_from_package(p_organization_id);
end; $$;

create or replace function public._spm_notify_admins(
  p_organization_id uuid,
  p_title text,
  p_message text
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_notifications (
    organization_id, user_id, notification_type, title, message
  )
  select p_organization_id, ou.user_id, 'system', p_title, p_message
  from public.organization_users ou
  where ou.organization_id = p_organization_id
    and ou.status = 'active'
    and ou.role in ('owner', 'administrator');
end; $$;

create or replace function public._spm_handle_trial_expiration(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_sub public.organization_subscriptions;
begin
  select * into v_sub from public.organization_subscriptions where organization_id = p_organization_id;
  if v_sub.id is null or v_sub.status <> 'trial' then return; end if;
  if v_sub.trial_ends_at is null or v_sub.trial_ends_at > now() then return; end if;

  update public.organization_subscriptions set
    status = 'expired',
    updated_at = now()
  where id = v_sub.id;

  perform public._spm_sync_legacy_subscription(p_organization_id);
  perform public._spm_sync_tenant_modules(p_organization_id);

  perform public._spm_notify_admins(
    p_organization_id,
    'Trial expired',
    'Your Aipify trial has ended. Upgrade your plan to restore full access.'
  );
end; $$;

create or replace function public._spm_downgrade_impact(
  p_organization_id uuid,
  p_new_plan_key text
)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_current text;
  v_lost jsonb;
  v_critical jsonb;
begin
  select plan_key into v_current from public.organization_subscriptions where organization_id = p_organization_id;

  select coalesce(jsonb_agg(pm.module_key order by pm.module_key), '[]'::jsonb) into v_lost
  from public.plan_modules pm
  where pm.plan_key = v_current and pm.enabled
    and pm.module_key not in (
      select pm2.module_key from public.plan_modules pm2
      where pm2.plan_key = p_new_plan_key and pm2.enabled
    );

  select coalesce(jsonb_agg(m order by m), '[]'::jsonb) into v_critical
  from jsonb_array_elements_text(v_lost) m
  where m in ('support_ai_engine', 'admin_assistant_engine', 'integration_engine', 'enhanced_approvals');

  return jsonb_build_object(
    'current_plan', v_current,
    'new_plan', p_new_plan_key,
    'modules_lost', v_lost,
    'critical_modules_lost', v_critical,
    'requires_confirmation', jsonb_array_length(v_critical) > 0
  );
end; $$;

create or replace function public._spm_upgrade_opportunities(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_plan text;
  v_status text;
begin
  select plan_key, status into v_plan, v_status
  from public.organization_subscriptions where organization_id = p_organization_id;

  if v_status in ('trial', 'expired') then
    return jsonb_build_array(
      jsonb_build_object('plan_key', 'business', 'reason', 'Activate full operational modules after trial.')
    );
  end if;

  return case v_plan
    when 'starter' then jsonb_build_array(
      jsonb_build_object('plan_key', 'business', 'reason', 'Unlock Support AI, Admin Assistant, and Integrations.'),
      jsonb_build_object('plan_key', 'professional', 'reason', 'Add advanced analytics, enhanced approvals, and automation.')
    )
    when 'business' then jsonb_build_array(
      jsonb_build_object('plan_key', 'professional', 'reason', 'Add advanced analytics, enhanced approvals, and automation.'),
      jsonb_build_object('plan_key', 'enterprise', 'reason', 'Custom agreements, hybrid deployment, and priority support.')
    )
    when 'professional' then jsonb_build_array(
      jsonb_build_object('plan_key', 'enterprise', 'reason', 'Custom agreements, hybrid deployment, and priority support.')
    )
    else '[]'::jsonb
  end;
end; $$;

-- Layer on existing commercial package resolution (does not replace license center)
create or replace function public._cpa_resolve_package_key(p_tenant_id uuid)
returns text language plpgsql stable security definer set search_path = public as $$
declare
  v_plan_key text;
  v_legacy_plan text;
begin
  select os.plan_key into v_plan_key
  from public.organization_subscriptions os
  where os.organization_id = p_tenant_id
  limit 1;

  if v_plan_key is not null then
    return public._spm_package_key(v_plan_key);
  end if;

  select coalesce(s.plan_key, s.plan_type, 'starter') into v_legacy_plan
  from public.subscriptions s
  where s.customer_id = p_tenant_id
  limit 1;

  return case v_legacy_plan
    when 'growth' then 'professional'
    when 'starter' then 'starter'
    when 'business' then 'business'
    when 'enterprise' then 'enterprise'
    else 'starter'
  end;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. Subscription lifecycle RPCs
-- ---------------------------------------------------------------------------
create or replace function public.create_organization_subscription(
  p_plan_key text default 'starter',
  p_billing_cycle text default 'monthly'
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_sub public.organization_subscriptions;
  v_settings public.spm_settings;
begin
  perform public._irp_require_permission('subscription.manage');
  v_org_id := public._mta_require_organization();
  v_settings := public._spm_ensure_settings(v_org_id);

  if p_plan_key not in ('starter', 'business', 'professional', 'enterprise', 'internal') then
    raise exception 'Invalid plan_key';
  end if;

  insert into public.organization_subscriptions (
    organization_id, plan_key, status, billing_cycle, trial_ends_at, started_at
  )
  values (
    v_org_id, p_plan_key, 'trial', p_billing_cycle,
    now() + (v_settings.trial_duration_days || ' days')::interval, now()
  )
  on conflict (organization_id) do update set
    plan_key = excluded.plan_key,
    billing_cycle = excluded.billing_cycle,
    status = 'trial',
    trial_ends_at = now() + (v_settings.trial_duration_days || ' days')::interval,
    updated_at = now()
  returning * into v_sub;

  perform public._spm_sync_legacy_subscription(v_org_id);
  perform public._spm_sync_tenant_modules(v_org_id);
  perform public._spm_log(v_org_id, 'subscription_created', 'subscription', v_sub.id,
    jsonb_build_object('plan_key', p_plan_key, 'billing_cycle', p_billing_cycle));

  return jsonb_build_object('id', v_sub.id, 'plan_key', v_sub.plan_key, 'status', v_sub.status);
end; $$;

create or replace function public.start_organization_subscription_trial(
  p_trial_days int default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_sub public.organization_subscriptions;
  v_days int;
begin
  perform public._irp_require_permission('subscription.manage');
  v_org_id := public._mta_require_organization();
  v_sub := public._spm_ensure_subscription(v_org_id);

  select coalesce(p_trial_days, s.trial_duration_days) into v_days
  from public.spm_settings s where s.organization_id = v_org_id;

  update public.organization_subscriptions set
    status = 'trial',
    trial_ends_at = now() + (v_days || ' days')::interval,
    started_at = now(),
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_sub;

  perform public._spm_sync_legacy_subscription(v_org_id);
  perform public._spm_sync_tenant_modules(v_org_id);
  perform public._spm_log(v_org_id, 'trial_started', 'subscription', v_sub.id,
    jsonb_build_object('trial_days', v_days, 'trial_ends_at', v_sub.trial_ends_at));

  if (select trial_notifications_enabled from public.spm_settings where organization_id = v_org_id) then
    perform public._spm_notify_admins(
      v_org_id,
      'Trial started',
      format('Your Aipify trial is active for %s days.', v_days)
    );
  end if;

  return jsonb_build_object('id', v_sub.id, 'status', v_sub.status, 'trial_ends_at', v_sub.trial_ends_at);
end; $$;

create or replace function public.upgrade_organization_subscription(p_plan_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_sub public.organization_subscriptions;
  v_old_plan text;
begin
  perform public._irp_require_permission('subscription.upgrade');
  v_org_id := public._mta_require_organization();
  v_sub := public._spm_ensure_subscription(v_org_id);
  v_old_plan := v_sub.plan_key;

  if p_plan_key not in ('starter', 'business', 'professional', 'enterprise') then
    raise exception 'Invalid upgrade plan';
  end if;
  if public._spm_plan_rank(p_plan_key) <= public._spm_plan_rank(v_old_plan) then
    raise exception 'Target plan must be higher than current plan';
  end if;

  update public.organization_subscriptions set
    plan_key = p_plan_key,
    status = case when status in ('expired', 'cancelled') then 'active' else status end,
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_sub;

  perform public._spm_sync_legacy_subscription(v_org_id);
  perform public._spm_sync_tenant_modules(v_org_id);
  perform public._spm_log(v_org_id, 'plan_upgraded', 'subscription', v_sub.id,
    jsonb_build_object('from_plan', v_old_plan, 'to_plan', p_plan_key));

  perform public._spm_notify_admins(
    v_org_id,
    'Plan upgraded',
    format('Subscription upgraded from %s to %s.', v_old_plan, p_plan_key)
  );

  return jsonb_build_object('id', v_sub.id, 'plan_key', v_sub.plan_key, 'status', v_sub.status);
end; $$;

create or replace function public.downgrade_organization_subscription(
  p_plan_key text,
  p_confirm boolean default false
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_sub public.organization_subscriptions;
  v_old_plan text;
  v_impact jsonb;
begin
  perform public._irp_require_permission('subscription.upgrade');
  v_org_id := public._mta_require_organization();
  v_sub := public._spm_ensure_subscription(v_org_id);
  v_old_plan := v_sub.plan_key;
  v_impact := public._spm_downgrade_impact(v_org_id, p_plan_key);

  if p_plan_key not in ('starter', 'business', 'professional', 'enterprise') then
    raise exception 'Invalid downgrade plan';
  end if;
  if public._spm_plan_rank(p_plan_key) >= public._spm_plan_rank(v_old_plan) then
    raise exception 'Target plan must be lower than current plan';
  end if;
  if (v_impact->>'requires_confirmation')::boolean and not p_confirm then
    return jsonb_build_object(
      'blocked', true,
      'reason', 'confirmation_required',
      'impact', v_impact
    );
  end if;

  update public.organization_subscriptions set
    plan_key = p_plan_key,
    updated_at = now()
  where organization_id = v_org_id
  returning * into v_sub;

  perform public._spm_sync_legacy_subscription(v_org_id);
  perform public._spm_sync_tenant_modules(v_org_id);
  perform public._spm_log(v_org_id, 'plan_downgraded', 'subscription', v_sub.id,
    jsonb_build_object('from_plan', v_old_plan, 'to_plan', p_plan_key, 'impact', v_impact));

  perform public._spm_notify_admins(
    v_org_id,
    'Plan downgraded',
    format('Subscription downgraded from %s to %s. Review module access.', v_old_plan, p_plan_key)
  );

  return jsonb_build_object('id', v_sub.id, 'plan_key', v_sub.plan_key, 'status', v_sub.status, 'impact', v_impact);
end; $$;

create or replace function public.cancel_organization_subscription()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_sub public.organization_subscriptions;
begin
  perform public._irp_require_permission('subscription.manage');
  v_org_id := public._mta_require_organization();

  update public.organization_subscriptions set status = 'cancelled', updated_at = now()
  where organization_id = v_org_id
  returning * into v_sub;

  if v_sub.id is null then raise exception 'Subscription not found'; end if;

  perform public._spm_sync_legacy_subscription(v_org_id);
  perform public._spm_sync_tenant_modules(v_org_id);
  perform public._spm_log(v_org_id, 'subscription_cancelled', 'subscription', v_sub.id, '{}'::jsonb);
  perform public._spm_notify_admins(v_org_id, 'Subscription cancelled', 'Your Aipify subscription has been cancelled.');

  return jsonb_build_object('id', v_sub.id, 'status', v_sub.status);
end; $$;

create or replace function public.reactivate_organization_subscription()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_sub public.organization_subscriptions;
begin
  perform public._irp_require_permission('subscription.manage');
  v_org_id := public._mta_require_organization();

  update public.organization_subscriptions set
    status = 'active',
    expires_at = null,
    updated_at = now()
  where organization_id = v_org_id and status in ('cancelled', 'expired', 'past_due')
  returning * into v_sub;

  if v_sub.id is null then raise exception 'No cancelled or expired subscription to reactivate'; end if;

  perform public._spm_sync_legacy_subscription(v_org_id);
  perform public._spm_sync_tenant_modules(v_org_id);
  perform public._spm_log(v_org_id, 'subscription_reactivated', 'subscription', v_sub.id, '{}'::jsonb);
  perform public._spm_notify_admins(v_org_id, 'Subscription reactivated', 'Your Aipify subscription is active again.');

  return jsonb_build_object('id', v_sub.id, 'status', v_sub.status);
end; $$;

create or replace function public.get_organization_plan_modules()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_sub public.organization_subscriptions;
begin
  perform public._irp_require_permission('subscription.view');
  v_org_id := public._mta_require_organization();
  v_sub := public._spm_ensure_subscription(v_org_id);
  perform public._spm_handle_trial_expiration(v_org_id);

  return jsonb_build_object(
    'plan_key', v_sub.plan_key,
    'status', v_sub.status,
    'modules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'module_key', pm.module_key,
        'enabled', pm.enabled,
        'licensed', public.is_tenant_module_enabled(v_org_id, pm.module_key)
      ) order by pm.module_key)
      from public.plan_modules pm
      where pm.plan_key = v_sub.plan_key and pm.enabled
    ), '[]'::jsonb)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Dashboard RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_subscription_plan_management_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_sub public.organization_subscriptions;
  v_settings public.spm_settings;
  v_trial_days_left int;
begin
  perform public._irp_require_permission('subscription.view');
  v_org_id := public._mta_require_organization();
  v_sub := public._spm_ensure_subscription(v_org_id);
  v_settings := public._spm_ensure_settings(v_org_id);
  perform public._spm_handle_trial_expiration(v_org_id);

  select * into v_sub from public.organization_subscriptions where organization_id = v_org_id;

  v_trial_days_left := case
    when v_sub.status = 'trial' and v_sub.trial_ends_at is not null
      then greatest(0, ceil(extract(epoch from (v_sub.trial_ends_at - now())) / 86400)::int)
    else null
  end;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Tenant-aware subscriptions with plan-based module access, upgrade readiness, and full auditability.',
    'safety_note', 'Downgrades require confirmation when critical modules would be lost. Billing integration is scaffolded — no live payment processing in this phase.',
    'principles', jsonb_build_array(
      'Tenant-aware subscriptions',
      'Plan-based module access',
      'Upgrade readiness and downgrade safeguards',
      'Full auditability of plan changes',
      'Billing readiness architecture'
    ),
    'subscription', jsonb_build_object(
      'id', v_sub.id,
      'plan_key', v_sub.plan_key,
      'status', v_sub.status,
      'started_at', v_sub.started_at,
      'expires_at', v_sub.expires_at,
      'trial_ends_at', v_sub.trial_ends_at,
      'trial_days_remaining', v_trial_days_left,
      'billing_cycle', v_sub.billing_cycle
    ),
    'settings', jsonb_build_object(
      'trial_duration_days', v_settings.trial_duration_days,
      'trial_notifications_enabled', v_settings.trial_notifications_enabled,
      'billing_provider', v_settings.billing_provider,
      'billing_ready', v_settings.billing_ready
    ),
    'available_plans', jsonb_build_array(
      jsonb_build_object('plan_key', 'starter', 'label', 'Starter', 'highlights', jsonb_build_array('Core Platform', 'Knowledge Center', 'Basic Dashboard')),
      jsonb_build_object('plan_key', 'business', 'label', 'Business', 'highlights', jsonb_build_array('Support AI', 'Admin Assistant', 'Integrations')),
      jsonb_build_object('plan_key', 'professional', 'label', 'Professional', 'highlights', jsonb_build_array('Advanced analytics', 'Enhanced approvals', 'Additional automation')),
      jsonb_build_object('plan_key', 'enterprise', 'label', 'Enterprise', 'highlights', jsonb_build_array('Custom agreements', 'Hybrid deployment', 'Priority support'))
    ),
    'active_modules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'module_key', pm.module_key,
        'enabled', pm.enabled,
        'licensed', public.is_tenant_module_enabled(v_org_id, pm.module_key)
      ) order by pm.module_key)
      from public.plan_modules pm
      where pm.plan_key = v_sub.plan_key and pm.enabled
    ), '[]'::jsonb),
    'upgrade_opportunities', public._spm_upgrade_opportunities(v_org_id),
    'billing_scaffold', jsonb_build_object(
      'providers', jsonb_build_array('stripe', 'paddle', 'manual'),
      'active_provider', v_settings.billing_provider,
      'ready', v_settings.billing_ready,
      'note', 'Payment provider integration scaffold only — configure when billing goes live.'
    )
  );
end; $$;

create or replace function public.get_subscription_plan_management_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_sub public.organization_subscriptions;
begin
  v_org_id := public._mta_require_organization();
  v_sub := public._spm_ensure_subscription(v_org_id);
  perform public._spm_handle_trial_expiration(v_org_id);
  select * into v_sub from public.organization_subscriptions where organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'plan_key', v_sub.plan_key,
    'status', v_sub.status,
    'trial_ends_at', v_sub.trial_ends_at,
    'module_count', (
      select count(*) from public.plan_modules pm
      where pm.plan_key = v_sub.plan_key and pm.enabled
    ),
    'philosophy', 'Plan-based module access for your organization.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- Update audit list
create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_connected', 'integration_removed', 'settings_updated',
    'organization_provisioned', 'organization_switched', 'approval_submitted', 'approval_approved', 'approval_rejected',
    'audit_exported',
    'assistant_task_created', 'assistant_task_assigned', 'assistant_task_updated',
    'assistant_recommendation_accepted', 'assistant_recommendation_rejected',
    'assistant_daily_briefing_generated', 'assistant_reminder_sent',
    'dashboard_preferences_saved', 'operations_alert_dismissed', 'critical_alert_acknowledged',
    'onboarding_started', 'onboarding_step_advanced', 'checklist_completed', 'onboarding_completed',
    'subscription_created', 'trial_started', 'plan_upgraded', 'plan_downgraded',
    'subscription_cancelled', 'subscription_reactivated'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._spm_ensure_subscription(v_org_id);
    perform public._spm_sync_legacy_subscription(v_org_id);
    perform public._spm_sync_tenant_modules(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'subscription-plan-management-engine', 'Subscription & Plan Management Engine', 'Tenant subscriptions, plan modules, trials, and upgrade paths.', 'authenticated', 61
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'subscription-plan-management-engine' and tenant_id is null);

grant execute on function public.create_organization_subscription(text, text) to authenticated;
grant execute on function public.start_organization_subscription_trial(int) to authenticated;
grant execute on function public.upgrade_organization_subscription(text) to authenticated;
grant execute on function public.downgrade_organization_subscription(text, boolean) to authenticated;
grant execute on function public.cancel_organization_subscription() to authenticated;
grant execute on function public.reactivate_organization_subscription() to authenticated;
grant execute on function public.get_organization_plan_modules() to authenticated;
grant execute on function public.get_subscription_plan_management_engine_dashboard() to authenticated;
grant execute on function public.get_subscription_plan_management_engine_card() to authenticated;
