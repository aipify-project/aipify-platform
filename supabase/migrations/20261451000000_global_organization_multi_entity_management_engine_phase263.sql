-- Phase 263 — Global Organization & Multi-Entity Management Engine
-- Aipify Group AS parent · business entities · departments · teams · investments

-- ---------------------------------------------------------------------------
-- 1. Tables
-- ---------------------------------------------------------------------------
create table if not exists public.group_corporate_parent (
  id uuid primary key default gen_random_uuid(),
  legal_name text not null default 'Aipify Group AS',
  country_of_origin text not null default 'Norway',
  tagline text not null default 'From Norway. For the world.',
  mission_summary text not null default '',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.group_business_entities (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.group_corporate_parent (id) on delete cascade,
  name text not null,
  slug text not null unique,
  entity_type text not null default 'product_brand' check (
    entity_type in ('product_brand', 'subsidiary', 'acquisition', 'venture', 'internal')
  ),
  status text not null default 'active' check (
    status in ('active', 'archived', 'pending_setup')
  ),
  company_id uuid references public.companies (id) on delete set null,
  customer_id uuid references public.customers (id) on delete set null,
  brand_name text not null default '',
  primary_domain text not null default '',
  branding jsonb not null default '{}'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  payment_provider_keys jsonb not null default '[]'::jsonb,
  ownership_user_id uuid references auth.users (id) on delete set null,
  revenue_currency text not null default 'NOK',
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists group_business_entities_parent_idx
  on public.group_business_entities (parent_id, status);

create table if not exists public.group_entity_departments (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.group_business_entities (id) on delete cascade,
  name text not null,
  slug text not null,
  department_key text not null check (
    department_key in (
      'support', 'sales', 'marketing', 'finance', 'operations', 'development', 'hr', 'other'
    )
  ),
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  unique (entity_id, slug)
);

create index if not exists group_entity_departments_entity_idx
  on public.group_entity_departments (entity_id, status);

create table if not exists public.group_entity_teams (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.group_business_entities (id) on delete cascade,
  department_id uuid not null references public.group_entity_departments (id) on delete cascade,
  name text not null,
  slug text not null,
  status text not null default 'active' check (status in ('active', 'archived')),
  created_at timestamptz not null default now(),
  unique (entity_id, slug)
);

create index if not exists group_entity_teams_department_idx
  on public.group_entity_teams (department_id, status);

create table if not exists public.group_entity_administrators (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.group_business_entities (id) on delete cascade,
  auth_user_id uuid not null references auth.users (id) on delete cascade,
  admin_role text not null default 'entity_admin' check (
    admin_role in ('entity_admin', 'finance_admin', 'billing_admin')
  ),
  assigned_at timestamptz not null default now(),
  assigned_by uuid references auth.users (id) on delete set null,
  unique (entity_id, auth_user_id)
);

create table if not exists public.group_entity_domains (
  id uuid primary key default gen_random_uuid(),
  entity_id uuid not null references public.group_business_entities (id) on delete cascade,
  domain text not null,
  status text not null default 'pending' check (status in ('verified', 'pending', 'disabled')),
  created_at timestamptz not null default now(),
  unique (entity_id, domain)
);

create table if not exists public.group_external_investments (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.group_corporate_parent (id) on delete cascade,
  company_name text not null,
  asset_class text not null default 'company' check (
    asset_class in ('company', 'real_estate', 'partnership', 'other')
  ),
  ownership_percentage numeric(5, 2) not null default 0 check (
    ownership_percentage >= 0 and ownership_percentage <= 100
  ),
  investment_date date,
  investment_amount numeric(14, 2),
  currency text not null default 'NOK',
  status text not null default 'active' check (
    status in ('active', 'exited', 'pending', 'under_review')
  ),
  notes text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists group_external_investments_parent_idx
  on public.group_external_investments (parent_id, status);

create table if not exists public.group_shared_intelligence_signals (
  id uuid primary key default gen_random_uuid(),
  source_entity_id uuid references public.group_business_entities (id) on delete set null,
  signal_type text not null check (
    signal_type in (
      'similar_support_request', 'shared_best_practice', 'cross_sell_opportunity',
      'growth_recommendation', 'operational_pattern'
    )
  ),
  summary text not null,
  confidence text not null default 'moderate' check (
    confidence in ('low', 'moderate', 'high')
  ),
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists group_shared_intelligence_signals_entity_idx
  on public.group_shared_intelligence_signals (source_entity_id, created_at desc);

create table if not exists public.group_organization_audit_logs (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.group_corporate_parent (id) on delete set null,
  entity_id uuid references public.group_business_entities (id) on delete set null,
  event_type text not null check (
    event_type in (
      'entity_created', 'entity_archived', 'ownership_changed', 'permission_changed',
      'administrator_assigned', 'administrator_removed', 'domain_connected',
      'payment_provider_connected', 'investment_created', 'investment_updated',
      'department_created', 'team_created'
    )
  ),
  summary text not null,
  actor_user_id uuid references auth.users (id) on delete set null,
  context jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists group_organization_audit_logs_created_idx
  on public.group_organization_audit_logs (created_at desc);

alter table public.group_corporate_parent enable row level security;
alter table public.group_business_entities enable row level security;
alter table public.group_entity_departments enable row level security;
alter table public.group_entity_teams enable row level security;
alter table public.group_entity_administrators enable row level security;
alter table public.group_entity_domains enable row level security;
alter table public.group_external_investments enable row level security;
alter table public.group_shared_intelligence_signals enable row level security;
alter table public.group_organization_audit_logs enable row level security;

revoke all on public.group_corporate_parent from authenticated, anon;
revoke all on public.group_business_entities from authenticated, anon;
revoke all on public.group_entity_departments from authenticated, anon;
revoke all on public.group_entity_teams from authenticated, anon;
revoke all on public.group_entity_administrators from authenticated, anon;
revoke all on public.group_entity_domains from authenticated, anon;
revoke all on public.group_external_investments from authenticated, anon;
revoke all on public.group_shared_intelligence_signals from authenticated, anon;
revoke all on public.group_organization_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. Permissions (platform governance)
-- ---------------------------------------------------------------------------
insert into public.aipify_permissions (permission_key, permission_name, module_key, description)
select v.key, v.label, 'global_organization_multi_entity_management_engine', v.description
from (values
  ('group_organization.view', 'View Group Organization', 'View Aipify Group AS hierarchy and group overview'),
  ('group_organization.manage', 'Manage Group Organization', 'Create entities, assign administrators, and manage group structure')
) as v(key, label, description)
where not exists (select 1 from public.aipify_permissions ap where ap.permission_key = v.key);

-- ---------------------------------------------------------------------------
-- 3. Helpers — _gome263_*
-- ---------------------------------------------------------------------------
create or replace function public._gome263_require_super_admin()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  perform public._super_admin_require_super_admin();
end;
$$;

create or replace function public._gome263_ensure_parent()
returns public.group_corporate_parent
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.group_corporate_parent;
begin
  select * into v_row from public.group_corporate_parent limit 1;
  if v_row.id is null then
    insert into public.group_corporate_parent (legal_name, mission_summary)
    values (
      'Aipify Group AS',
      'Parent organization — Aipify is the operating system. Future ventures connect here.'
    )
    returning * into v_row;
  end if;
  return v_row;
end;
$$;

create or replace function public._gome263_log_audit(
  p_parent_id uuid,
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
  insert into public.group_organization_audit_logs (
    parent_id, entity_id, event_type, summary, actor_user_id, context
  ) values (
    p_parent_id, p_entity_id, p_event_type, p_summary, auth.uid(), coalesce(p_context, '{}'::jsonb)
  ) returning id into v_id;
  return v_id;
end;
$$;

create or replace function public._gome263_entity_metrics(p_entity_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_entity public.group_business_entities;
  v_users integer := 0;
  v_subscriptions integer := 0;
  v_support_open integer := 0;
begin
  select * into v_entity from public.group_business_entities where id = p_entity_id;
  if v_entity.id is null then
    return '{}'::jsonb;
  end if;

  if v_entity.company_id is not null then
    select count(*)::int into v_users from public.users where company_id = v_entity.company_id;
  end if;

  if v_entity.customer_id is not null then
    select count(*)::int into v_subscriptions
    from public.subscriptions s
    where s.customer_id = v_entity.customer_id and s.status in ('active', 'trialing');
  end if;

  return jsonb_build_object(
    'active_users', v_users,
    'active_subscriptions', v_subscriptions,
    'support_open_cases', v_support_open
  );
end;
$$;

create or replace function public._gome263_build_entity_json(p_entity public.group_business_entities)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_departments integer;
  v_teams integer;
  v_admins integer;
  v_domains integer;
  v_metrics jsonb;
begin
  select count(*)::int into v_departments
  from public.group_entity_departments d where d.entity_id = p_entity.id and d.status = 'active';
  select count(*)::int into v_teams
  from public.group_entity_teams t where t.entity_id = p_entity.id and t.status = 'active';
  select count(*)::int into v_admins
  from public.group_entity_administrators a where a.entity_id = p_entity.id;
  select count(*)::int into v_domains
  from public.group_entity_domains dom where dom.entity_id = p_entity.id and dom.status = 'verified';
  v_metrics := public._gome263_entity_metrics(p_entity.id);

  return jsonb_build_object(
    'id', p_entity.id,
    'name', p_entity.name,
    'slug', p_entity.slug,
    'entity_type', p_entity.entity_type,
    'status', p_entity.status,
    'brand_name', p_entity.brand_name,
    'primary_domain', p_entity.primary_domain,
    'company_id', p_entity.company_id,
    'customer_id', p_entity.customer_id,
    'revenue_currency', p_entity.revenue_currency,
    'payment_provider_keys', p_entity.payment_provider_keys,
    'departments_count', v_departments,
    'teams_count', v_teams,
    'administrators_count', v_admins,
    'verified_domains_count', v_domains,
    'metrics', v_metrics,
    'created_at', p_entity.created_at,
    'updated_at', p_entity.updated_at
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 4. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_group_overview_center()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_parent public.group_corporate_parent;
  v_entities jsonb := '[]'::jsonb;
  v_investments jsonb := '[]'::jsonb;
  v_signals jsonb := '[]'::jsonb;
  v_audit jsonb := '[]'::jsonb;
  v_total_users integer := 0;
  v_total_subscriptions integer := 0;
  v_active_entities integer := 0;
begin
  perform public._gome263_require_super_admin();
  v_parent := public._gome263_ensure_parent();

  select coalesce(jsonb_agg(public._gome263_build_entity_json(e) order by e.name), '[]'::jsonb)
  into v_entities
  from public.group_business_entities e
  where e.parent_id = v_parent.id;

  select count(*)::int into v_active_entities
  from public.group_business_entities e
  where e.parent_id = v_parent.id and e.status = 'active';

  select coalesce(sum((public._gome263_entity_metrics(e.id)->>'active_users')::int), 0)::int
  into v_total_users
  from public.group_business_entities e
  where e.parent_id = v_parent.id;

  select coalesce(sum((public._gome263_entity_metrics(e.id)->>'active_subscriptions')::int), 0)::int
  into v_total_subscriptions
  from public.group_business_entities e
  where e.parent_id = v_parent.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', i.id, 'company_name', i.company_name, 'asset_class', i.asset_class,
    'ownership_percentage', i.ownership_percentage, 'investment_date', i.investment_date,
    'investment_amount', i.investment_amount, 'currency', i.currency, 'status', i.status,
    'notes', i.notes
  ) order by i.created_at desc), '[]'::jsonb)
  into v_investments
  from public.group_external_investments i
  where i.parent_id = v_parent.id;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', s.id, 'source_entity_id', s.source_entity_id, 'signal_type', s.signal_type,
    'summary', s.summary, 'confidence', s.confidence, 'created_at', s.created_at
  ) order by s.created_at desc), '[]'::jsonb)
  into v_signals
  from (
    select * from public.group_shared_intelligence_signals order by created_at desc limit 20
  ) s;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', a.id, 'entity_id', a.entity_id, 'event_type', a.event_type,
    'summary', a.summary, 'created_at', a.created_at
  ) order by a.created_at desc), '[]'::jsonb)
  into v_audit
  from (
    select * from public.group_organization_audit_logs order by created_at desc limit 40
  ) a;

  return jsonb_build_object(
    'principle', 'Aipify should never assume that it only serves one company.',
    'foundation_statement', 'Aipify Group AS is the parent organization. Aipify is the operating system. Future ventures are opportunities waiting to be connected.',
    'tagline', v_parent.tagline,
    'parent', jsonb_build_object(
      'id', v_parent.id,
      'legal_name', v_parent.legal_name,
      'country_of_origin', v_parent.country_of_origin,
      'tagline', v_parent.tagline
    ),
    'summary', jsonb_build_object(
      'total_entities', jsonb_array_length(v_entities),
      'active_entities', v_active_entities,
      'active_users', v_total_users,
      'active_subscriptions', v_total_subscriptions,
      'investments_count', jsonb_array_length(v_investments),
      'shared_signals_count', jsonb_array_length(v_signals)
    ),
    'entities', v_entities,
    'investments', v_investments,
    'shared_intelligence', v_signals,
    'recent_audit', v_audit,
    'hierarchy_levels', jsonb_build_array(
      jsonb_build_object('level', 1, 'name', 'Aipify Group AS', 'key', 'parent'),
      jsonb_build_object('level', 2, 'name', 'Business Entities', 'key', 'entity'),
      jsonb_build_object('level', 3, 'name', 'Departments', 'key', 'department'),
      jsonb_build_object('level', 4, 'name', 'Teams', 'key', 'team'),
      jsonb_build_object('level', 5, 'name', 'Users', 'key', 'user')
    )
  );
end;
$$;

create or replace function public.group_business_entity_action(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_action text := coalesce(p_payload->>'action', '');
  v_parent public.group_corporate_parent;
  v_entity public.group_business_entities;
  v_department public.group_entity_departments;
  v_team public.group_entity_teams;
  v_slug text;
begin
  perform public._gome263_require_super_admin();
  v_parent := public._gome263_ensure_parent();

  if v_action = 'create' then
    v_slug := coalesce(nullif(trim(p_payload->>'slug'), ''), lower(regexp_replace(p_payload->>'name', '[^a-zA-Z0-9]+', '-', 'g')));
    insert into public.group_business_entities (
      parent_id, name, slug, entity_type, brand_name, primary_domain,
      company_id, customer_id, revenue_currency, notes
    ) values (
      v_parent.id,
      coalesce(p_payload->>'name', 'New Entity'),
      v_slug,
      coalesce(p_payload->>'entity_type', 'subsidiary'),
      coalesce(p_payload->>'brand_name', p_payload->>'name', ''),
      coalesce(p_payload->>'primary_domain', ''),
      nullif(p_payload->>'company_id', '')::uuid,
      nullif(p_payload->>'customer_id', '')::uuid,
      coalesce(p_payload->>'revenue_currency', 'NOK'),
      coalesce(p_payload->>'notes', '')
    ) returning * into v_entity;

    perform public._gome263_log_audit(v_parent.id, v_entity.id, 'entity_created', format('Business entity created: %s', v_entity.name));
    return public._gome263_build_entity_json(v_entity);
  end if;

  select * into v_entity
  from public.group_business_entities
  where id = nullif(p_payload->>'entity_id', '')::uuid;

  if v_entity.id is null then
    raise exception 'Entity not found';
  end if;

  case v_action
    when 'archive' then
      update public.group_business_entities
      set status = 'archived', updated_at = now()
      where id = v_entity.id returning * into v_entity;
      perform public._gome263_log_audit(v_parent.id, v_entity.id, 'entity_archived', format('Entity archived: %s', v_entity.name));

    when 'assign_administrator' then
      insert into public.group_entity_administrators (entity_id, auth_user_id, admin_role, assigned_by)
      values (
        v_entity.id,
        nullif(p_payload->>'auth_user_id', '')::uuid,
        coalesce(p_payload->>'admin_role', 'entity_admin'),
        auth.uid()
      )
      on conflict (entity_id, auth_user_id) do update set admin_role = excluded.admin_role;
      perform public._gome263_log_audit(v_parent.id, v_entity.id, 'administrator_assigned', 'Administrator assigned to entity');

    when 'transfer_ownership' then
      update public.group_business_entities
      set ownership_user_id = nullif(p_payload->>'ownership_user_id', '')::uuid,
          updated_at = now()
      where id = v_entity.id returning * into v_entity;
      perform public._gome263_log_audit(v_parent.id, v_entity.id, 'ownership_changed', 'Entity ownership transferred');

    when 'connect_domain' then
      insert into public.group_entity_domains (entity_id, domain, status)
      values (
        v_entity.id,
        coalesce(p_payload->>'domain', ''),
        coalesce(p_payload->>'domain_status', 'pending')
      )
      on conflict (entity_id, domain) do update set status = excluded.status;
      update public.group_business_entities
      set primary_domain = coalesce(nullif(p_payload->>'domain', ''), primary_domain),
          updated_at = now()
      where id = v_entity.id returning * into v_entity;
      perform public._gome263_log_audit(v_parent.id, v_entity.id, 'domain_connected', format('Domain connected: %s', p_payload->>'domain'));

    when 'connect_payment_provider' then
      update public.group_business_entities
      set payment_provider_keys = coalesce(payment_provider_keys, '[]'::jsonb) ||
        jsonb_build_array(coalesce(p_payload->>'provider_key', 'stripe')),
          updated_at = now()
      where id = v_entity.id returning * into v_entity;
      perform public._gome263_log_audit(v_parent.id, v_entity.id, 'payment_provider_connected', format('Payment provider linked: %s', p_payload->>'provider_key'));

    when 'create_department' then
      insert into public.group_entity_departments (entity_id, name, slug, department_key)
      values (
        v_entity.id,
        coalesce(p_payload->>'department_name', 'Department'),
        coalesce(p_payload->>'department_slug', 'department'),
        coalesce(p_payload->>'department_key', 'operations')
      ) returning * into v_department;
      perform public._gome263_log_audit(v_parent.id, v_entity.id, 'department_created', format('Department created: %s', v_department.name));

    when 'create_team' then
      insert into public.group_entity_teams (entity_id, department_id, name, slug)
      values (
        v_entity.id,
        nullif(p_payload->>'department_id', '')::uuid,
        coalesce(p_payload->>'team_name', 'Team'),
        coalesce(p_payload->>'team_slug', 'team')
      ) returning * into v_team;
      perform public._gome263_log_audit(v_parent.id, v_entity.id, 'team_created', format('Team created: %s', v_team.name));

    else
      raise exception 'Invalid entity action: %', v_action;
  end case;

  select * into v_entity from public.group_business_entities where id = v_entity.id;
  return public._gome263_build_entity_json(v_entity);
end;
$$;

create or replace function public.upsert_group_investment(p_payload jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_parent public.group_corporate_parent;
  v_row public.group_external_investments;
  v_id uuid := nullif(p_payload->>'id', '')::uuid;
begin
  perform public._gome263_require_super_admin();
  v_parent := public._gome263_ensure_parent();

  if v_id is null then
    insert into public.group_external_investments (
      parent_id, company_name, asset_class, ownership_percentage,
      investment_date, investment_amount, currency, status, notes
    ) values (
      v_parent.id,
      coalesce(p_payload->>'company_name', ''),
      coalesce(p_payload->>'asset_class', 'company'),
      coalesce((p_payload->>'ownership_percentage')::numeric, 0),
      nullif(p_payload->>'investment_date', '')::date,
      nullif(p_payload->>'investment_amount', '')::numeric,
      coalesce(p_payload->>'currency', 'NOK'),
      coalesce(p_payload->>'status', 'active'),
      coalesce(p_payload->>'notes', '')
    ) returning * into v_row;
    perform public._gome263_log_audit(v_parent.id, null, 'investment_created', format('Investment registered: %s', v_row.company_name));
  else
    update public.group_external_investments set
      company_name = coalesce(p_payload->>'company_name', company_name),
      asset_class = coalesce(p_payload->>'asset_class', asset_class),
      ownership_percentage = coalesce((p_payload->>'ownership_percentage')::numeric, ownership_percentage),
      investment_date = coalesce(nullif(p_payload->>'investment_date', '')::date, investment_date),
      investment_amount = coalesce(nullif(p_payload->>'investment_amount', '')::numeric, investment_amount),
      currency = coalesce(p_payload->>'currency', currency),
      status = coalesce(p_payload->>'status', status),
      notes = coalesce(p_payload->>'notes', notes),
      updated_at = now()
    where id = v_id returning * into v_row;
    perform public._gome263_log_audit(v_parent.id, null, 'investment_updated', format('Investment updated: %s', v_row.company_name));
  end if;

  return jsonb_build_object(
    'id', v_row.id,
    'company_name', v_row.company_name,
    'asset_class', v_row.asset_class,
    'ownership_percentage', v_row.ownership_percentage,
    'investment_date', v_row.investment_date,
    'investment_amount', v_row.investment_amount,
    'currency', v_row.currency,
    'status', v_row.status,
    'notes', v_row.notes
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- 5. Seed hierarchy scaffold
-- ---------------------------------------------------------------------------
do $$
declare
  v_parent_id uuid;
  v_aipify_id uuid;
  v_unonight_id uuid;
begin
  v_parent_id := (public._gome263_ensure_parent()).id;

  insert into public.group_business_entities (
    parent_id, name, slug, entity_type, brand_name, primary_domain, status, notes
  )
  select v_parent_id, v.name, v.slug, v.entity_type, v.brand_name, v.domain, 'active', v.notes
  from (values
    ('Aipify', 'aipify', 'product_brand', 'Aipify', 'aipify.ai', 'Primary product — Aipify Business Operating System'),
    ('Unonight', 'unonight', 'subsidiary', 'Unonight', 'unonight.com', 'Pilot customer and early venture partner'),
    ('Sportsklær.no', 'sportsklaer-no', 'venture', 'Sportsklær.no', 'sportsklaer.no', 'Future connected venture — scaffold only')
  ) as v(name, slug, entity_type, brand_name, domain, notes)
  where not exists (
    select 1 from public.group_business_entities e where e.slug = v.slug
  );

  select id into v_aipify_id from public.group_business_entities where slug = 'aipify';
  select id into v_unonight_id from public.group_business_entities where slug = 'unonight';

  if v_aipify_id is not null then
    insert into public.group_entity_departments (entity_id, name, slug, department_key)
    select v_aipify_id, v.name, v.slug, v.dept_key
    from (values
      ('Development', 'development', 'development'),
      ('Operations', 'operations', 'operations'),
      ('Finance', 'finance', 'finance')
    ) as v(name, slug, dept_key)
    where not exists (
      select 1 from public.group_entity_departments d where d.entity_id = v_aipify_id and d.slug = v.slug
    );
  end if;

  if v_unonight_id is not null then
    insert into public.group_entity_departments (entity_id, name, slug, department_key)
    select v_unonight_id, v.name, v.slug, v.dept_key
    from (values
      ('Support', 'support', 'support'),
      ('Sales', 'sales', 'sales')
    ) as v(name, slug, dept_key)
    where not exists (
      select 1 from public.group_entity_departments d where d.entity_id = v_unonight_id and d.slug = v.slug
    );
  end if;

  insert into public.group_shared_intelligence_signals (source_entity_id, signal_type, summary, confidence)
  select e.id, v.signal_type, v.summary, v.confidence
  from public.group_business_entities e
  cross join (values
    ('shared_best_practice', 'Similar onboarding checklist patterns identified across product and pilot entities.', 'moderate'),
    ('growth_recommendation', 'Enterprise invoice billing may benefit Sportsklær.no when venture activates.', 'low')
  ) as v(signal_type, summary, confidence)
  where e.slug in ('aipify', 'unonight')
    and not exists (
      select 1 from public.group_shared_intelligence_signals s
      where s.summary = v.summary
    )
  limit 2;
end;
$$;

grant execute on function public.get_group_overview_center() to authenticated;
grant execute on function public.group_business_entity_action(jsonb) to authenticated;
grant execute on function public.upsert_group_investment(jsonb) to authenticated;
