-- Phase A.75 — Organization & Workspace Engine
-- Organization → Workspace → Users → Roles → Permissions hierarchy.
-- Extends Multi-Tenant Architecture (A.1) and Identity & Permissions (A.2).

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
    'module_marketplace_foundation_engine', 'aipify_internal_operations_engine',
    'launch_readiness_engine', 'customer_success_engine',
    'aipify_status_transparency_engine', 'enterprise_readiness_engine',
    'learning_training_engine', 'organizational_memory_engine',
    'enterprise_deployment_device_rollout_engine',
    'innovation_impact_engine', 'compliance_regulatory_readiness_engine',
    'strategic_intelligence_foundation_engine', 'operations_center_foundation_engine',
    'continuous_improvement_engine', 'human_oversight_engine',
    'workflow_orchestration_engine', 'business_packs_foundation_engine',
    'industry_intelligence_foundation_engine',
    'marketplace_partner_ecosystem_foundation_engine',
    'ai_ethics_responsible_use_engine',
    'change_management_engine',
    'value_realization_engine',
    'organizational_resilience_engine',
    'incident_response_coordination_engine',
    'service_level_commitment_engine',
    'stakeholder_communication_engine',
    'organizational_decision_support_engine',
    'strategic_alignment_engine',
    'organizational_health_engine',
    'capability_maturity_engine',
    'organizational_benchmarking_engine',
    'document_output_engine',
    'records_retention_management_engine',
    'meeting_collaboration_intelligence_engine',
    'unified_task_follow_up_engine',
    'resource_planning_engine',
    'capacity_workload_management_engine',
    'goals_okr_engine',
    'predictive_insights_engine',
    'personal_productivity_engine',
    'companion_presence_indicator_engine',
    'cross_tenant_intelligence_engine',
    'partner_success_engine',
    'trust_reputation_engine',
    'ai_cost_governance_engine',
    'organization_workspace_engine'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organization_workspaces
-- ---------------------------------------------------------------------------
create table if not exists public.organization_workspaces (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  slug text not null,
  description text,
  status text not null default 'active' check (
    status in ('active', 'inactive', 'archived')
  ),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug)
);

create index if not exists organization_workspaces_org_idx
  on public.organization_workspaces (organization_id, status);

alter table public.organization_workspaces enable row level security;
revoke all on public.organization_workspaces from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. workspace_custom_roles
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_custom_roles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  description text,
  permissions jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, name)
);

create index if not exists workspace_custom_roles_org_idx
  on public.workspace_custom_roles (organization_id);

alter table public.workspace_custom_roles enable row level security;
revoke all on public.workspace_custom_roles from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. workspace_members
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.organization_workspaces (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null check (
    role in ('owner', 'administrator', 'manager', 'employee', 'support_agent', 'moderator', 'viewer', 'custom')
  ),
  custom_role_id uuid references public.workspace_custom_roles (id) on delete set null,
  status text not null default 'active' check (
    status in ('invited', 'active', 'suspended', 'removed')
  ),
  invited_by uuid references public.users (id) on delete set null,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, user_id)
);

create index if not exists workspace_members_workspace_idx
  on public.workspace_members (workspace_id, status);
create index if not exists workspace_members_user_idx
  on public.workspace_members (user_id, status);

alter table public.workspace_members enable row level security;
revoke all on public.workspace_members from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. workspace_role_permissions (org template or workspace-specific)
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_role_permissions (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid references public.organization_workspaces (id) on delete cascade,
  role text not null check (
    role in ('owner', 'administrator', 'manager', 'employee', 'support_agent', 'moderator', 'viewer')
  ),
  permission_key text not null references public.aipify_permissions (permission_key) on delete cascade,
  created_at timestamptz not null default now(),
  unique (organization_id, workspace_id, role, permission_key)
);

create index if not exists workspace_role_permissions_org_idx
  on public.workspace_role_permissions (organization_id, workspace_id, role);

alter table public.workspace_role_permissions enable row level security;
revoke all on public.workspace_role_permissions from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. workspace_user_context (selected workspace session)
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_user_context (
  user_id uuid not null references public.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  workspace_id uuid not null references public.organization_workspaces (id) on delete cascade,
  updated_at timestamptz not null default now(),
  primary key (user_id, organization_id)
);

alter table public.workspace_user_context enable row level security;
revoke all on public.workspace_user_context from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. workspace_audit_logs (metadata only)
-- ---------------------------------------------------------------------------
create table if not exists public.workspace_audit_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.organization_workspaces (id) on delete cascade,
  action text not null,
  actor_user_id uuid references public.users (id) on delete set null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists workspace_audit_logs_workspace_idx
  on public.workspace_audit_logs (workspace_id, created_at desc);

alter table public.workspace_audit_logs enable row level security;
revoke all on public.workspace_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. organization_workspace_settings (org-level defaults)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_workspace_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  default_workspace_slug text,
  allow_custom_roles boolean not null default true,
  max_workspaces int not null default 50 check (max_workspaces > 0),
  metadata jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.organization_workspace_settings enable row level security;
revoke all on public.organization_workspace_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. Permissions
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'organization_workspace', v.description
from (values
  ('workspaces.view', 'View Workspaces', 'View organization workspaces and structure'),
  ('workspaces.manage', 'Manage Workspaces', 'Update workspace settings and status'),
  ('workspaces.create', 'Create Workspaces', 'Create new organization workspaces'),
  ('workspaces.members.manage', 'Manage Workspace Members', 'Invite and update workspace members'),
  ('workspaces.roles.manage', 'Manage Workspace Roles', 'Create and configure custom workspace roles'),
  ('workspaces.settings.manage', 'Manage Workspace Settings', 'Configure org-level workspace defaults'),
  ('workspaces.audit.view', 'View Workspace Audit', 'View workspace audit history'),
  ('workspaces.switch', 'Switch Workspaces', 'Switch active workspace context')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions p where p.permission_key = v.key);

insert into public.organization_role_permissions (organization_id, role, permission_key)
select o.id, v.role, v.key
from public.organizations o
cross join (values
  ('owner', 'workspaces.view'), ('owner', 'workspaces.manage'), ('owner', 'workspaces.create'),
  ('owner', 'workspaces.members.manage'), ('owner', 'workspaces.roles.manage'),
  ('owner', 'workspaces.settings.manage'), ('owner', 'workspaces.audit.view'), ('owner', 'workspaces.switch'),
  ('administrator', 'workspaces.view'), ('administrator', 'workspaces.manage'), ('administrator', 'workspaces.create'),
  ('administrator', 'workspaces.members.manage'), ('administrator', 'workspaces.roles.manage'),
  ('administrator', 'workspaces.settings.manage'), ('administrator', 'workspaces.audit.view'), ('administrator', 'workspaces.switch'),
  ('manager', 'workspaces.view'), ('manager', 'workspaces.manage'),
  ('manager', 'workspaces.members.manage'), ('manager', 'workspaces.audit.view'), ('manager', 'workspaces.switch'),
  ('support_agent', 'workspaces.view'), ('support_agent', 'workspaces.switch'),
  ('viewer', 'workspaces.view'), ('viewer', 'workspaces.switch')
) as v(role, key)
where not exists (
  select 1 from public.organization_role_permissions rp
  where rp.organization_id = o.id and rp.role = v.role and rp.permission_key = v.key
);

-- ---------------------------------------------------------------------------
-- 9. Helpers (_owe_ prefix)
-- ---------------------------------------------------------------------------
create or replace function public._owe_ensure_settings(p_organization_id uuid)
returns public.organization_workspace_settings language plpgsql security definer set search_path = public as $$
declare v_row public.organization_workspace_settings;
begin
  insert into public.organization_workspace_settings (organization_id)
  values (p_organization_id)
  on conflict (organization_id) do nothing;
  select * into v_row from public.organization_workspace_settings where organization_id = p_organization_id;
  return v_row;
end; $$;

create or replace function public._owe_log(
  p_workspace_id uuid,
  p_action text,
  p_metadata jsonb default '{}'::jsonb
)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.workspace_audit_logs (workspace_id, action, actor_user_id, metadata)
  values (
    p_workspace_id, p_action, public._mta_app_user_id(),
    coalesce(p_metadata, '{}'::jsonb) || jsonb_build_object('metadata_only', true)
  );
end; $$;

create or replace function public._owe_require_workspace_access(p_workspace_id uuid)
returns public.organization_workspaces language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_workspace public.organization_workspaces;
  v_org_role text;
begin
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select * into v_workspace
  from public.organization_workspaces
  where id = p_workspace_id and organization_id = v_org_id;

  if v_workspace.id is null then raise exception 'Workspace not found'; end if;

  select ou.role into v_org_role
  from public.organization_users ou
  where ou.organization_id = v_org_id and ou.user_id = v_user_id and ou.status = 'active';

  if v_org_role in ('owner', 'administrator') then return v_workspace; end if;

  if not exists (
    select 1 from public.workspace_members wm
    where wm.workspace_id = p_workspace_id and wm.user_id = v_user_id and wm.status = 'active'
  ) then
    raise exception 'Workspace access denied';
  end if;

  return v_workspace;
end; $$;

create or replace function public._owe_seed_role_permissions(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.workspace_role_permissions (organization_id, workspace_id, role, permission_key)
  select p_organization_id, null, v.role, v.key
  from (values
    ('owner', 'workspaces.view'), ('owner', 'workspaces.manage'), ('owner', 'workspaces.create'),
    ('owner', 'workspaces.members.manage'), ('owner', 'workspaces.roles.manage'),
    ('owner', 'workspaces.settings.manage'), ('owner', 'workspaces.audit.view'), ('owner', 'workspaces.switch'),
    ('administrator', 'workspaces.view'), ('administrator', 'workspaces.manage'), ('administrator', 'workspaces.create'),
    ('administrator', 'workspaces.members.manage'), ('administrator', 'workspaces.roles.manage'),
    ('administrator', 'workspaces.settings.manage'), ('administrator', 'workspaces.audit.view'), ('administrator', 'workspaces.switch'),
    ('manager', 'workspaces.view'), ('manager', 'workspaces.manage'),
    ('manager', 'workspaces.members.manage'), ('manager', 'workspaces.audit.view'), ('manager', 'workspaces.switch'),
    ('employee', 'workspaces.view'), ('employee', 'workspaces.switch'),
    ('support_agent', 'workspaces.view'), ('support_agent', 'workspaces.switch'),
    ('moderator', 'workspaces.view'), ('moderator', 'workspaces.switch'),
    ('viewer', 'workspaces.view'), ('viewer', 'workspaces.switch')
  ) as v(role, key)
  on conflict (organization_id, workspace_id, role, permission_key) do nothing;
end; $$;

create or replace function public._owe_integration_links(p_workspace_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'knowledge_center', jsonb_build_object(
      'route', '/app/knowledge-center-engine',
      'scoped_by', 'workspace_id',
      'metadata_only', true
    ),
    'support_queues', jsonb_build_object(
      'route', '/app/support-ai-engine',
      'scoped_by', 'workspace_id',
      'metadata_only', true
    ),
    'ai_memories', jsonb_build_object(
      'route', '/app/assistant/memory',
      'engine', 'PAME',
      'note', 'Scaffold link — does not duplicate personal_memories',
      'metadata_only', true
    ),
    'automations', jsonb_build_object(
      'route', '/app/action-center',
      'scoped_by', 'workspace_id',
      'metadata_only', true
    ),
    'collaboration', jsonb_build_object(
      'route', '/app/meeting-collaboration-intelligence-engine',
      'scoped_by', 'workspace_id',
      'metadata_only', true
    ),
    'tasks', jsonb_build_object(
      'route', '/app/unified-task-follow-up-engine',
      'scoped_by', 'workspace_id',
      'metadata_only', true
    ),
    'audit', jsonb_build_object(
      'route', '/app/audit-accountability',
      'workspace_audit_table', 'workspace_audit_logs',
      'metadata_only', true
    )
  );
end; $$;

create or replace function public._owe_summary_block(p_organization_id uuid)
returns jsonb language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object(
    'total_workspaces', coalesce((
      select count(*) from public.organization_workspaces
      where organization_id = p_organization_id and status != 'archived'
    ), 0),
    'active_workspaces', coalesce((
      select count(*) from public.organization_workspaces
      where organization_id = p_organization_id and status = 'active'
    ), 0),
    'archived_workspaces', coalesce((
      select count(*) from public.organization_workspaces
      where organization_id = p_organization_id and status = 'archived'
    ), 0),
    'total_members', coalesce((
      select count(distinct wm.user_id)
      from public.workspace_members wm
      join public.organization_workspaces w on w.id = wm.workspace_id
      where w.organization_id = p_organization_id and wm.status = 'active'
    ), 0),
    'custom_roles', coalesce((
      select count(*) from public.workspace_custom_roles where organization_id = p_organization_id
    ), 0),
    'role_distribution', coalesce((
      select jsonb_object_agg(role, cnt)
      from (
        select wm.role, count(*) as cnt
        from public.workspace_members wm
        join public.organization_workspaces w on w.id = wm.workspace_id
        where w.organization_id = p_organization_id and wm.status = 'active'
        group by wm.role
      ) sub
    ), '{}'::jsonb)
  );
end; $$;

create or replace function public._owe_seed_dogfood_workspaces(p_organization_id uuid, p_org_slug text)
returns void language plpgsql security definer set search_path = public as $$
declare
  v_workspace_id uuid;
  v_ws record;
begin
  perform public._owe_ensure_settings(p_organization_id);
  perform public._owe_seed_role_permissions(p_organization_id);

  if exists (
    select 1 from public.organization_workspaces where organization_id = p_organization_id limit 1
  ) then
    return;
  end if;

  if p_org_slug = 'aipify-group' then
    for v_ws in
      select * from (values
        ('Executive Office', 'executive-office', 'Executive strategy and leadership workspace'),
        ('Development', 'development', 'Product and engineering workspace'),
        ('Support', 'support', 'Customer and internal support workspace'),
        ('Operations', 'operations', 'Platform operations workspace'),
        ('Sales', 'sales', 'Commercial and sales workspace')
      ) as t(name, slug, description)
    loop
      insert into public.organization_workspaces (organization_id, name, slug, description, settings)
      values (p_organization_id, v_ws.name, v_ws.slug, v_ws.description,
        jsonb_build_object('dogfood', true, 'org_slug', p_org_slug))
      returning id into v_workspace_id;
    end loop;
  elsif p_org_slug = 'unonight' then
    for v_ws in
      select * from (values
        ('Admin', 'admin', 'Unonight administration workspace'),
        ('Moderation', 'moderation', 'Marketplace moderation workspace'),
        ('Customer Support', 'customer-support', 'Customer support operations workspace'),
        ('Marketplace Operations', 'marketplace-operations', 'Marketplace operations workspace')
      ) as t(name, slug, description)
    loop
      insert into public.organization_workspaces (organization_id, name, slug, description, settings)
      values (p_organization_id, v_ws.name, v_ws.slug, v_ws.description,
        jsonb_build_object('dogfood', true, 'org_slug', p_org_slug))
      returning id into v_workspace_id;
    end loop;
  end if;
end; $$;

-- ---------------------------------------------------------------------------
-- 10. RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_organization_workspace_engine_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid; v_summary jsonb; v_current jsonb;
begin
  v_org_id := public._mta_require_organization();
  perform public._owe_ensure_settings(v_org_id);
  v_summary := public._owe_summary_block(v_org_id);

  select jsonb_build_object('workspace_id', wuc.workspace_id, 'updated_at', wuc.updated_at)
  into v_current
  from public.workspace_user_context wuc
  where wuc.user_id = public._mta_app_user_id() and wuc.organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Organization → Workspace → Users → Roles — isolated operational contexts within your tenant.',
    'total_workspaces', v_summary->'total_workspaces',
    'active_workspaces', v_summary->'active_workspaces',
    'total_members', v_summary->'total_members',
    'current_workspace_id', v_current->'workspace_id'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.list_organization_workspaces()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('workspaces.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(
      jsonb_build_object(
        'id', w.id,
        'name', w.name,
        'slug', w.slug,
        'description', w.description,
        'status', w.status,
        'settings', w.settings,
        'member_count', (
          select count(*) from public.workspace_members wm
          where wm.workspace_id = w.id and wm.status = 'active'
        ),
        'created_at', w.created_at,
        'updated_at', w.updated_at
      ) order by w.status, w.name
    )
    from public.organization_workspaces w
    where w.organization_id = v_org_id and w.status != 'archived'
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_current_workspace()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_context public.workspace_user_context;
  v_workspace public.organization_workspaces;
begin
  perform public._irp_require_permission('workspaces.view');
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  select * into v_context
  from public.workspace_user_context
  where user_id = v_user_id and organization_id = v_org_id;

  if v_context.workspace_id is not null then
    select * into v_workspace
    from public.organization_workspaces
    where id = v_context.workspace_id and organization_id = v_org_id;
  end if;

  if v_workspace.id is null then
    select * into v_workspace
    from public.organization_workspaces
    where organization_id = v_org_id and status = 'active'
    order by created_at asc
    limit 1;
  end if;

  if v_workspace.id is null then
    return jsonb_build_object('has_workspace', false);
  end if;

  return jsonb_build_object(
    'has_workspace', true,
    'workspace', row_to_json(v_workspace)::jsonb,
    'integration_links', public._owe_integration_links(v_workspace.id)
  );
end; $$;

create or replace function public.switch_workspace(p_workspace_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_user_id uuid;
  v_workspace public.organization_workspaces;
begin
  perform public._irp_require_permission('workspaces.switch');
  v_workspace := public._owe_require_workspace_access(p_workspace_id);
  v_org_id := public._mta_require_organization();
  v_user_id := public._mta_app_user_id();

  insert into public.workspace_user_context (user_id, organization_id, workspace_id, updated_at)
  values (v_user_id, v_org_id, p_workspace_id, now())
  on conflict (user_id, organization_id) do update
  set workspace_id = excluded.workspace_id, updated_at = now();

  perform public._owe_log(p_workspace_id, 'owe_workspace_switched',
    jsonb_build_object('workspace_slug', v_workspace.slug));

  return jsonb_build_object(
    'switched', true,
    'workspace_id', p_workspace_id,
    'workspace_slug', v_workspace.slug,
    'workspace_name', v_workspace.name
  );
end; $$;

create or replace function public.create_organization_workspace(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.organization_workspaces;
  v_settings public.organization_workspace_settings;
  v_count int;
begin
  perform public._irp_require_permission('workspaces.create');
  v_org_id := public._mta_require_organization();
  v_settings := public._owe_ensure_settings(v_org_id);

  select count(*) into v_count
  from public.organization_workspaces
  where organization_id = v_org_id and status != 'archived';

  if v_count >= v_settings.max_workspaces then
    raise exception 'Workspace limit reached';
  end if;

  if nullif(trim(p_payload->>'name'), '') is null or nullif(trim(p_payload->>'slug'), '') is null then
    raise exception 'name and slug are required';
  end if;

  insert into public.organization_workspaces (
    organization_id, name, slug, description, status, settings
  )
  values (
    v_org_id,
    trim(p_payload->>'name'),
    lower(trim(p_payload->>'slug')),
    nullif(trim(p_payload->>'description'), ''),
    coalesce(nullif(trim(p_payload->>'status'), ''), 'active'),
    coalesce(p_payload->'settings', '{}'::jsonb)
  )
  returning * into v_row;

  perform public._mta_create_audit_log(
    v_org_id, 'owe_workspace_created', 'workspace', v_row.id, false, false, null,
    jsonb_build_object('workspace_slug', v_row.slug, 'metadata_only', true)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_organization_workspace(p_workspace_id uuid, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_workspaces;
begin
  perform public._irp_require_permission('workspaces.manage');
  v_org_id := public._mta_require_organization();
  perform public._owe_require_workspace_access(p_workspace_id);

  update public.organization_workspaces
  set
    name = coalesce(nullif(trim(p_payload->>'name'), ''), name),
    description = coalesce(nullif(trim(p_payload->>'description'), ''), description),
    status = coalesce(nullif(trim(p_payload->>'status'), ''), status),
    settings = settings || coalesce(p_payload->'settings', '{}'::jsonb),
    updated_at = now()
  where id = p_workspace_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Workspace not found'; end if;

  perform public._owe_log(p_workspace_id, 'owe_workspace_updated',
    jsonb_build_object('status', v_row.status, 'workspace_slug', v_row.slug));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.archive_organization_workspace(p_workspace_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_row public.organization_workspaces;
begin
  perform public._irp_require_permission('workspaces.manage');
  v_org_id := public._mta_require_organization();

  update public.organization_workspaces
  set status = 'archived', updated_at = now()
  where id = p_workspace_id and organization_id = v_org_id
  returning * into v_row;

  if v_row.id is null then raise exception 'Workspace not found'; end if;

  perform public._owe_log(p_workspace_id, 'owe_workspace_archived',
    jsonb_build_object('workspace_slug', v_row.slug));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.invite_workspace_member(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_workspace_id uuid;
  v_user_id uuid;
  v_row public.workspace_members;
begin
  perform public._irp_require_permission('workspaces.members.manage');
  v_org_id := public._mta_require_organization();
  v_workspace_id := (p_payload->>'workspace_id')::uuid;
  perform public._owe_require_workspace_access(v_workspace_id);

  v_user_id := (p_payload->>'user_id')::uuid;
  if v_user_id is null then raise exception 'user_id is required'; end if;

  if not exists (
    select 1 from public.organization_users
    where organization_id = v_org_id and user_id = v_user_id and status = 'active'
  ) then
    raise exception 'User is not an active organization member';
  end if;

  insert into public.workspace_members (
    workspace_id, user_id, role, custom_role_id, status, invited_by
  )
  values (
    v_workspace_id,
    v_user_id,
    coalesce(nullif(trim(p_payload->>'role'), ''), 'employee'),
    nullif(trim(p_payload->>'custom_role_id'), '')::uuid,
    coalesce(nullif(trim(p_payload->>'status'), ''), 'invited'),
    public._mta_app_user_id()
  )
  on conflict (workspace_id, user_id) do update
  set
    role = coalesce(nullif(trim(p_payload->>'role'), ''), workspace_members.role),
    custom_role_id = coalesce(nullif(trim(p_payload->>'custom_role_id'), '')::uuid, workspace_members.custom_role_id),
    status = coalesce(nullif(trim(p_payload->>'status'), ''), workspace_members.status),
    updated_at = now()
  returning * into v_row;

  perform public._owe_log(v_workspace_id, 'owe_member_invited',
    jsonb_build_object('user_id', v_user_id, 'role', v_row.role, 'status', v_row.status));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.update_workspace_member(p_member_id uuid, p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_row public.workspace_members;
  v_workspace public.organization_workspaces;
begin
  perform public._irp_require_permission('workspaces.members.manage');
  v_org_id := public._mta_require_organization();

  select wm.* into v_row
  from public.workspace_members wm
  join public.organization_workspaces w on w.id = wm.workspace_id
  where wm.id = p_member_id and w.organization_id = v_org_id;

  if v_row.id is null then raise exception 'Workspace member not found'; end if;

  perform public._owe_require_workspace_access(v_row.workspace_id);

  update public.workspace_members
  set
    role = coalesce(nullif(trim(p_payload->>'role'), ''), role),
    custom_role_id = coalesce(nullif(trim(p_payload->>'custom_role_id'), '')::uuid, custom_role_id),
    status = coalesce(nullif(trim(p_payload->>'status'), ''), status),
    joined_at = case when status = 'invited' and coalesce(nullif(trim(p_payload->>'status'), ''), status) = 'active'
      then coalesce(joined_at, now()) else joined_at end,
    updated_at = now()
  where id = p_member_id
  returning * into v_row;

  perform public._owe_log(v_row.workspace_id, 'owe_member_updated',
    jsonb_build_object('member_id', p_member_id, 'role', v_row.role, 'status', v_row.status));

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.list_workspace_custom_roles()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('workspaces.view');
  v_org_id := public._mta_require_organization();

  return coalesce((
    select jsonb_agg(row_to_json(r) order by r.name)
    from public.workspace_custom_roles r
    where r.organization_id = v_org_id
  ), '[]'::jsonb);
end; $$;

create or replace function public.create_workspace_custom_role(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_settings public.organization_workspace_settings;
  v_row public.workspace_custom_roles;
begin
  perform public._irp_require_permission('workspaces.roles.manage');
  v_org_id := public._mta_require_organization();
  v_settings := public._owe_ensure_settings(v_org_id);

  if not v_settings.allow_custom_roles then
    raise exception 'Custom roles are disabled for this organization';
  end if;

  if nullif(trim(p_payload->>'name'), '') is null then
    raise exception 'name is required';
  end if;

  insert into public.workspace_custom_roles (
    organization_id, name, description, permissions
  )
  values (
    v_org_id,
    trim(p_payload->>'name'),
    nullif(trim(p_payload->>'description'), ''),
    coalesce(p_payload->'permissions', '[]'::jsonb)
  )
  returning * into v_row;

  perform public._mta_create_audit_log(
    v_org_id, 'owe_custom_role_created', 'workspace_custom_role', v_row.id, false, false, null,
    jsonb_build_object('role_name', v_row.name, 'metadata_only', true)
  );

  return row_to_json(v_row)::jsonb;
end; $$;

create or replace function public.get_workspace_permissions(p_workspace_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._irp_require_permission('workspaces.view');
  v_org_id := public._mta_require_organization();

  if p_workspace_id is not null then
    perform public._owe_require_workspace_access(p_workspace_id);
  end if;

  return jsonb_build_object(
    'organization_id', v_org_id,
    'workspace_id', p_workspace_id,
    'permissions', coalesce((
      select jsonb_agg(
        jsonb_build_object('role', rp.role, 'permission_key', rp.permission_key)
        order by rp.role, rp.permission_key
      )
      from public.workspace_role_permissions rp
      where rp.organization_id = v_org_id
        and (
          (p_workspace_id is null and rp.workspace_id is null)
          or rp.workspace_id = p_workspace_id
        )
    ), '[]'::jsonb),
    'custom_roles', coalesce((
      select jsonb_agg(row_to_json(r) order by r.name)
      from public.workspace_custom_roles r where r.organization_id = v_org_id
    ), '[]'::jsonb)
  );
end; $$;

create or replace function public.save_workspace_permissions(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_workspace_id uuid;
  v_perm jsonb;
begin
  perform public._irp_require_permission('workspaces.roles.manage');
  v_org_id := public._mta_require_organization();
  v_workspace_id := nullif(trim(p_payload->>'workspace_id'), '')::uuid;

  if v_workspace_id is not null then
    perform public._owe_require_workspace_access(v_workspace_id);
  end if;

  delete from public.workspace_role_permissions
  where organization_id = v_org_id
    and workspace_id is not distinct from v_workspace_id;

  for v_perm in select * from jsonb_array_elements(coalesce(p_payload->'permissions', '[]'::jsonb))
  loop
    insert into public.workspace_role_permissions (organization_id, workspace_id, role, permission_key)
    values (
      v_org_id,
      v_workspace_id,
      trim(v_perm->>'role'),
      trim(v_perm->>'permission_key')
    )
    on conflict (organization_id, workspace_id, role, permission_key) do nothing;
  end loop;

  if v_workspace_id is not null then
    perform public._owe_log(v_workspace_id, 'owe_permissions_saved',
      jsonb_build_object('permission_count', jsonb_array_length(coalesce(p_payload->'permissions', '[]'::jsonb))));
  else
    perform public._mta_create_audit_log(
      v_org_id, 'owe_org_permissions_saved', 'workspace_permissions', null, false, false, null,
      jsonb_build_object('metadata_only', true)
    );
  end if;

  return public.get_workspace_permissions(v_workspace_id);
end; $$;

create or replace function public.get_organization_workspace_engine_dashboard()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_org record;
  v_settings public.organization_workspace_settings;
  v_current jsonb;
  v_summary jsonb;
begin
  perform public._irp_require_permission('workspaces.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._owe_ensure_settings(v_org_id);
  v_summary := public._owe_summary_block(v_org_id);

  select o.id, o.name, o.slug, o.status into v_org
  from public.organizations o where o.id = v_org_id;

  select jsonb_build_object(
    'workspace_id', wuc.workspace_id,
    'workspace', row_to_json(w)::jsonb
  )
  into v_current
  from public.workspace_user_context wuc
  left join public.organization_workspaces w on w.id = wuc.workspace_id
  where wuc.user_id = public._mta_app_user_id() and wuc.organization_id = v_org_id;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Each workspace is an isolated operational context — KC, support, memories, automations, and tasks scoped per workspace without duplicating engine tables.',
    'principles', jsonb_build_array(
      'Organization → Workspace → Users → Roles → Permissions',
      'Multi-tenant isolation mandatory — workspaces never cross organizations',
      'Custom roles supported alongside built-in workspace roles',
      'Workspace switching preserves org context — distinct from organization switcher',
      'Integration links scaffold KC, PAME, support, automations — metadata only'
    ),
    'organization', jsonb_build_object('id', v_org.id, 'name', v_org.name, 'slug', v_org.slug, 'status', v_org.status),
    'summary', v_summary,
    'settings', row_to_json(v_settings)::jsonb,
    'current_workspace', coalesce(v_current, '{}'::jsonb),
    'workspaces', public.list_organization_workspaces(),
    'custom_roles', public.list_workspace_custom_roles(),
    'members_by_workspace', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'workspace_id', w.id,
          'workspace_slug', w.slug,
          'members', coalesce((
            select jsonb_agg(
              jsonb_build_object(
                'id', wm.id,
                'user_id', wm.user_id,
                'role', wm.role,
                'custom_role_id', wm.custom_role_id,
                'status', wm.status
              ) order by wm.role
            )
            from public.workspace_members wm
            where wm.workspace_id = w.id and wm.status != 'removed'
          ), '[]'::jsonb)
        ) order by w.name
      )
      from public.organization_workspaces w
      where w.organization_id = v_org_id and w.status != 'archived'
    ), '[]'::jsonb),
    'integration_links', case
      when v_current->>'workspace_id' is not null
      then public._owe_integration_links((v_current->>'workspace_id')::uuid)
      else '{}'::jsonb
    end,
    'permissions', public.get_workspace_permissions(null)
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

create or replace function public.export_organization_workspace_summary(p_format text default 'json')
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid; v_settings public.organization_workspace_settings;
begin
  perform public._irp_require_permission('workspaces.view');
  v_org_id := public._mta_require_organization();
  v_settings := public._owe_ensure_settings(v_org_id);

  perform public._mta_create_audit_log(
    v_org_id, 'owe_summary_exported', 'organization_workspace', null, false, false, null,
    jsonb_build_object('format', coalesce(p_format, 'json'), 'metadata_only', true)
  );

  return jsonb_build_object(
    'has_organization', true,
    'exported_at', now(),
    'manifest_type', 'organization_workspace',
    'format', coalesce(p_format, 'json'),
    'settings', row_to_json(v_settings)::jsonb,
    'summary', public._owe_summary_block(v_org_id),
    'workspaces', public.list_organization_workspaces(),
    'custom_roles', public.list_workspace_custom_roles(),
    'permissions', public.get_workspace_permissions(null)
  );
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Audit allowlist extension
-- ---------------------------------------------------------------------------
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
    'insight_dismissed', 'strategic_export_generated', 'insight_status_changed',
    'operations_event_acknowledged', 'operations_event_assigned', 'operations_event_escalated',
    'operations_event_resolved', 'operations_event_dismissed',
    'improvement_approved', 'improvement_dismissed', 'improvement_implemented',
    'improvement_feedback_submitted', 'improvement_outcome_reviewed',
    'oversight_approval_submitted', 'oversight_approval_granted', 'oversight_approval_rejected',
    'oversight_override_applied', 'oversight_critical_confirmed', 'oversight_rationale_updated',
    'oversight_settings_changed',
    'business_pack_activated', 'business_pack_customized', 'business_pack_update_acknowledged',
    'workflow_created', 'workflow_status_changed', 'workflow_executed',
    'workflow_template_applied', 'workflow_step_approval_requested', 'workflow_step_approved',
    'workflow_step_rejected', 'workflow_escalated',
    'industry_profile_assigned', 'industry_insight_overridden', 'industry_insights_toggled',
    'industry_terminology_updated', 'industry_priorities_updated', 'industry_insights_exported',
    'change_initiative_created', 'change_initiative_status_updated', 'change_impact_assessed',
    'change_communication_plan_created', 'change_communication_released',
    'change_training_assigned', 'change_adoption_metric_recorded', 'change_milestone_completed',
    'value_baseline_captured', 'value_metric_recorded', 'value_metric_updated',
    'value_report_generated', 'value_report_exported', 'value_milestone_adjusted',
    'resilience_plan_created', 'resilience_plan_status_updated', 'resilience_plan_approved',
    'resilience_simulation_recorded', 'resilience_review_completed',
    'resilience_vulnerability_recorded', 'resilience_vulnerability_resolved',
    'irce_incident_created', 'irce_incident_owner_assigned', 'irce_incident_severity_updated',
    'irce_incident_status_updated', 'irce_incident_escalated', 'irce_incident_resolved',
    'irce_incident_closed', 'irce_incident_communication_recorded', 'irce_incident_lessons_captured',
    'odse_decision_proposed', 'odse_decision_review_started', 'odse_decision_approved',
    'odse_decision_rejected', 'odse_decision_implemented', 'odse_decision_outcome_recorded',
    'odse_decision_report_exported',
    'sae_objective_created', 'sae_objective_updated', 'sae_objective_entity_linked',
    'sae_strategic_review_recorded', 'sae_misalignment_detected', 'sae_alignment_report_exported',
    'ohe_health_measured', 'ohe_category_refreshed', 'ohe_score_overridden',
    'ohe_recommendations_generated', 'ohe_intervention_approved', 'ohe_health_report_exported',
    'cma_assessment_created', 'cma_assessment_updated', 'cma_roadmap_generated', 'cma_maturity_report_exported',
    'obe_profile_created', 'obe_profile_updated', 'obe_comparison_generated', 'obe_benchmark_report_exported',
    'doe_template_created', 'doe_template_updated', 'doe_template_archived',
    'doe_output_generated', 'doe_schedule_created', 'doe_schedule_cancelled',
    'doe_delivery_recorded', 'doe_manifest_exported',
    'rrme_policy_created', 'rrme_policy_updated', 'rrme_policy_retired',
    'rrme_record_archived', 'rrme_record_restored',
    'rrme_disposal_requested', 'rrme_disposal_approved', 'rrme_disposal_rejected', 'rrme_disposal_completed',
    'mcie_meeting_created', 'mcie_meeting_status_updated', 'mcie_meeting_cancelled',
    'mcie_agenda_generated', 'mcie_summary_captured', 'mcie_actions_extracted',
    'mcie_action_assigned', 'mcie_action_status_updated', 'mcie_actions_marked_overdue',
    'mcie_decision_captured', 'mcie_outputs_generated', 'mcie_manifest_exported',
    'utfe_task_created', 'utfe_task_created_from_source', 'utfe_task_assigned',
    'utfe_task_status_updated', 'utfe_task_completed', 'utfe_reminder_scheduled',
    'utfe_task_escalated', 'utfe_calendar_sync_requested', 'utfe_manifest_exported',
    'rpe_plan_created', 'rpe_plan_status_updated', 'rpe_plan_approved',
    'rpe_allocation_created', 'rpe_allocation_updated', 'rpe_utilization_overridden',
    'rpe_scenario_created', 'rpe_scenarios_compared', 'rpe_manifest_exported',
    'cwme_capacity_profile_created', 'cwme_capacity_profile_updated',
    'cwme_workload_item_created', 'cwme_workload_reassigned',
    'cwme_warning_acknowledged', 'cwme_threshold_updated', 'cwme_manifest_exported',
    'goke_objective_created', 'goke_objective_activated', 'goke_objective_completion_approved',
    'goke_key_result_created', 'goke_progress_updated', 'goke_progress_overridden',
    'goke_manifest_exported',
    'pie_insights_generated', 'pie_insight_dismissed', 'pie_manifest_exported',
    'ctie_participation_updated', 'ctie_insights_generated', 'ctie_anonymized_contribution',
    'ctie_recommendation_approved', 'ctie_outcome_recorded', 'ctie_manifest_exported',
    'pse_partner_created', 'pse_partner_updated', 'pse_partner_status_changed',
    'pse_engagement_created', 'pse_review_recorded', 'pse_manifest_exported', 'pse_outcome_recorded',
    'tre_trust_score_refreshed', 'tre_signal_recorded', 'tre_manifest_exported',
    'acge_budget_created', 'acge_budget_updated', 'acge_usage_recorded', 'acge_alert_triggered',
    'acge_manifest_exported',
    'owe_workspace_created', 'owe_workspace_updated', 'owe_workspace_archived',
    'owe_workspace_switched', 'owe_member_invited', 'owe_member_updated',
    'owe_custom_role_created', 'owe_org_permissions_saved', 'owe_summary_exported'
  ) or p_action_type like 'ai_%' or p_action_type like '%_changed' or p_action_type like 'owe_%';
$$;

-- ---------------------------------------------------------------------------
-- 12. KC category seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'organization-workspace-engine', 'Organization & Workspace Engine',
  'Organization → Workspace → Users → Roles → Permissions — isolated operational contexts per workspace.',
  'authenticated', 100
where not exists (
  select 1 from public.aipify_knowledge_categories
  where slug = 'organization-workspace-engine' and tenant_id is null
);

-- ---------------------------------------------------------------------------
-- 13. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_organization_workspace_engine_card() to authenticated;
grant execute on function public.get_organization_workspace_engine_dashboard() to authenticated;
grant execute on function public.list_organization_workspaces() to authenticated;
grant execute on function public.get_current_workspace() to authenticated;
grant execute on function public.switch_workspace(uuid) to authenticated;
grant execute on function public.create_organization_workspace(jsonb) to authenticated;
grant execute on function public.update_organization_workspace(uuid, jsonb) to authenticated;
grant execute on function public.archive_organization_workspace(uuid) to authenticated;
grant execute on function public.invite_workspace_member(jsonb) to authenticated;
grant execute on function public.update_workspace_member(uuid, jsonb) to authenticated;
grant execute on function public.list_workspace_custom_roles() to authenticated;
grant execute on function public.create_workspace_custom_role(jsonb) to authenticated;
grant execute on function public.get_workspace_permissions(uuid) to authenticated;
grant execute on function public.save_workspace_permissions(jsonb) to authenticated;
grant execute on function public.export_organization_workspace_summary(text) to authenticated;

-- ---------------------------------------------------------------------------
-- 14. Dogfood seed (skip if org missing)
-- ---------------------------------------------------------------------------
do $$ declare
  v_org record;
begin
  for v_org in
    select id, slug from public.organizations where slug in ('aipify-group', 'unonight')
  loop
    perform public._owe_seed_dogfood_workspaces(v_org.id, v_org.slug);
  end loop;
end $$;
