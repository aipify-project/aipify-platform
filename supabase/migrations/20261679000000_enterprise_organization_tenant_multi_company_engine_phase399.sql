-- Phase 399 — Enterprise Organization, Tenant & Multi-Company Management Engine
-- Feature owner: CUSTOMER APP. Route: /app/organizations. Helpers: _gpeo399_*
-- Distinct from A.75 Organization Workspace Engine and Phase 263 Aipify Group AS super-admin hierarchy.

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.enterprise_org_groups (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations (id) on delete cascade,
  group_name text not null,
  group_type text not null default 'group_company' check (
    group_type in (
      'single_company', 'group_company', 'holding_company', 'franchise_organization',
      'enterprise_division', 'custom'
    )
  ),
  status text not null default 'active' check (status in ('active', 'archived')),
  health_score integer not null default 72 check (health_score between 0 and 100),
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enterprise_org_groups_org_idx
  on public.enterprise_org_groups (organization_id, status);

create table if not exists public.enterprise_org_entities (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.enterprise_org_groups (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  parent_entity_id uuid references public.enterprise_org_entities (id) on delete set null,
  name text not null,
  slug text not null,
  entity_type text not null default 'business_unit' check (
    entity_type in (
      'single_company', 'group_company', 'holding_company', 'subsidiary',
      'regional_entity', 'business_unit', 'franchise_organization',
      'enterprise_division', 'custom'
    )
  ),
  status text not null default 'active' check (status in ('active', 'archived', 'pending_setup')),
  leadership_name text not null default '',
  revenue_amount numeric(14, 2),
  revenue_currency text not null default 'NOK',
  employee_count integer not null default 0 check (employee_count >= 0),
  digital_employee_count integer not null default 0 check (digital_employee_count >= 0),
  health_score integer not null default 70 check (health_score between 0 and 100),
  performance_label text not null default 'stable' check (
    performance_label in ('outperforming', 'stable', 'needs_attention', 'critical')
  ),
  linked_organization_id uuid references public.organizations (id) on delete set null,
  business_packs jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (group_id, slug)
);

create index if not exists enterprise_org_entities_group_idx
  on public.enterprise_org_entities (group_id, status);
create index if not exists enterprise_org_entities_parent_idx
  on public.enterprise_org_entities (parent_entity_id, status);

create table if not exists public.enterprise_org_departments (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.enterprise_org_entities (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  slug text not null,
  department_key text not null default 'other' check (
    department_key in (
      'support', 'sales', 'marketing', 'finance', 'operations', 'development', 'hr', 'other'
    )
  ),
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  unique (entity_id, slug)
);

create index if not exists enterprise_org_departments_entity_idx
  on public.enterprise_org_departments (entity_id, status);

create table if not exists public.enterprise_org_teams (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.enterprise_org_entities (id) on delete cascade,
  department_id uuid not null references public.enterprise_org_departments (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  slug text not null,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  unique (entity_id, slug)
);

create index if not exists enterprise_org_teams_department_idx
  on public.enterprise_org_teams (department_id, status);

create table if not exists public.enterprise_org_regions (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.enterprise_org_groups (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  region_name text not null,
  country_code text not null default '',
  region_code text not null default '',
  primary_language text not null default 'en',
  currency text not null default 'NOK',
  compliance_rules jsonb not null default '[]'::jsonb,
  local_governance jsonb not null default '{}'::jsonb,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enterprise_org_regions_group_idx
  on public.enterprise_org_regions (group_id, status);

create table if not exists public.enterprise_org_shared_services (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.enterprise_org_groups (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  service_type text not null check (
    service_type in (
      'shared_workforce', 'shared_finance', 'shared_it', 'shared_knowledge',
      'shared_services_team', 'shared_business_pack'
    )
  ),
  name text not null,
  description text not null default '',
  utilization_percent integer not null default 0 check (utilization_percent between 0 and 100),
  status text not null default 'active' check (status in ('active', 'archived')),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enterprise_org_shared_services_group_idx
  on public.enterprise_org_shared_services (group_id, status);

create table if not exists public.enterprise_org_access_scopes (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.enterprise_org_groups (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  scope_type text not null check (
    scope_type in (
      'global', 'regional', 'business_unit', 'department', 'local', 'custom'
    )
  ),
  scope_label text not null,
  entity_id uuid references public.enterprise_org_entities (id) on delete cascade,
  region_id uuid references public.enterprise_org_regions (id) on delete cascade,
  permissions jsonb not null default '[]'::jsonb,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists enterprise_org_access_scopes_group_idx
  on public.enterprise_org_access_scopes (group_id, scope_type, status);

create table if not exists public.enterprise_org_advisor_signals (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.enterprise_org_groups (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  signal_type text not null check (
    signal_type in (
      'unit_outperforming', 'regional_growth', 'subsidiary_review',
      'shared_service_utilization', 'expansion_opportunity', 'governance_gap',
      'consolidation_ready', 'strategic_risk'
    )
  ),
  observation text not null,
  impact text not null default '',
  recommendation text not null default '',
  effort text not null default 'moderate' check (effort in ('low', 'moderate', 'high')),
  confidence text not null default 'moderate' check (confidence in ('low', 'moderate', 'high')),
  entity_id uuid references public.enterprise_org_entities (id) on delete set null,
  region_id uuid references public.enterprise_org_regions (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists enterprise_org_advisor_signals_group_idx
  on public.enterprise_org_advisor_signals (group_id, created_at desc);

create table if not exists public.enterprise_org_audit_logs (
  id uuid primary key default gen_random_uuid(),
  group_id uuid references public.enterprise_org_groups (id) on delete set null,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  entity_id uuid references public.enterprise_org_entities (id) on delete set null,
  event_type text not null check (
    event_type in (
      'organization_created', 'organization_updated', 'subsidiary_created',
      'business_unit_created', 'regional_entity_created', 'permission_updated',
      'consolidated_report_generated', 'governance_policy_updated',
      'shared_service_created', 'department_created', 'team_created'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists enterprise_org_audit_logs_org_idx
  on public.enterprise_org_audit_logs (organization_id, created_at desc);

alter table public.enterprise_org_groups enable row level security;
alter table public.enterprise_org_entities enable row level security;
alter table public.enterprise_org_departments enable row level security;
alter table public.enterprise_org_teams enable row level security;
alter table public.enterprise_org_regions enable row level security;
alter table public.enterprise_org_shared_services enable row level security;
alter table public.enterprise_org_access_scopes enable row level security;
alter table public.enterprise_org_advisor_signals enable row level security;
alter table public.enterprise_org_audit_logs enable row level security;

revoke all on public.enterprise_org_groups from authenticated, anon;
revoke all on public.enterprise_org_entities from authenticated, anon;
revoke all on public.enterprise_org_departments from authenticated, anon;
revoke all on public.enterprise_org_teams from authenticated, anon;
revoke all on public.enterprise_org_regions from authenticated, anon;
revoke all on public.enterprise_org_shared_services from authenticated, anon;
revoke all on public.enterprise_org_access_scopes from authenticated, anon;
revoke all on public.enterprise_org_advisor_signals from authenticated, anon;
revoke all on public.enterprise_org_audit_logs from authenticated, anon;

insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'enterprise_organization_engine', v.description
from (values
  ('enterprise_organization.view', 'View Enterprise Organization', 'View organization hierarchy, consolidation, and governance'),
  ('enterprise_organization.manage', 'Manage Enterprise Organization', 'Create entities, regions, shared services, and governance scopes')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 2. Helpers — _gpeo399_*
-- ---------------------------------------------------------------------------
create or replace function public._gpeo399_require_access()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_plan text;
begin
  if auth.uid() is null then raise exception 'Authentication required'; end if;
  v_org_id := public._mta_require_organization();
  v_plan := public._aef_tenant_plan(v_org_id);
  if v_plan not in ('business', 'enterprise') then
    raise exception 'Enterprise Organization Engine requires Business or Enterprise plan';
  end if;
  return jsonb_build_object('organization_id', v_org_id, 'plan', v_plan);
end;
$$;

create or replace function public._gpeo399_log_audit(
  p_group_id uuid,
  p_org_id uuid,
  p_entity_id uuid,
  p_event_type text,
  p_summary text,
  p_context jsonb default '{}'::jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  insert into public.enterprise_org_audit_logs (
    group_id, organization_id, entity_id, event_type, summary, actor_user_id, context
  ) values (
    p_group_id, p_org_id, p_entity_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gpeo399_ensure_group(p_org_id uuid)
returns public.enterprise_org_groups
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.enterprise_org_groups;
  v_org_name text;
begin
  select * into v_row from public.enterprise_org_groups where organization_id = p_org_id;
  if v_row.id is not null then return v_row; end if;

  select o.name into v_org_name from public.organizations o where o.id = p_org_id;

  insert into public.enterprise_org_groups (organization_id, group_name, group_type)
  values (p_org_id, coalesce(v_org_name, 'Enterprise Group'), 'group_company')
  returning * into v_row;

  perform public._gpeo399_log_audit(
    v_row.id, p_org_id, null, 'organization_created',
    'Enterprise organization group initialized',
    jsonb_build_object('group_type', v_row.group_type)
  );

  return v_row;
end;
$$;

create or replace function public._gpeo399_entity_metrics(p_entity_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_entity public.enterprise_org_entities;
  v_departments integer := 0;
  v_teams integer := 0;
begin
  select * into v_entity from public.enterprise_org_entities where id = p_entity_id;
  if v_entity.id is null then return '{}'::jsonb; end if;

  select count(*)::int into v_departments
  from public.enterprise_org_departments d where d.entity_id = p_entity_id and d.status = 'active';
  select count(*)::int into v_teams
  from public.enterprise_org_teams t where t.entity_id = p_entity_id and t.status = 'active';

  return jsonb_build_object(
    'departments_count', v_departments,
    'teams_count', v_teams,
    'employee_count', v_entity.employee_count,
    'digital_employee_count', v_entity.digital_employee_count,
    'health_score', v_entity.health_score,
    'performance_label', v_entity.performance_label
  );
end;
$$;

create or replace function public._gpeo399_build_entity_json(p_entity public.enterprise_org_entities)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  return jsonb_build_object(
    'id', p_entity.id,
    'group_id', p_entity.group_id,
    'parent_entity_id', p_entity.parent_entity_id,
    'name', p_entity.name,
    'slug', p_entity.slug,
    'entity_type', p_entity.entity_type,
    'status', p_entity.status,
    'leadership_name', p_entity.leadership_name,
    'revenue_amount', p_entity.revenue_amount,
    'revenue_currency', p_entity.revenue_currency,
    'employee_count', p_entity.employee_count,
    'digital_employee_count', p_entity.digital_employee_count,
    'health_score', p_entity.health_score,
    'performance_label', p_entity.performance_label,
    'linked_organization_id', p_entity.linked_organization_id,
    'business_packs', p_entity.business_packs,
    'metrics', public._gpeo399_entity_metrics(p_entity.id),
    'created_at', p_entity.created_at,
    'updated_at', p_entity.updated_at
  );
end;
$$;

create or replace function public._gpeo399_seed_demo_structure(p_group public.enterprise_org_groups, p_org_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_root_id uuid;
  v_regional_id uuid;
  v_bu_id uuid;
  v_dept_id uuid;
begin
  if exists (select 1 from public.enterprise_org_entities where group_id = p_group.id) then
    return;
  end if;

  insert into public.enterprise_org_entities (
    group_id, organization_id, parent_entity_id, name, slug, entity_type,
    leadership_name, employee_count, digital_employee_count, health_score, performance_label
  ) values (
    p_group.id, p_org_id, null, p_group.group_name, 'root', 'group_company',
    '', 0, 0, p_group.health_score, 'stable'
  ) returning id into v_root_id;

  insert into public.enterprise_org_entities (
    group_id, organization_id, parent_entity_id, name, slug, entity_type,
    leadership_name, employee_count, digital_employee_count, health_score, performance_label
  ) values (
    p_group.id, p_org_id, v_root_id, 'Regional Operations', 'regional-operations', 'regional_entity',
    '', 0, 0, 75, 'stable'
  ) returning id into v_regional_id;

  insert into public.enterprise_org_entities (
    group_id, organization_id, parent_entity_id, name, slug, entity_type,
    leadership_name, employee_count, digital_employee_count, health_score, performance_label
  ) values (
    p_group.id, p_org_id, v_regional_id, 'Primary Business Unit', 'primary-business-unit', 'business_unit',
    '', 0, 0, 78, 'outperforming'
  ) returning id into v_bu_id;

  insert into public.enterprise_org_departments (entity_id, organization_id, name, slug, department_key)
  values (v_bu_id, p_org_id, 'Operations', 'operations', 'operations')
  returning id into v_dept_id;

  insert into public.enterprise_org_teams (entity_id, department_id, organization_id, name, slug)
  values (v_bu_id, v_dept_id, p_org_id, 'Core Team', 'core-team');

  insert into public.enterprise_org_regions (
    group_id, organization_id, region_name, country_code, region_code, primary_language, currency
  ) values
    (p_group.id, p_org_id, 'Nordic Region', 'NO', 'nordic', 'no', 'NOK'),
    (p_group.id, p_org_id, 'Nordic Region', 'SE', 'nordic', 'sv', 'SEK'),
    (p_group.id, p_org_id, 'Nordic Region', 'DK', 'nordic', 'da', 'DKK');

  insert into public.enterprise_org_shared_services (
    group_id, organization_id, service_type, name, description, utilization_percent
  ) values
    (p_group.id, p_org_id, 'shared_finance', 'Group Finance', 'Consolidated finance and reporting services', 45),
    (p_group.id, p_org_id, 'shared_it', 'Group IT', 'Shared infrastructure and security operations', 62),
    (p_group.id, p_org_id, 'shared_knowledge', 'Group Knowledge', 'Shared Knowledge Center and playbooks', 38);

  insert into public.enterprise_org_access_scopes (
    group_id, organization_id, scope_type, scope_label, permissions
  ) values (
    p_group.id, p_org_id, 'global', 'Global administrators',
    '["enterprise_organization.view","enterprise_organization.manage"]'::jsonb
  );

  insert into public.enterprise_org_advisor_signals (
    group_id, organization_id, signal_type, observation, impact, recommendation, effort, confidence, entity_id
  ) values
    (
      p_group.id, p_org_id, 'unit_outperforming',
      'Primary Business Unit health score exceeds group average.',
      'Strong operational performance may support expansion planning.',
      'Review capacity and consider documenting best practices for other units.',
      'low', 'high', v_bu_id
    ),
    (
      p_group.id, p_org_id, 'shared_service_utilization',
      'Shared IT utilization is approaching recommended capacity thresholds.',
      'Increased demand may affect rollout timelines for new entities.',
      'Review shared service capacity and governance coverage before adding subsidiaries.',
      'moderate', 'moderate', null
    );
end;
$$;

create or replace function public._gpeo399_consolidation_block(p_group_id uuid, p_org_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_entities integer := 0;
  v_subsidiaries integer := 0;
  v_business_units integer := 0;
  v_regions integer := 0;
  v_employees integer := 0;
  v_digital integer := 0;
  v_revenue numeric := 0;
  v_business_packs integer := 0;
begin
  select count(*)::int,
         count(*) filter (where entity_type = 'subsidiary')::int,
         count(*) filter (where entity_type = 'business_unit')::int,
         coalesce(sum(employee_count), 0)::int,
         coalesce(sum(digital_employee_count), 0)::int,
         coalesce(sum(revenue_amount), 0)
  into v_entities, v_subsidiaries, v_business_units, v_employees, v_digital, v_revenue
  from public.enterprise_org_entities
  where group_id = p_group_id and status = 'active';

  select count(*)::int into v_regions
  from public.enterprise_org_regions where group_id = p_group_id and status = 'active';

  select count(*)::int into v_business_packs
  from public.tenant_modules tm
  where tm.tenant_id = p_org_id and tm.enabled = true;

  return jsonb_build_object(
    'organizations', 1,
    'subsidiaries', v_subsidiaries,
    'business_units', v_business_units,
    'regions', v_regions,
    'employees', v_employees,
    'digital_employees', v_digital,
    'active_business_packs', v_business_packs,
    'consolidated_revenue', v_revenue,
    'total_entities', v_entities,
    'metadata_only', true,
    'privacy_note', 'Consolidated metrics use approved metadata only — no cross-tenant operational records.'
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 3. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_enterprise_organization_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_org_id uuid;
  v_group public.enterprise_org_groups;
  v_human_employees integer := 0;
  v_entities jsonb := '[]'::jsonb;
  v_regions jsonb := '[]'::jsonb;
  v_shared jsonb := '[]'::jsonb;
  v_scopes jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_hierarchy jsonb := '[]'::jsonb;
begin
  perform public._irp_require_permission('enterprise_organization.view');
  v_ctx := public._gpeo399_require_access();
  v_org_id := (v_ctx->>'organization_id')::uuid;
  v_group := public._gpeo399_ensure_group(v_org_id);
  perform public._gpeo399_seed_demo_structure(v_group, v_org_id);

  select count(*)::int into v_human_employees
  from public.users u
  where u.company_id = (select company_id from public.customers where id = v_org_id);

  select coalesce(jsonb_agg(public._gpeo399_build_entity_json(e) order by e.name), '[]'::jsonb)
  into v_entities
  from public.enterprise_org_entities e
  where e.group_id = v_group.id and e.status != 'archived';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', r.id, 'region_name', r.region_name, 'country_code', r.country_code,
    'region_code', r.region_code, 'primary_language', r.primary_language,
    'currency', r.currency, 'compliance_rules', r.compliance_rules,
    'local_governance', r.local_governance, 'status', r.status
  ) order by r.region_name, r.country_code), '[]'::jsonb)
  into v_regions
  from public.enterprise_org_regions r
  where r.group_id = v_group.id and r.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'service_type', s.service_type, 'name', s.name,
    'description', s.description, 'utilization_percent', s.utilization_percent, 'status', s.status
  ) order by s.utilization_percent desc), '[]'::jsonb)
  into v_shared
  from public.enterprise_org_shared_services s
  where s.group_id = v_group.id and s.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'scope_type', a.scope_type, 'scope_label', a.scope_label,
    'entity_id', a.entity_id, 'region_id', a.region_id, 'permissions', a.permissions, 'status', a.status
  ) order by a.scope_type), '[]'::jsonb)
  into v_scopes
  from public.enterprise_org_access_scopes a
  where a.group_id = v_group.id and a.status = 'active';

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', sig.id, 'signal_type', sig.signal_type, 'observation', sig.observation,
    'impact', sig.impact, 'recommendation', sig.recommendation,
    'effort', sig.effort, 'confidence', sig.confidence,
    'entity_id', sig.entity_id, 'region_id', sig.region_id, 'created_at', sig.created_at
  ) order by sig.created_at desc), '[]'::jsonb)
  into v_signals
  from public.enterprise_org_advisor_signals sig
  where sig.group_id = v_group.id
  limit 12;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id, 'event_type', l.event_type, 'summary', l.summary, 'created_at', l.created_at
  ) order by l.created_at desc), '[]'::jsonb)
  into v_audit
  from public.enterprise_org_audit_logs l
  where l.organization_id = v_org_id
  limit 20;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', e.id, 'name', e.name, 'slug', e.slug, 'entity_type', e.entity_type,
    'parent_entity_id', e.parent_entity_id, 'health_score', e.health_score,
    'performance_label', e.performance_label
  ) order by e.name), '[]'::jsonb)
  into v_hierarchy
  from public.enterprise_org_entities e
  where e.group_id = v_group.id and e.status = 'active';

  return jsonb_build_object(
    'found', true,
    'has_access', true,
    'philosophy', 'Large organizations rarely consist of a single company — Aipify supports entire corporate structures with governed consolidation.',
    'mission', 'Enterprise Organization Engine — subsidiaries, business units, regional operations, shared services, and consolidated governance.',
    'abos_principle', 'People First. Technology Second. Humans decide — Aipify prepares structure, consolidation, and recommendations.',
    'organization_workspace_route', '/app/organization-workspace-engine',
    'distinction_note', 'Distinct from A.75 workspaces (intra-tenant) and Phase 263 Aipify Group AS super-admin hierarchy.',
    'group', jsonb_build_object(
      'id', v_group.id,
      'group_name', v_group.group_name,
      'group_type', v_group.group_type,
      'status', v_group.status,
      'health_score', v_group.health_score
    ),
    'overview', public._gpeo399_consolidation_block(v_group.id, v_org_id)
      || jsonb_build_object('organization_health_score', v_group.health_score, 'tenant_employees', v_human_employees),
    'modules', jsonb_build_array(
      jsonb_build_object('key', 'overview', 'route', '/app/organizations'),
      jsonb_build_object('key', 'structure', 'route', '/app/organizations/structure'),
      jsonb_build_object('key', 'business_units', 'route', '/app/organizations/business-units'),
      jsonb_build_object('key', 'subsidiaries', 'route', '/app/organizations/subsidiaries'),
      jsonb_build_object('key', 'regional', 'route', '/app/organizations/regional'),
      jsonb_build_object('key', 'shared_services', 'route', '/app/organizations/shared-services'),
      jsonb_build_object('key', 'analytics', 'route', '/app/organizations/analytics'),
      jsonb_build_object('key', 'governance', 'route', '/app/organizations/governance')
    ),
    'entities', v_entities,
    'hierarchy', v_hierarchy,
    'regions', v_regions,
    'shared_services', v_shared,
    'access_scopes', v_scopes,
    'advisor_signals', v_signals,
    'audit_logs', v_audit,
    'analytics', jsonb_build_object(
      'revenue', (public._gpeo399_consolidation_block(v_group.id, v_org_id)->>'consolidated_revenue')::numeric,
      'headcount', (public._gpeo399_consolidation_block(v_group.id, v_org_id)->>'employees')::int,
      'digital_headcount', (public._gpeo399_consolidation_block(v_group.id, v_org_id)->>'digital_employees')::int,
      'business_pack_adoption', (public._gpeo399_consolidation_block(v_group.id, v_org_id)->>'active_business_packs')::int,
      'regional_performance', v_regions,
      'operational_health', v_group.health_score
    ),
    'executive_dashboard', jsonb_build_object(
      'organization_health', v_group.health_score,
      'regional_performance', v_regions,
      'business_unit_performance', coalesce((
        select jsonb_agg(jsonb_build_object(
          'name', e.name, 'health_score', e.health_score, 'performance_label', e.performance_label
        ))
        from public.enterprise_org_entities e
        where e.group_id = v_group.id and e.entity_type = 'business_unit' and e.status = 'active'
      ), '[]'::jsonb),
      'strategic_risks', coalesce((
        select jsonb_agg(sig.observation)
        from public.enterprise_org_advisor_signals sig
        where sig.group_id = v_group.id and sig.signal_type in ('subsidiary_review', 'governance_gap', 'strategic_risk')
      ), '[]'::jsonb),
      'growth_opportunities', coalesce((
        select jsonb_agg(sig.recommendation)
        from public.enterprise_org_advisor_signals sig
        where sig.group_id = v_group.id and sig.signal_type in ('expansion_opportunity', 'regional_growth', 'unit_outperforming')
      ), '[]'::jsonb)
    ),
    'privacy_note', 'Metadata-only consolidation — customer operational records stay within entity boundaries unless explicitly linked and approved.'
  );
exception
  when others then
    return jsonb_build_object(
      'found', false,
      'has_access', false,
      'error', SQLERRM
    );
end;
$$;

create or replace function public.enterprise_org_entity_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
  v_group public.enterprise_org_groups;
  v_action text;
  v_entity public.enterprise_org_entities;
  v_entity_id uuid;
  v_event text;
begin
  perform public._irp_require_permission('enterprise_organization.manage');
  perform public._gpeo399_require_access();
  v_org_id := public._mta_require_organization();
  v_group := public._gpeo399_ensure_group(v_org_id);
  v_action := coalesce(p_payload->>'action', '');

  if v_action = 'create_entity' then
    insert into public.enterprise_org_entities (
      group_id, organization_id, parent_entity_id, name, slug, entity_type,
      leadership_name, revenue_amount, revenue_currency, employee_count, digital_employee_count,
      health_score, performance_label, business_packs
    ) values (
      v_group.id,
      v_org_id,
      nullif(p_payload->>'parent_entity_id', '')::uuid,
      coalesce(p_payload->>'name', 'New entity'),
      lower(regexp_replace(coalesce(p_payload->>'slug', 'entity-' || substr(gen_random_uuid()::text, 1, 8)), '[^a-z0-9-]+', '-', 'g')),
      coalesce(p_payload->>'entity_type', 'business_unit'),
      coalesce(p_payload->>'leadership_name', ''),
      nullif(p_payload->>'revenue_amount', '')::numeric,
      coalesce(p_payload->>'revenue_currency', 'NOK'),
      coalesce((p_payload->>'employee_count')::int, 0),
      coalesce((p_payload->>'digital_employee_count')::int, 0),
      coalesce((p_payload->>'health_score')::int, 70),
      coalesce(p_payload->>'performance_label', 'stable'),
      coalesce(p_payload->'business_packs', '[]'::jsonb)
    ) returning * into v_entity;

    v_event := case v_entity.entity_type
      when 'subsidiary' then 'subsidiary_created'
      when 'regional_entity' then 'regional_entity_created'
      when 'business_unit' then 'business_unit_created'
      else 'organization_updated'
    end;

    perform public._gpeo399_log_audit(
      v_group.id, v_org_id, v_entity.id, v_event,
      'Entity created: ' || v_entity.name,
      jsonb_build_object('entity_type', v_entity.entity_type, 'slug', v_entity.slug)
    );

    return jsonb_build_object('ok', true, 'entity', public._gpeo399_build_entity_json(v_entity));
  end if;

  if v_action = 'update_group' then
    update public.enterprise_org_groups
    set
      group_name = coalesce(p_payload->>'group_name', group_name),
      group_type = coalesce(p_payload->>'group_type', group_type),
      health_score = coalesce((p_payload->>'health_score')::int, health_score),
      updated_at = now()
    where id = v_group.id
    returning * into v_group;

    perform public._gpeo399_log_audit(
      v_group.id, v_org_id, null, 'organization_updated',
      'Enterprise group updated',
      jsonb_build_object('group_type', v_group.group_type)
    );

    return jsonb_build_object('ok', true, 'group', row_to_json(v_group)::jsonb);
  end if;

  if v_action = 'generate_consolidated_report' then
    perform public._gpeo399_log_audit(
      v_group.id, v_org_id, null, 'consolidated_report_generated',
      'Consolidated organization report generated',
      public._gpeo399_consolidation_block(v_group.id, v_org_id)
    );
    return jsonb_build_object(
      'ok', true,
      'report', public._gpeo399_consolidation_block(v_group.id, v_org_id),
      'generated_at', now()
    );
  end if;

  raise exception 'Unsupported enterprise organization action: %', v_action;
end;
$$;

create or replace function public.get_platform_enterprise_organization_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_groups integer := 0;
  v_entities integer := 0;
begin
  if not public.is_platform_admin() then
    raise exception 'Platform admin required';
  end if;

  select count(*)::int into v_groups from public.enterprise_org_groups where status = 'active';
  select count(*)::int into v_entities from public.enterprise_org_entities where status = 'active';

  return jsonb_build_object(
    'found', true,
    'active_enterprise_groups', v_groups,
    'active_entities', v_entities,
    'privacy_note', 'Aggregates only — no customer hierarchy content exposed at platform level.'
  );
end;
$$;

grant execute on function public.get_enterprise_organization_center() to authenticated;
grant execute on function public.enterprise_org_entity_action(jsonb) to authenticated;
grant execute on function public.get_platform_enterprise_organization_overview() to authenticated;
