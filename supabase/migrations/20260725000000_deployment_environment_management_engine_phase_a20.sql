-- Phase A.20 — Deployment & Environment Management Engine
-- Safe deployments, environment isolation, controlled releases, rollback readiness.
-- Integrates with Update Engine (Phase 18) — updates only change Aipify software.

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
    'subscription_plan_management_engine', 'aipify_self_support_engine',
    'quality_guardian_engine', 'notification_communication_engine',
    'governance_policy_engine', 'unonight_pilot_operations_engine',
    'analytics_insights_engine', 'deployment_environment_management_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. deployment_environments (platform-level)
-- ---------------------------------------------------------------------------
create table if not exists public.deployment_environments (
  id uuid primary key default gen_random_uuid(),
  environment_key text not null unique check (
    environment_key in ('local', 'development', 'staging', 'pilot', 'production', 'enterprise')
  ),
  environment_name text not null,
  status text not null default 'active' check (
    status in ('active', 'maintenance', 'deprecated', 'archived')
  ),
  deployment_version text not null default '0.0.0',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists deployment_environments_key_status_idx
  on public.deployment_environments (environment_key, status);

alter table public.deployment_environments enable row level security;
revoke all on public.deployment_environments from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. deployment_releases
-- ---------------------------------------------------------------------------
create table if not exists public.deployment_releases (
  id uuid primary key default gen_random_uuid(),
  environment_id uuid not null references public.deployment_environments (id) on delete cascade,
  release_version text not null,
  release_notes text,
  deployed_at timestamptz,
  deployed_by uuid references public.users (id) on delete set null,
  outcome text not null default 'scheduled' check (
    outcome in ('scheduled', 'in_progress', 'completed', 'failed', 'rolled_back')
  ),
  rollback_available boolean not null default false,
  previous_version text,
  created_at timestamptz not null default now()
);

create index if not exists deployment_releases_env_idx
  on public.deployment_releases (environment_id, deployed_at desc nulls last, created_at desc);

alter table public.deployment_releases enable row level security;
revoke all on public.deployment_releases from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_feature_flags (tenant-scoped)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_feature_flags (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  feature_key text not null,
  enabled boolean not null default false,
  environment text not null default 'production' check (
    environment in ('local', 'development', 'staging', 'pilot', 'production', 'enterprise')
  ),
  rollout_percentage int not null default 0 check (rollout_percentage >= 0 and rollout_percentage <= 100),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, feature_key, environment)
);

create index if not exists org_feature_flags_org_env_idx
  on public.organization_feature_flags (organization_id, environment, feature_key);

alter table public.organization_feature_flags enable row level security;
revoke all on public.organization_feature_flags from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. deployment_rollouts (platform-level feature rollout strategies)
-- ---------------------------------------------------------------------------
create table if not exists public.deployment_rollouts (
  id uuid primary key default gen_random_uuid(),
  feature_key text not null,
  strategy text not null check (
    strategy in ('internal_only', 'pilot_only', 'tenant_specific', 'percentage', 'global')
  ),
  target_config jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (
    status in ('draft', 'active', 'paused', 'completed', 'cancelled')
  ),
  created_at timestamptz not null default now()
);

create index if not exists deployment_rollouts_feature_idx
  on public.deployment_rollouts (feature_key, status, created_at desc);

alter table public.deployment_rollouts enable row level security;
revoke all on public.deployment_rollouts from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. deployment_settings
-- ---------------------------------------------------------------------------
create table if not exists public.deployment_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references public.organizations (id) on delete cascade,
  pilot_sequence jsonb not null default '["development","staging","pilot","production"]'::jsonb,
  rollback_threshold_minutes int not null default 60,
  auto_notify_on_deploy boolean not null default true,
  auto_notify_on_rollback boolean not null default true,
  maintenance_window_required boolean not null default true,
  enterprise_hooks jsonb not null default '{"dedicated":false,"hybrid":false,"on_prem":false}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id)
);

create index if not exists deployment_settings_org_idx
  on public.deployment_settings (organization_id);

alter table public.deployment_settings enable row level security;
revoke all on public.deployment_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'deployment_environment', v.description
from (values
  ('deployments.view', 'View Deployments', 'View deployment environments, history, and rollout progress'),
  ('deployments.manage', 'Manage Deployments', 'Schedule and initiate deployments'),
  ('feature_flags.manage', 'Manage Feature Flags', 'Toggle organization feature flags'),
  ('rollback.execute', 'Execute Rollback', 'Execute deployment rollbacks')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'deployments.view'), ('owner', 'deployments.manage'), ('owner', 'feature_flags.manage'), ('owner', 'rollback.execute'),
  ('administrator', 'deployments.view'), ('administrator', 'deployments.manage'), ('administrator', 'feature_flags.manage'), ('administrator', 'rollback.execute'),
  ('manager', 'deployments.view'), ('manager', 'feature_flags.manage'),
  ('support_agent', 'deployments.view'),
  ('viewer', 'deployments.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 7. Helpers (_dem_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._dem_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'deployment',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._dem_ensure_settings(p_organization_id uuid)
returns public.deployment_settings language plpgsql security definer set search_path = public as $$
declare v_row public.deployment_settings;
begin
  insert into public.deployment_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;

  select * into v_row from public.deployment_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._dem_env_by_key(p_environment_key text)
returns public.deployment_environments language plpgsql stable security definer set search_path = public as $$
declare v_row public.deployment_environments;
begin
  select * into v_row from public.deployment_environments where environment_key = p_environment_key;
  return v_row;
end; $$;

create or replace function public._dem_notify_deploy(
  p_organization_id uuid,
  p_title text,
  p_message text,
  p_action_url text default '/app/deployment-environment-management-engine'
)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from pg_proc where proname = 'send_organization_notification') then
    perform public.send_organization_notification(
      p_organization_id, null, 'system_alerts', 'high', p_title, p_message,
      p_action_url, 'Review deployment status in Deployment & Environment Management.',
      '["in_app","dashboard"]'::jsonb, '{}'::jsonb
    );
  end if;
exception when others then null;
end; $$;

create or replace function public._dem_seed_default_environments()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.deployment_environments (environment_key, environment_name, status, deployment_version)
  values
    ('local', 'Local Development', 'active', '0.0.0-dev'),
    ('development', 'Development', 'active', '1.0.0-dev'),
    ('staging', 'Staging', 'active', '1.0.0-rc'),
    ('pilot', 'Unonight Pilot', 'active', '1.0.0-pilot'),
    ('production', 'Production', 'active', '1.0.0'),
    ('enterprise', 'Enterprise (Dedicated/Hybrid/On-Prem)', 'active', '1.0.0')
  on conflict (environment_key) do nothing;
end; $$;

create or replace function public._dem_seed_demo_content(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_pilot_env uuid; v_staging_env uuid;
begin
  perform public._dem_ensure_settings(p_organization_id);

  insert into public.organization_feature_flags (organization_id, feature_key, enabled, environment, rollout_percentage)
  values
    (p_organization_id, 'analytics_insights_engine', true, 'production', 100),
    (p_organization_id, 'quality_guardian_engine', true, 'production', 100),
    (p_organization_id, 'deployment_environment_management_engine', true, 'pilot', 100),
    (p_organization_id, 'notification_communication_engine', true, 'staging', 50)
  on conflict (organization_id, feature_key, environment) do nothing;

  select id into v_pilot_env from public.deployment_environments where environment_key = 'pilot';
  select id into v_staging_env from public.deployment_environments where environment_key = 'staging';

  if v_staging_env is not null then
    insert into public.deployment_releases (environment_id, release_version, release_notes, deployed_at, outcome, rollback_available, previous_version)
    select v_staging_env, '1.0.0-rc.1', 'Staging release with A.13–A.17 modules', now() - interval '3 days', 'completed', true, '1.0.0-rc.0'
    where not exists (
      select 1 from public.deployment_releases r
      where r.environment_id = v_staging_env and r.release_version = '1.0.0-rc.1'
    );
  end if;

  if v_pilot_env is not null then
    insert into public.deployment_releases (environment_id, release_version, release_notes, deployed_at, outcome, rollback_available, previous_version)
    select v_pilot_env, '1.0.0-pilot.1', 'Unonight pilot release — A.15 validation', now() - interval '1 day', 'completed', true, '1.0.0-rc.1'
    where not exists (
      select 1 from public.deployment_releases r
      where r.environment_id = v_pilot_env and r.release_version = '1.0.0-pilot.1'
    );
  end if;

  insert into public.deployment_rollouts (feature_key, strategy, target_config, status)
  select 'deployment_environment_management_engine', 'pilot_only', '{"pilot_slug":"unonight"}'::jsonb, 'active'
  where not exists (
    select 1 from public.deployment_rollouts dr
    where dr.feature_key = 'deployment_environment_management_engine' and dr.status = 'active'
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 8. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.schedule_deployment(
  p_environment_key text,
  p_release_version text,
  p_release_notes text default null,
  p_scheduled_at timestamptz default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_env public.deployment_environments;
  v_release public.deployment_releases;
  v_settings public.deployment_settings;
begin
  perform public._irp_require_permission('deployments.manage');
  v_org_id := public._mta_require_organization();
  v_env := public._dem_env_by_key(p_environment_key);
  if v_env.id is null then
    raise exception 'Environment not found: %', p_environment_key;
  end if;

  v_settings := public._dem_ensure_settings(v_org_id);

  insert into public.deployment_releases (
    environment_id, release_version, release_notes, deployed_at, outcome, rollback_available, previous_version
  ) values (
    v_env.id, p_release_version, p_release_notes,
    coalesce(p_scheduled_at, now()), 'scheduled', false, v_env.deployment_version
  )
  returning * into v_release;

  perform public._dem_log(v_org_id, 'deployment_scheduled', 'deployment_release', v_release.id, jsonb_build_object(
    'environment_key', p_environment_key,
    'release_version', p_release_version,
    'scheduled_at', coalesce(p_scheduled_at, now())
  ));

  return jsonb_build_object('release', row_to_json(v_release), 'environment', row_to_json(v_env));
end; $$;

create or replace function public.deploy_release(p_release_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_release public.deployment_releases;
  v_env public.deployment_environments;
  v_settings public.deployment_settings;
begin
  perform public._irp_require_permission('deployments.manage');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._dem_ensure_settings(v_org_id);

  select * into v_release from public.deployment_releases where id = p_release_id;
  if v_release.id is null then
    raise exception 'Release not found';
  end if;
  if v_release.outcome not in ('scheduled', 'failed') then
    raise exception 'Release cannot be deployed from status: %', v_release.outcome;
  end if;

  select * into v_env from public.deployment_environments where id = v_release.environment_id;

  update public.deployment_releases
  set outcome = 'in_progress', deployed_at = now(), deployed_by = v_user_id
  where id = p_release_id
  returning * into v_release;

  update public.deployment_environments
  set deployment_version = v_release.release_version,
      updated_at = now()
  where id = v_env.id;

  update public.deployment_releases
  set outcome = 'completed',
      rollback_available = true,
      previous_version = coalesce(v_release.previous_version, v_env.deployment_version)
  where id = p_release_id
  returning * into v_release;

  perform public._dem_log(v_org_id, 'deployment_completed', 'deployment_release', v_release.id, jsonb_build_object(
    'environment_key', v_env.environment_key,
    'release_version', v_release.release_version,
    'previous_version', v_release.previous_version
  ));

  if v_settings.auto_notify_on_deploy then
    perform public._dem_notify_deploy(
      v_org_id,
      format('Deployment completed: %s → %s', v_env.environment_name, v_release.release_version),
      format('Release %s is now active in %s. Rollback available if needed.', v_release.release_version, v_env.environment_name)
    );
  end if;

  return jsonb_build_object('release', row_to_json(v_release), 'environment', row_to_json(v_env));
exception when others then
  update public.deployment_releases set outcome = 'failed' where id = p_release_id;
  perform public._dem_log(v_org_id, 'deployment_failed', 'deployment_release', p_release_id, jsonb_build_object('error', sqlerrm));
  raise;
end; $$;

create or replace function public.rollback_release(p_release_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_release public.deployment_releases;
  v_env public.deployment_environments;
  v_settings public.deployment_settings;
  v_rollback_version text;
begin
  perform public._irp_require_permission('rollback.execute');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();
  v_settings := public._dem_ensure_settings(v_org_id);

  select * into v_release from public.deployment_releases where id = p_release_id;
  if v_release.id is null then
    raise exception 'Release not found';
  end if;
  if not v_release.rollback_available or v_release.previous_version is null then
    raise exception 'Rollback not available for this release';
  end if;

  select * into v_env from public.deployment_environments where id = v_release.environment_id;
  v_rollback_version := v_release.previous_version;

  update public.deployment_environments
  set deployment_version = v_rollback_version, updated_at = now()
  where id = v_env.id;

  update public.deployment_releases
  set outcome = 'rolled_back', deployed_by = v_user_id, deployed_at = now()
  where id = p_release_id
  returning * into v_release;

  perform public._dem_log(v_org_id, 'deployment_rollback_executed', 'deployment_release', v_release.id, jsonb_build_object(
    'environment_key', v_env.environment_key,
    'rolled_back_to', v_rollback_version,
    'from_version', v_release.release_version
  ));

  if v_settings.auto_notify_on_rollback then
    perform public._dem_notify_deploy(
      v_org_id,
      format('Rollback completed: %s', v_env.environment_name),
      format('Environment %s rolled back to %s.', v_env.environment_name, v_rollback_version)
    );
  end if;

  return jsonb_build_object('release', row_to_json(v_release), 'environment', row_to_json(v_env), 'rolled_back_to', v_rollback_version);
end; $$;

create or replace function public.toggle_feature_flag(
  p_feature_key text,
  p_enabled boolean,
  p_environment text default 'production',
  p_rollout_percentage int default null
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_flag public.organization_feature_flags;
begin
  perform public._irp_require_permission('feature_flags.manage');
  v_org_id := public._mta_require_organization();

  insert into public.organization_feature_flags (organization_id, feature_key, enabled, environment, rollout_percentage)
  values (
    v_org_id, p_feature_key, p_enabled, coalesce(p_environment, 'production'),
    coalesce(p_rollout_percentage, case when p_enabled then 100 else 0 end)
  )
  on conflict (organization_id, feature_key, environment) do update set
    enabled = excluded.enabled,
    rollout_percentage = coalesce(excluded.rollout_percentage, organization_feature_flags.rollout_percentage),
    updated_at = now()
  returning * into v_flag;

  perform public._dem_log(v_org_id, 'feature_flag_changed', 'feature_flag', v_flag.id, jsonb_build_object(
    'feature_key', p_feature_key,
    'enabled', p_enabled,
    'environment', p_environment,
    'rollout_percentage', v_flag.rollout_percentage
  ));

  return row_to_json(v_flag)::jsonb;
end; $$;

create or replace function public.get_deployment_status()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('deployments.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'environments', coalesce((
      select jsonb_agg(row_to_json(e) order by
        case e.environment_key
          when 'local' then 0 when 'development' then 1 when 'staging' then 2
          when 'pilot' then 3 when 'production' then 4 when 'enterprise' then 5 else 6
        end)
      from public.deployment_environments e
      where e.status != 'archived'
    ), '[]'::jsonb),
    'recent_releases', coalesce((
      select jsonb_agg(row_to_json(r) order by r.created_at desc)
      from (
        select dr.id, dr.environment_id, de.environment_key, de.environment_name,
               dr.release_version, dr.release_notes, dr.deployed_at, dr.outcome,
               dr.rollback_available, dr.previous_version, dr.created_at
        from public.deployment_releases dr
        join public.deployment_environments de on de.id = dr.environment_id
        order by dr.created_at desc
        limit 20
      ) r
    ), '[]'::jsonb),
    'feature_flags', coalesce((
      select jsonb_agg(row_to_json(f) order by f.feature_key, f.environment)
      from public.organization_feature_flags f
      where f.organization_id = v_org_id
    ), '[]'::jsonb),
    'rollouts', coalesce((
      select jsonb_agg(row_to_json(ro) order by ro.created_at desc)
      from public.deployment_rollouts ro
      where ro.status in ('active', 'draft')
    ), '[]'::jsonb),
    'settings', row_to_json(public._dem_ensure_settings(v_org_id)),
    'pilot_flow', jsonb_build_array('development', 'staging', 'internal', 'pilot', 'production'),
    'update_engine_note', 'Updates only change Aipify software — never silently alter customer data.'
  );
end; $$;

create or replace function public.get_organization_feature_flags(p_environment text default null)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('deployments.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(row_to_json(f) order by f.feature_key)
    from public.organization_feature_flags f
    where f.organization_id = v_org_id
      and (p_environment is null or f.environment = p_environment)
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_deployment_environment_management_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.deployment_settings;
  v_active_env int;
  v_rollback_ready int;
begin
  perform public._irp_require_permission('deployments.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._dem_ensure_settings(v_org_id);

  select count(*) into v_active_env
  from public.deployment_environments where status = 'active';

  select count(*) into v_rollback_ready
  from public.deployment_releases dr
  join public.deployment_environments de on de.id = dr.environment_id
  where dr.rollback_available and dr.outcome = 'completed';

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Safe deployments with environment isolation, controlled releases, and rollback readiness.',
    'safety_note', 'Updates only change Aipify software — never silently alter customer data, configuration, billing, or permissions.',
    'principles', jsonb_build_array(
      'Environment isolation across local, dev, staging, pilot, production, enterprise',
      'Controlled rollout strategies with pilot-first validation',
      'Rollback readiness with deployment history and audit trail',
      'Tenant-scoped feature flags complementing commercial package modules',
      'Integration with Update Engine rollout order'
    ),
    'settings', row_to_json(v_settings),
    'summary', jsonb_build_object(
      'active_environments', v_active_env,
      'rollback_ready_releases', v_rollback_ready,
      'enabled_flags', coalesce((
        select count(*) from public.organization_feature_flags
        where organization_id = v_org_id and enabled
      ), 0),
      'active_rollouts', coalesce((
        select count(*) from public.deployment_rollouts where status = 'active'
      ), 0)
    ),
    'environments', coalesce((
      select jsonb_agg(row_to_json(e) order by
        case e.environment_key
          when 'local' then 0 when 'development' then 1 when 'staging' then 2
          when 'pilot' then 3 when 'production' then 4 when 'enterprise' then 5 else 6
        end)
      from public.deployment_environments e
      where e.status != 'archived'
    ), '[]'::jsonb),
    'deployment_history', coalesce((
      select jsonb_agg(row_to_json(r) order by r.created_at desc)
      from (
        select dr.id, dr.environment_id, de.environment_key, de.environment_name,
               dr.release_version, dr.release_notes, dr.deployed_at, dr.outcome,
               dr.rollback_available, dr.previous_version, dr.created_at
        from public.deployment_releases dr
        join public.deployment_environments de on de.id = dr.environment_id
        order by dr.created_at desc
        limit 15
      ) r
    ), '[]'::jsonb),
    'feature_flags', coalesce((
      select jsonb_agg(row_to_json(f) order by f.feature_key, f.environment)
      from public.organization_feature_flags f
      where f.organization_id = v_org_id
    ), '[]'::jsonb),
    'rollouts', coalesce((
      select jsonb_agg(row_to_json(ro))
      from (
        select * from public.deployment_rollouts
        order by created_at desc
        limit 10
      ) ro
    ), '[]'::jsonb),
    'pilot_flow', jsonb_build_array(
      'Development → Staging → Aipify Internal → Unonight Pilot → General Availability'
    ),
    'enterprise_hooks', v_settings.enterprise_hooks,
    'update_engine_integration', jsonb_build_object(
      'rollout_order', jsonb_build_array('internal', 'pilot', 'stable', 'enterprise'),
      'core_principle', 'Aipify updates must only update Aipify software.',
      'platform_updates_table', 'platform_updates'
    )
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_deployment_environment_management_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'active_environments', coalesce((
      select count(*) from public.deployment_environments where status = 'active'
    ), 0),
    'rollback_ready', coalesce((
      select count(*) from public.deployment_releases
      where rollback_available and outcome = 'completed'
    ), 0),
    'enabled_flags', coalesce((
      select count(*) from public.organization_feature_flags
      where organization_id = v_org_id and enabled
    ), 0),
    'philosophy', 'Safe deployments, environment isolation, and rollback readiness.'
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
    'subscription_cancelled', 'subscription_reactivated',
    'self_support_response_sent', 'self_support_draft_generated', 'self_support_escalated',
    'self_support_conversation_closed', 'self_support_feedback_submitted',
    'self_support_knowledge_recommended', 'self_support_conversation_created',
    'quality_alert_created', 'quality_check_resolved', 'quality_finding_ignored',
    'quality_recommendation_accepted', 'quality_recommendation_rejected', 'quality_scan_executed',
    'notification_sent', 'notification_dismissed', 'notification_preferences_saved',
    'notification_digest_generated', 'critical_alert_sent', 'notification_delivery_failed',
    'deployment_scheduled', 'deployment_initiated', 'deployment_completed', 'deployment_failed',
    'deployment_rollback_executed', 'feature_flag_changed', 'rollout_adjusted'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

-- Seed platform environments and org demo content
select public._dem_seed_default_environments();

do $$
declare v_org_id uuid;
begin
  for v_org_id in select id from public.organizations loop
    perform public._dem_seed_demo_content(v_org_id);
  end loop;
end $$;

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'deployment-environment-management-engine', 'Deployment & Environment Management Engine', 'Safe deployments, environment isolation, controlled releases, feature flags, and rollback readiness across Aipify Core phases.', 'authenticated', 63
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'deployment-environment-management-engine' and tenant_id is null);

grant execute on function public.schedule_deployment(text, text, text, timestamptz) to authenticated;
grant execute on function public.deploy_release(uuid) to authenticated;
grant execute on function public.rollback_release(uuid) to authenticated;
grant execute on function public.toggle_feature_flag(text, boolean, text, int) to authenticated;
grant execute on function public.get_deployment_status() to authenticated;
grant execute on function public.get_organization_feature_flags(text) to authenticated;
grant execute on function public.get_deployment_environment_management_engine_dashboard() to authenticated;
grant execute on function public.get_deployment_environment_management_engine_card() to authenticated;
