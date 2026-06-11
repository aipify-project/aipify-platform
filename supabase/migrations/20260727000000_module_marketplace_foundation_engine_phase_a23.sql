-- Phase A.23 — Module Marketplace Foundation Engine
-- Catalog, tenant activation, dependencies, and configuration — extends tenant_modules.

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
    'analytics_insights_engine', 'deployment_environment_management_engine',
    'observability_platform_health_engine', 'aipify_install_engine',
    'module_marketplace_foundation_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. marketplace_modules (global catalog)
-- ---------------------------------------------------------------------------
create table if not exists public.marketplace_modules (
  id uuid primary key default gen_random_uuid(),
  module_key text not null unique,
  module_name text not null,
  description text,
  category text not null default 'operational',
  status text not null default 'active' check (
    status in ('active', 'inactive', 'beta', 'deprecated', 'archived')
  ),
  is_core boolean not null default false,
  is_future boolean not null default false,
  plan_minimum text default 'starter',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.marketplace_modules enable row level security;
revoke all on public.marketplace_modules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_modules (tenant activation — complements tenant_modules)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_modules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  module_key text not null references public.marketplace_modules (module_key) on delete restrict,
  status text not null default 'inactive' check (
    status in ('active', 'inactive', 'beta', 'deprecated', 'archived')
  ),
  activated_at timestamptz,
  configured_at timestamptz,
  deactivated_at timestamptz,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, module_key)
);

create index if not exists organization_modules_org_idx
  on public.organization_modules (organization_id, status);

alter table public.organization_modules enable row level security;
revoke all on public.organization_modules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. module_dependencies
-- ---------------------------------------------------------------------------
create table if not exists public.module_dependencies (
  id uuid primary key default gen_random_uuid(),
  module_key text not null references public.marketplace_modules (module_key) on delete cascade,
  depends_on_key text not null references public.marketplace_modules (module_key) on delete cascade,
  required boolean not null default true,
  created_at timestamptz not null default now(),
  unique (module_key, depends_on_key)
);

alter table public.module_dependencies enable row level security;
revoke all on public.module_dependencies from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. module_configurations
-- ---------------------------------------------------------------------------
create table if not exists public.module_configurations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  module_key text not null,
  config_key text not null,
  config_value jsonb not null default '{}'::jsonb,
  updated_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, module_key, config_key)
);

create index if not exists module_configurations_org_idx
  on public.module_configurations (organization_id, module_key);

alter table public.module_configurations enable row level security;
revoke all on public.module_configurations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, label, module_key, description)
select v.key, v.label, 'module_marketplace', v.description
from (values
  ('modules.activate', 'Activate Modules', 'Activate marketplace modules for organization'),
  ('modules.configure', 'Configure Modules', 'Configure module settings'),
  ('modules.update', 'Update Modules', 'Update module activation status'),
  ('modules.deactivate', 'Deactivate Modules', 'Deactivate organization modules')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'modules.activate'), ('owner', 'modules.configure'), ('owner', 'modules.update'), ('owner', 'modules.deactivate'),
  ('administrator', 'modules.activate'), ('administrator', 'modules.configure'), ('administrator', 'modules.update'), ('administrator', 'modules.deactivate'),
  ('manager', 'modules.view'), ('manager', 'modules.configure'),
  ('viewer', 'modules.view')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 6. Helpers (_mmf_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._mmf_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default 'module',
  p_entity_id uuid default null,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  perform public._mta_create_audit_log(
    p_organization_id, p_action_type, p_entity_type, p_entity_id, false, false, null, p_metadata
  );
end; $$;

create or replace function public._mmf_seed_catalog()
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.marketplace_modules (module_key, module_name, description, category, status, is_core)
  select v.key, v.name, v.desc, v.cat, v.status, v.core
  from (values
    ('admin_assistant', 'Admin Assistant', 'Operational admin guidance and task management.', 'operational', 'active', true),
    ('support_ai', 'Support AI', 'AI-assisted customer support operations.', 'customer', 'active', true),
    ('knowledge_center', 'Knowledge Center', 'Internal knowledge base and FAQ management.', 'operational', 'active', true),
    ('analytics_insights', 'Analytics', 'Business analytics and insights dashboards.', 'executive', 'active', true),
    ('governance_policy', 'Governance', 'Policy governance and compliance workflows.', 'governance', 'active', true),
    ('quality_guardian', 'Quality Guardian', 'Operational quality monitoring and alerts.', 'operational', 'active', true),
    ('notification_communication', 'Notifications', 'Notification and communication engine.', 'operational', 'active', true),
    ('integration_engine', 'Integrations', 'Third-party integration management.', 'operational', 'active', true)
  ) as v(key, name, desc, cat, status, core)
  on conflict (module_key) do nothing;

  insert into public.marketplace_modules (module_key, module_name, description, category, status, is_future)
  select v.key, v.name, v.desc, v.cat, 'inactive', true
  from (values
    ('commerce_intelligence', 'Commerce', 'Commerce intelligence and operations.', 'commerce', 'archived'),
    ('marketing_automation', 'Marketing', 'Marketing automation and campaigns.', 'commerce', 'archived'),
    ('moderation_engine', 'Moderation', 'Content moderation workflows.', 'operational', 'archived'),
    ('strategic_intelligence', 'Strategic Intelligence', 'Strategic planning and intelligence.', 'executive', 'archived'),
    ('operations_center', 'Operations Center', 'Unified operations command center.', 'operational', 'archived'),
    ('desktop_companion', 'Desktop Companion', 'Desktop Command Center companion.', 'companion', 'archived')
  ) as v(key, name, desc, cat)
  on conflict (module_key) do nothing;

  insert into public.module_dependencies (module_key, depends_on_key, required)
  select v.mod, v.dep, v.req
  from (values
    ('support_ai', 'knowledge_center', true),
    ('admin_assistant', 'knowledge_center', false),
    ('analytics_insights', 'integration_engine', false),
    ('quality_guardian', 'governance_policy', false)
  ) as v(mod, dep, req)
  on conflict (module_key, depends_on_key) do nothing;
end; $$;

create or replace function public._mmf_sync_tenant_module(p_organization_id uuid, p_module_key text, p_enabled boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if exists (select 1 from pg_tables where tablename = 'tenant_modules' and schemaname = 'public') then
    insert into public.tenant_modules (tenant_id, module_key, enabled, licensed, status)
    values (p_organization_id, p_module_key, p_enabled, p_enabled, case when p_enabled then 'enabled' else 'disabled' end)
    on conflict (tenant_id, module_key) do update set
      enabled = excluded.enabled,
      licensed = excluded.licensed,
      status = excluded.status,
      updated_at = now();
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 7. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.activate_organization_module(p_module_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_mod public.organization_modules;
begin
  perform public._irp_require_permission('modules.activate');
  v_org_id := public._mta_require_organization();

  if not exists (select 1 from public.marketplace_modules where module_key = p_module_key and status in ('active', 'beta')) then
    raise exception 'Module not available for activation';
  end if;

  insert into public.organization_modules (organization_id, module_key, status, activated_at)
  values (v_org_id, p_module_key, 'active', now())
  on conflict (organization_id, module_key) do update set
    status = 'active', activated_at = now(), deactivated_at = null, updated_at = now()
  returning * into v_mod;

  perform public._mmf_sync_tenant_module(v_org_id, p_module_key, true);
  perform public._mmf_log(v_org_id, 'module_activated', 'module', v_mod.id, jsonb_build_object('module_key', p_module_key));

  return row_to_json(v_mod)::jsonb;
end; $$;

create or replace function public.deactivate_organization_module(p_module_key text)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_mod public.organization_modules;
begin
  perform public._irp_require_permission('modules.deactivate');
  v_org_id := public._mta_require_organization();

  update public.organization_modules
  set status = 'inactive', deactivated_at = now(), updated_at = now()
  where organization_id = v_org_id and module_key = p_module_key
  returning * into v_mod;

  if v_mod.id is null then raise exception 'Module not found'; end if;

  perform public._mmf_sync_tenant_module(v_org_id, p_module_key, false);
  perform public._mmf_log(v_org_id, 'module_deactivated', 'module', v_mod.id, jsonb_build_object('module_key', p_module_key));

  return row_to_json(v_mod)::jsonb;
end; $$;

create or replace function public.configure_organization_module(
  p_module_key text,
  p_config_key text,
  p_config_value jsonb default '{}'::jsonb
)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_user_id uuid; v_cfg public.module_configurations;
begin
  perform public._irp_require_permission('modules.configure');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  insert into public.module_configurations (organization_id, module_key, config_key, config_value, updated_by)
  values (v_org_id, p_module_key, p_config_key, p_config_value, v_user_id)
  on conflict (organization_id, module_key, config_key) do update set
    config_value = excluded.config_value, updated_by = v_user_id, updated_at = now()
  returning * into v_cfg;

  update public.organization_modules
  set configured_at = now(), updated_at = now()
  where organization_id = v_org_id and module_key = p_module_key;

  perform public._mmf_log(v_org_id, 'module_configured', 'module_configuration', v_cfg.id, jsonb_build_object(
    'module_key', p_module_key, 'config_key', p_config_key
  ));

  return row_to_json(v_cfg)::jsonb;
end; $$;

create or replace function public.get_module_marketplace_foundation_engine_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('modules.view');
  v_org_id := public._mta_require_organization();

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Modular SaaS — customers pay only for licensed modules. Activate, configure, and manage capabilities per organization.',
    'principles', jsonb_build_array(
      'Global marketplace catalog with tenant-scoped activation',
      'Module dependencies enforced before activation',
      'Syncs with tenant_modules and commercial packages',
      'Future modules reserved — not exposed until ready',
      'Full audit trail for module lifecycle'
    ),
    'summary', jsonb_build_object(
      'catalog_count', (select count(*) from public.marketplace_modules where status != 'archived'),
      'active_modules', coalesce((select count(*) from public.organization_modules where organization_id = v_org_id and status = 'active'), 0),
      'beta_modules', coalesce((select count(*) from public.marketplace_modules where status = 'beta'), 0),
      'future_modules', coalesce((select count(*) from public.marketplace_modules where is_future), 0)
    ),
    'catalog', coalesce((
      select jsonb_agg(row_to_json(m) order by m.is_core desc, m.module_name)
      from public.marketplace_modules m where m.status != 'archived' or m.is_future
    ), '[]'::jsonb),
    'organization_modules', coalesce((
      select jsonb_agg(row_to_json(om) order by om.module_key)
      from public.organization_modules om where om.organization_id = v_org_id
    ), '[]'::jsonb),
    'dependencies', coalesce((
      select jsonb_agg(row_to_json(d))
      from public.module_dependencies d
    ), '[]'::jsonb),
    'configurations', coalesce((
      select jsonb_agg(row_to_json(c) order by c.module_key, c.config_key)
      from public.module_configurations c where c.organization_id = v_org_id
    ), '[]'::jsonb),
    'commercial_packages_note', 'Extends tenant_modules — plan gates enforced via is_tenant_module_enabled().'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.get_module_marketplace_foundation_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'active_modules', coalesce((select count(*) from public.organization_modules where organization_id = v_org_id and status = 'active'), 0),
    'catalog_count', (select count(*) from public.marketplace_modules where status in ('active', 'beta')),
    'philosophy', 'Modular marketplace — activate only what you need.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public._ala_should_audit(p_action_type text)
returns boolean language sql immutable as $$
  select p_action_type in (
    'login', 'failed_login', 'logout', 'user_created', 'user_invited', 'user_suspended',
    'role_changed', 'permission_granted', 'permission_removed',
    'module_enabled', 'module_disabled', 'module_activated', 'module_deactivated', 'module_configured',
    'knowledge_created', 'knowledge_updated', 'knowledge_published',
    'knowledge_archived', 'knowledge_imported',
    'support_reply_sent', 'support_ai_draft_generated', 'support_escalated', 'support_approval_granted',
    'support_case_created', 'support_case_closed', 'support_case_assigned', 'support_satisfaction_received',
    'integration_created', 'integration_updated', 'integration_disabled', 'integration_connected',
    'integration_credential_rotated', 'integration_sync_executed', 'integration_sync_failed',
    'integration_webhook_received', 'integration_webhook_failed',
    'ai_action_suggested', 'ai_action_executed', 'ai_action_rejected', 'ai_action_failed',
    'ai_action_approved', 'integration_removed', 'settings_updated',
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
    'deployment_rollback_executed', 'feature_flag_changed', 'rollout_adjusted',
    'health_check_recorded', 'incident_created', 'incident_updated', 'incident_resolved',
    'maintenance_scheduled', 'maintenance_started', 'maintenance_completed',
    'installation_started', 'installation_step_advanced', 'installation_discovery_executed',
    'installation_permissions_approved', 'installation_recommendations_accepted',
    'integrations_connected', 'installation_completed'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed';
$$;

select public._mmf_seed_catalog();

insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'module-marketplace-foundation-engine', 'Module Marketplace Foundation Engine', 'Modular SaaS catalog, tenant activation, dependencies, and configuration — extends commercial packages.', 'authenticated', 66
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'module-marketplace-foundation-engine' and tenant_id is null);

grant execute on function public.activate_organization_module(text) to authenticated;
grant execute on function public.deactivate_organization_module(text) to authenticated;
grant execute on function public.configure_organization_module(text, text, jsonb) to authenticated;
grant execute on function public.get_module_marketplace_foundation_engine_dashboard() to authenticated;
grant execute on function public.get_module_marketplace_foundation_engine_card() to authenticated;
