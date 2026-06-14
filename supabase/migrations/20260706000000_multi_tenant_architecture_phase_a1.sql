-- Phase A.1 — Multi-Tenant Architecture Engine
-- Principle: Aipify is a standalone SaaS platform; organization_id = customers.id (tenant bridge).

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
    'multi_store_orchestration', 'aipify_core_platform', 'multi_tenant_architecture'
  )
);

-- ---------------------------------------------------------------------------
-- 1. organizations (id = customers.id for tenant compatibility)
-- ---------------------------------------------------------------------------
create table if not exists public.organizations (
  id uuid primary key references public.customers (id) on delete cascade,
  name text not null,
  slug text not null unique,
  status text not null default 'active' check (
    status in ('active', 'inactive', 'trial', 'suspended', 'archived')
  ),
  subscription_plan text not null default 'starter' check (
    subscription_plan in ('starter', 'business', 'professional', 'enterprise', 'internal')
  ),
  default_language text not null default 'en',
  fallback_language text not null default 'en',
  timezone text not null default 'Europe/Oslo',
  branding_logo_url text,
  branding_primary_color text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organizations_slug_idx on public.organizations (slug);
create index if not exists organizations_status_idx on public.organizations (status);

alter table public.organizations enable row level security;
revoke all on public.organizations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 2. organization_users
-- ---------------------------------------------------------------------------
create table if not exists public.organization_users (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references public.users (id) on delete cascade,
  role text not null check (
    role in ('owner', 'administrator', 'manager', 'support_agent', 'viewer')
  ),
  status text not null default 'active' check (
    status in ('invited', 'active', 'suspended', 'removed')
  ),
  invited_by uuid references public.users (id) on delete set null,
  invited_at timestamptz,
  joined_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

create index if not exists organization_users_user_idx on public.organization_users (user_id, status);
create index if not exists organization_users_org_idx on public.organization_users (organization_id, status);

alter table public.organization_users enable row level security;
revoke all on public.organization_users from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 3. organization_user_context (selected tenant session)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_user_context (
  user_id uuid primary key references public.users (id) on delete cascade,
  organization_id uuid not null references public.organizations (id) on delete cascade,
  updated_at timestamptz not null default now()
);

alter table public.organization_user_context enable row level security;
revoke all on public.organization_user_context from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 4. organization_modules
-- ---------------------------------------------------------------------------
create table if not exists public.organization_modules (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  module_key text not null,
  enabled boolean not null default true,
  plan_required text,
  configuration jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, module_key)
);

create index if not exists organization_modules_org_idx
  on public.organization_modules (organization_id, enabled);

alter table public.organization_modules enable row level security;
revoke all on public.organization_modules from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 5. organization_settings
-- ---------------------------------------------------------------------------
create table if not exists public.organization_settings (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  setting_key text not null,
  setting_value jsonb not null default 'null'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, setting_key)
);

alter table public.organization_settings enable row level security;
revoke all on public.organization_settings from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 6. organization_audit_logs (spec: audit_logs)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  actor_user_id uuid references public.users (id) on delete set null,
  actor_role text,
  action_type text not null,
  entity_type text,
  entity_id uuid,
  ai_involved boolean not null default false,
  approval_required boolean not null default false,
  approval_status text check (
    approval_status is null or approval_status in ('pending', 'approved', 'rejected', 'skipped')
  ),
  metadata jsonb not null default '{}'::jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists organization_audit_logs_org_idx
  on public.organization_audit_logs (organization_id, created_at desc);

alter table public.organization_audit_logs enable row level security;
revoke all on public.organization_audit_logs from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 7. organization_integrations (spec: integrations)
-- ---------------------------------------------------------------------------
create table if not exists public.organization_integrations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  integration_type text not null,
  name text not null,
  status text not null default 'pending' check (
    status in ('connected', 'pending', 'disconnected', 'error')
  ),
  credentials_reference text,
  configuration jsonb not null default '{}'::jsonb,
  last_sync_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, integration_type)
);

alter table public.organization_integrations enable row level security;
revoke all on public.organization_integrations from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 8. knowledge_faq_items (tenant-scoped FAQ per spec)
-- ---------------------------------------------------------------------------
create table if not exists public.knowledge_faq_items (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  category_id uuid references public.aipify_knowledge_categories (id) on delete set null,
  question text not null,
  answer text not null,
  slug text not null,
  visibility text not null default 'internal' check (
    visibility in ('internal', 'customer', 'public')
  ),
  status text not null default 'draft' check (
    status in ('draft', 'published', 'archived')
  ),
  language text not null default 'en',
  created_by uuid references public.users (id) on delete set null,
  updated_by uuid references public.users (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (organization_id, slug, language)
);

create index if not exists knowledge_faq_items_org_idx
  on public.knowledge_faq_items (organization_id, status);

alter table public.knowledge_faq_items enable row level security;
revoke all on public.knowledge_faq_items from authenticated, anon;

-- ---------------------------------------------------------------------------
-- 9. Helpers
-- ---------------------------------------------------------------------------
create or replace function public._mta_map_user_role(p_role text)
returns text language sql immutable as $$
  select case p_role
    when 'owner' then 'owner'
    when 'admin' then 'administrator'
    when 'staff' then 'manager'
    when 'support' then 'support_agent'
    when 'read_only' then 'viewer'
    else 'viewer'
  end;
$$;

create or replace function public._mta_auth_user_id()
returns uuid language sql stable security definer set search_path = public as $$
  select auth.uid();
$$;

create or replace function public._mta_app_user_id()
returns uuid language plpgsql stable security definer set search_path = public as $$
declare v_user_id uuid;
begin
  select u.id into v_user_id from public.users u where u.auth_user_id = auth.uid() limit 1;
  return v_user_id;
end; $$;

create or replace function public._mta_role_permission(p_role text, p_permission text)
returns boolean language plpgsql immutable as $$
begin
  if p_role = 'owner' then return true; end if;
  case p_permission
    when 'billing' then return p_role = 'owner';
    when 'user_management' then return p_role in ('owner', 'administrator');
    when 'module_management' then return p_role in ('owner', 'administrator');
    when 'integration_management' then return p_role in ('owner', 'administrator');
    when 'audit_log_access' then return p_role in ('owner', 'administrator');
    when 'approve_ai_actions' then return p_role in ('owner', 'administrator', 'manager');
    when 'settings_manage' then return p_role in ('owner', 'administrator');
    when 'settings_limited' then return p_role in ('owner', 'administrator', 'manager');
    when 'support_cases' then return p_role in ('owner', 'administrator', 'manager', 'support_agent');
    when 'knowledge_search' then return p_role in ('owner', 'administrator', 'manager', 'support_agent', 'viewer');
    when 'read_only' then return true;
    else return false;
  end case;
end; $$;

create or replace function public._mta_membership_active(
  p_organization_id uuid,
  p_user_id uuid default public._mta_app_user_id()
)
returns public.organization_users language plpgsql stable security definer set search_path = public as $$
declare v_row public.organization_users;
begin
  select * into v_row
  from public.organization_users ou
  where ou.organization_id = p_organization_id
    and ou.user_id = p_user_id
    and ou.status = 'active'
  limit 1;
  return v_row;
end; $$;

create or replace function public._mta_require_organization(p_organization_id uuid default null)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_org_id uuid;
  v_membership public.organization_users;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then raise exception 'Unauthorized'; end if;

  if p_organization_id is not null then
    v_org_id := p_organization_id;
  else
    select ouc.organization_id into v_org_id
    from public.organization_user_context ouc
    where ouc.user_id = v_user_id;
  end if;

  if v_org_id is null then
    select ou.organization_id into v_org_id
    from public.organization_users ou
    where ou.user_id = v_user_id and ou.status = 'active'
    order by ou.joined_at nulls last, ou.created_at
    limit 1;
  end if;

  if v_org_id is null then
    select o.id into v_org_id
    from public.organizations o
    join public.customers c on c.id = o.id
    join public.users u on u.company_id = c.company_id
    where u.id = v_user_id
    limit 1;
  end if;

  if v_org_id is null then raise exception 'Organization context required'; end if;

  v_membership := public._mta_membership_active(v_org_id, v_user_id);
  if v_membership is null then raise exception 'Access denied for organization'; end if;

  insert into public.organization_user_context (user_id, organization_id, updated_at)
  values (v_user_id, v_org_id, now())
  on conflict (user_id) do update set organization_id = excluded.organization_id, updated_at = now();

  return v_org_id;
end; $$;

create or replace function public._mta_require_role(p_permission text, p_organization_id uuid default null)
returns public.organization_users language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_membership public.organization_users;
begin
  v_org_id := public._mta_require_organization(p_organization_id);
  v_membership := public._mta_membership_active(v_org_id);
  if not public._mta_role_permission(v_membership.role, p_permission) then
    raise exception 'Insufficient permissions';
  end if;
  return v_membership;
end; $$;

create or replace function public._mta_require_module(p_module_key text, p_organization_id uuid default null)
returns void language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization(p_organization_id);
  if not exists (
    select 1 from public.organization_modules m
    where m.organization_id = v_org_id and m.module_key = p_module_key and m.enabled = true
  ) then
    raise exception 'Module not enabled: %', p_module_key;
  end if;
end; $$;

create or replace function public._mta_create_audit_log(
  p_organization_id uuid,
  p_action_type text,
  p_entity_type text default null,
  p_entity_id uuid default null,
  p_ai_involved boolean default false,
  p_approval_required boolean default false,
  p_approval_status text default null,
  p_metadata jsonb default '{}'::jsonb
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_user_id uuid;
  v_membership public.organization_users;
  v_id uuid;
begin
  v_user_id := public._mta_app_user_id();
  v_membership := public._mta_membership_active(p_organization_id, v_user_id);
  insert into public.organization_audit_logs (
    organization_id, actor_user_id, actor_role, action_type, entity_type, entity_id,
    ai_involved, approval_required, approval_status, metadata
  ) values (
    p_organization_id, v_user_id, v_membership.role, p_action_type, p_entity_type, p_entity_id,
    p_ai_involved, p_approval_required, p_approval_status, p_metadata
  ) returning id into v_id;
  return v_id;
end; $$;

create or replace function public._mta_sync_organization_from_customer(p_customer_id uuid)
returns public.organizations language plpgsql security definer set search_path = public as $$
declare
  v_org public.organizations;
  v_name text;
  v_slug text;
  v_status text;
  v_plan text;
  v_lang text;
  v_tz text;
begin
  select
    coalesce(p.name, c.company_name, comp.name, 'Organization'),
    coalesce(p.slug, comp.slug, 'org-' || left(c.id::text, 8)),
    case c.status
      when 'active' then 'active'
      when 'trial' then 'trial'
      when 'paused' then 'suspended'
      when 'cancelled' then 'archived'
      else 'inactive'
    end,
    case coalesce(sub.plan_type, 'starter')
      when 'growth' then 'business'
      when 'business' then 'business'
      when 'enterprise' then 'enterprise'
      else 'starter'
    end,
    coalesce(p.default_language, c.language, 'en'),
    coalesce(p.timezone, 'Europe/Oslo')
  into v_name, v_slug, v_status, v_plan, v_lang, v_tz
  from public.customers c
  left join public.aipify_tenant_profiles p on p.tenant_id = c.id
  left join public.companies comp on comp.id = c.company_id
  left join public.subscriptions sub on sub.customer_id = c.id
  where c.id = p_customer_id;

  if v_name is null then return null; end if;

  insert into public.organizations (
    id, name, slug, status, subscription_plan, default_language, fallback_language, timezone
  ) values (
    p_customer_id, v_name, v_slug, v_status, v_plan, v_lang, 'en', v_tz
  )
  on conflict (id) do update set
    name = excluded.name,
    slug = excluded.slug,
    status = excluded.status,
    subscription_plan = excluded.subscription_plan,
    default_language = excluded.default_language,
    timezone = excluded.timezone,
    updated_at = now()
  returning * into v_org;

  return v_org;
end; $$;

create or replace function public._mta_seed_organization_modules(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_modules (organization_id, module_key, enabled, plan_required)
  select p_organization_id, v.key, v.enabled, v.plan
  from (values
    ('admin_assistant', true, 'starter'),
    ('support_ai', true, 'starter'),
    ('knowledge_center', true, 'starter'),
    ('audit_log', true, 'starter'),
    ('integrations', true, 'starter'),
    ('moderation_ai', false, 'professional'),
    ('commerce_ai', false, 'business'),
    ('marketing_ai', false, 'business'),
    ('analytics_ai', false, 'business'),
    ('strategic_intelligence', false, 'enterprise'),
    ('operations_center', false, 'enterprise')
  ) as v(key, enabled, plan)
  on conflict (organization_id, module_key) do nothing;
end; $$;

create or replace function public._mta_seed_organization_settings(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
declare v_org public.organizations;
begin
  select * into v_org from public.organizations where id = p_organization_id;
  insert into public.organization_settings (organization_id, setting_key, setting_value)
  select p_organization_id, v.key, v.val
  from (values
    ('default_language', to_jsonb(v_org.default_language)),
    ('fallback_language', to_jsonb(v_org.fallback_language)),
    ('approval_policy', '"human_required_for_medium_high"'::jsonb),
    ('ai_autonomy_level', '"low_risk_only"'::jsonb),
    ('notification_preferences', '{"email": true, "in_app": true}'::jsonb),
    ('support_response_mode', '"draft_with_approval"'::jsonb),
    ('timezone', to_jsonb(v_org.timezone)),
    ('brand_voice', '"professional"'::jsonb),
    ('escalation_email', 'null'::jsonb)
  ) as v(key, val)
  on conflict (organization_id, setting_key) do nothing;
end; $$;

create or replace function public._mta_seed_organization_integrations(p_organization_id uuid, p_slug text)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_integrations (organization_id, integration_type, name, status, configuration)
  select p_organization_id, v.type, v.name, v.status, v.config
  from (values
    ('knowledge_center', 'Knowledge Center', 'connected', '{}'::jsonb),
    ('email', 'Email Providers', 'connected', '{}'::jsonb)
  ) as v(type, name, status, config)
  on conflict (organization_id, integration_type) do nothing;

  if p_slug = 'unonight' then
    insert into public.organization_integrations (organization_id, integration_type, name, status, configuration, last_sync_at)
    values (p_organization_id, 'unonight', 'Unonight Pilot', 'connected', '{"pilot": true}'::jsonb, now())
    on conflict (organization_id, integration_type) do update set
      status = 'connected', last_sync_at = now(), updated_at = now();
  end if;
end; $$;

create or replace function public._mta_backfill_memberships(p_organization_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.organization_users (organization_id, user_id, role, status, joined_at)
  select
    p_organization_id,
    u.id,
    public._mta_map_user_role(u.role),
    'active',
    coalesce(u.created_at, now())
  from public.users u
  join public.customers c on c.company_id = u.company_id
  where c.id = p_organization_id
  on conflict (organization_id, user_id) do update set
    role = excluded.role,
    status = case when organization_users.status = 'removed' then organization_users.status else 'active' end,
    updated_at = now();
end; $$;

create or replace function public._mta_provision_organization(
  p_name text,
  p_slug text,
  p_subscription_plan text default 'internal',
  p_status text default 'active',
  p_contact_email text default null
)
returns uuid language plpgsql security definer set search_path = public as $$
declare
  v_result jsonb;
  v_org_id uuid;
  v_org public.organizations;
begin
  v_result := public.provision_pilot_tenant(jsonb_build_object(
    'name', p_name,
    'slug', p_slug,
    'company_slug', p_slug,
    'tenant_type', case when p_subscription_plan = 'internal' then 'internal' else 'pilot_customer' end,
    'plan_type', case p_subscription_plan
      when 'internal' then 'enterprise'
      when 'enterprise' then 'enterprise'
      when 'professional' then 'business'
      when 'business' then 'business'
      else 'starter'
    end,
    'plan_name', initcap(p_subscription_plan),
    'contact_email', coalesce(p_contact_email, 'admin@' || p_slug || '.com'),
    'pilot_status', case when p_slug = 'unonight' then 'pilot_active' else 'active' end,
    'modules', jsonb_build_array(
      jsonb_build_object('module_key', 'admin_assistant', 'enabled', true),
      jsonb_build_object('module_key', 'support_ai', 'enabled', true),
      jsonb_build_object('module_key', 'knowledge_center', 'enabled', true),
      jsonb_build_object('module_key', 'audit_log', 'enabled', true),
      jsonb_build_object('module_key', 'integrations', 'enabled', true)
    )
  ));

  v_org_id := (v_result->>'tenant_id')::uuid;
  v_org := public._mta_sync_organization_from_customer(v_org_id);
  update public.organizations set
    subscription_plan = p_subscription_plan,
    status = p_status,
    name = p_name,
    slug = p_slug,
    updated_at = now()
  where id = v_org_id;

  perform public._mta_seed_organization_modules(v_org_id);
  perform public._mta_seed_organization_settings(v_org_id);
  perform public._mta_seed_organization_integrations(v_org_id, p_slug);
  perform public._mta_backfill_memberships(v_org_id);

  perform public._mta_create_audit_log(v_org_id, 'organization_provisioned', 'organization', v_org_id, false, false, null,
    jsonb_build_object('slug', p_slug, 'plan', p_subscription_plan));

  return v_org_id;
exception
  when others then
    select c.id into v_org_id from public.customers c
    where c.slug = p_slug
    limit 1;
    if v_org_id is null then
      select c.id into v_org_id from public.customers c
      join public.aipify_tenant_profiles p on p.tenant_id = c.id
      where p.slug = p_slug limit 1;
    end if;
    if v_org_id is not null then
      v_org := public._mta_sync_organization_from_customer(v_org_id);
      update public.organizations set subscription_plan = p_subscription_plan, status = p_status, name = p_name, slug = p_slug where id = v_org_id;
      perform public._mta_seed_organization_modules(v_org_id);
      perform public._mta_seed_organization_settings(v_org_id);
      perform public._mta_seed_organization_integrations(v_org_id, p_slug);
      perform public._mta_backfill_memberships(v_org_id);
      return v_org_id;
    end if;
    raise;
end; $$;

-- Backfill all existing customers as organizations
do $$
declare v_customer_id uuid;
begin
  for v_customer_id in select id from public.customers loop
    perform public._mta_sync_organization_from_customer(v_customer_id);
    perform public._mta_seed_organization_modules(v_customer_id);
    perform public._mta_seed_organization_settings(v_customer_id);
    perform public._mta_backfill_memberships(v_customer_id);
  end loop;
end $$;

-- Seed Aipify Group AS and Unonight pilot tenants (migration-safe — sync existing customers)
do $$
declare
  v_rec record;
  v_org_id uuid;
begin
  for v_rec in
    select *
    from (values
      ('Aipify Group AS', 'aipify-group', 'internal', 'active', 'team@aipify.com'),
      ('Unonight', 'unonight', 'internal', 'active', 'pilot@unonight.com')
    ) as v(name, slug, subscription_plan, status, contact_email)
  loop
    v_org_id := null;
    select c.id into v_org_id from public.customers c where c.slug = v_rec.slug limit 1;
    if v_org_id is null then
      select c.id into v_org_id
      from public.customers c
      join public.aipify_tenant_profiles p on p.tenant_id = c.id
      where p.slug = v_rec.slug
      limit 1;
    end if;
    if v_org_id is not null then
      perform public._mta_sync_organization_from_customer(v_org_id);
      update public.organizations set
        subscription_plan = v_rec.subscription_plan,
        status = v_rec.status,
        name = v_rec.name,
        slug = v_rec.slug,
        updated_at = now()
      where id = v_org_id;
      perform public._mta_seed_organization_modules(v_org_id);
      perform public._mta_seed_organization_settings(v_org_id);
      perform public._mta_seed_organization_integrations(v_org_id, v_rec.slug);
      perform public._mta_backfill_memberships(v_org_id);
    end if;
  end loop;
end $$;

-- Fix Phase A unonight slug reference
create or replace function public._acp_seed_core_data(p_tenant_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.tenant_core_modules (tenant_id, module_key, module_label, module_category, enabled)
  select p_tenant_id, v.key, v.label, v.cat, v.enabled
  from (values
    ('executive_dashboard', 'Executive Dashboard', 'core', true),
    ('presence_center', 'Presence Center', 'core', true),
    ('support_ai_basic', 'Support AI', 'initial', true),
    ('assistant', 'Admin Assistant', 'initial', true),
    ('knowledge_base', 'Knowledge Center', 'core', true),
    ('install_management', 'Install Management', 'core', true),
    ('recommendations', 'Recommendations', 'core', true),
    ('health_monitoring', 'Health Monitoring', 'core', true),
    ('marketing_ai', 'Marketing AI', 'future', false),
    ('commerce_ai', 'Commerce AI', 'future', false),
    ('moderation_ai', 'Moderation AI', 'future', false),
    ('strategic_intelligence', 'Strategic Intelligence', 'future', false)
  ) as v(key, label, cat, enabled)
  where not exists (select 1 from public.tenant_core_modules m where m.tenant_id = p_tenant_id and m.module_key = v.key);

  insert into public.ai_action_registry (tenant_id, action_key, action_label, risk_level, auto_execute_allowed, requires_approval, example)
  select p_tenant_id, v.key, v.label, v.risk, v.auto, v.approval, v.example
  from (values
    ('faq_response', 'FAQ Response', 'low', true, false, 'Automated FAQ responses from approved knowledge.'),
    ('internal_recommendation', 'Internal Recommendation', 'low', true, false, 'Surface internal recommendations without external impact.'),
    ('email_draft', 'Email Draft Generation', 'medium', false, true, 'AI drafts email — human sends.'),
    ('workflow_suggestion', 'Workflow Update Suggestion', 'medium', false, true, 'Suggested workflow changes require review.'),
    ('billing_change', 'Billing Change', 'high', false, true, 'Billing modifications require administrator approval.'),
    ('user_removal', 'User Removal', 'high', false, true, 'Removing users requires explicit approval.'),
    ('irreversible_modification', 'Irreversible Modification', 'critical', false, true, 'Critical irreversible changes always require approval.')
  ) as v(key, label, risk, auto, approval, example)
  where not exists (select 1 from public.ai_action_registry a where a.tenant_id = p_tenant_id and a.action_key = v.key);

  insert into public.core_integration_registry (tenant_id, integration_key, integration_label, status, integration_type, last_synced_at)
  select p_tenant_id, v.key, v.label, v.status, v.type, now() - interval '1 hour'
  from (values
    ('unonight', 'Unonight Pilot', 'connected', 'current'),
    ('email_providers', 'Email Providers', 'connected', 'current'),
    ('knowledge_center', 'Knowledge Center', 'connected', 'current'),
    ('shopify', 'Shopify', 'pending', 'future'),
    ('woocommerce', 'WooCommerce', 'pending', 'future'),
    ('wordpress', 'WordPress', 'pending', 'future'),
    ('crm_systems', 'CRM Systems', 'disconnected', 'future')
  ) as v(key, label, status, type)
  where not exists (select 1 from public.core_integration_registry i where i.tenant_id = p_tenant_id and i.integration_key = v.key);

  insert into public.core_api_key_registry (tenant_id, key_label, key_prefix, scopes, rate_limit_per_minute)
  select p_tenant_id, v.label, v.prefix, v.scopes, v.rate_limit
  from (values
    ('Production API', 'aip_live_', '["read","write"]'::jsonb, 120),
    ('Integration Webhook', 'aip_hook_', '["webhooks"]'::jsonb, 60)
  ) as v(label, prefix, scopes, rate_limit)
  where not exists (select 1 from public.core_api_key_registry k where k.tenant_id = p_tenant_id limit 1);

  insert into public.core_platform_component_status (tenant_id, component_key, status, summary, health_score)
  select p_tenant_id, v.key, v.status, v.summary, v.score
  from (values
    ('multi_tenant', 'active', 'Organization isolation, tenant settings and data separation enforced via RLS.', 98.0),
    ('authentication', 'active', 'Secure login, password reset, email verification and session management active.', 96.0),
    ('permissions', 'active', 'Granular module-level permissions and approval workflows enabled.', 94.0),
    ('audit_logging', 'active', 'Immutable audit history capturing user, AI and approval actions.', 97.0),
    ('ai_actions', 'active', 'AI actions categorized by risk — low may auto-execute; medium/high require approval.', 95.0),
    ('modules', 'active', 'Plug-and-play modules with per-tenant activation controls.', 93.0),
    ('api_layer', 'active', 'Tenant-aware API endpoints with rate limiting and logging.', 92.0),
    ('integrations', 'active', 'Unonight pilot connected; email and Knowledge Center integrated.', 90.0),
    ('knowledge_center', 'active', 'Structured articles, FAQs and AI retrieval support available.', 96.0),
    ('dashboard', 'active', 'Operational dashboard widgets providing immediate visibility.', 94.0)
  ) as v(key, status, summary, score)
  where not exists (select 1 from public.core_platform_component_status c where c.tenant_id = p_tenant_id and c.component_key = v.key);

  insert into public.core_dashboard_widgets (tenant_id, widget_key, title, summary, count_value, priority)
  select p_tenant_id, v.key, v.title, v.summary, v.count, v.priority
  from (values
    ('since_last_login', 'Since Last Login', '3 operational improvements completed. 1 recommendation awaiting approval.', 3, 'moderate'),
    ('pending_tasks', 'Pending Tasks', '2 approval requests and 1 support escalation pending.', 3, 'important'),
    ('active_alerts', 'Active Alerts', '1 delivery risk indicator and 1 quality warning active.', 2, 'moderate'),
    ('support_overview', 'Support Overview', '12 tickets resolved this week. Average response time stable.', 12, 'informational'),
    ('recommended_actions', 'Recommended Actions', '4 AI recommendations ready for review — none auto-executed.', 4, 'moderate')
  ) as v(key, title, summary, count, priority)
  where not exists (select 1 from public.core_dashboard_widgets w where w.tenant_id = p_tenant_id and w.widget_key = v.key);

  update public.aipify_core_platform_settings
  set unonight_pilot_mode = true
  where tenant_id = p_tenant_id
    and exists (
      select 1 from public.aipify_tenant_profiles p
      where p.tenant_id = p_tenant_id and p.slug = 'unonight'
    );
end; $$;

-- ---------------------------------------------------------------------------
-- 10. Public RPCs
-- ---------------------------------------------------------------------------
create or replace function public.get_user_organizations()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_user_id uuid;
begin
  v_user_id := public._mta_app_user_id();
  if v_user_id is null then return '[]'::jsonb; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'id', o.id,
      'name', o.name,
      'slug', o.slug,
      'status', o.status,
      'subscription_plan', o.subscription_plan,
      'role', ou.role,
      'membership_status', ou.status
    ) order by o.name)
    from public.organization_users ou
    join public.organizations o on o.id = ou.organization_id
    where ou.user_id = v_user_id and ou.status = 'active'
  ), '[]'::jsonb);
end; $$;

create or replace function public.get_current_organization()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_membership public.organization_users;
  v_org public.organizations;
begin
  v_org_id := public._mta_require_organization();
  select * into v_org from public.organizations where id = v_org_id;
  v_membership := public._mta_membership_active(v_org_id);
  return jsonb_build_object(
    'id', v_org.id,
    'name', v_org.name,
    'slug', v_org.slug,
    'status', v_org.status,
    'subscription_plan', v_org.subscription_plan,
    'default_language', v_org.default_language,
    'timezone', v_org.timezone,
    'role', v_membership.role,
    'membership_status', v_membership.status
  );
exception when others then
  return jsonb_build_object('error', sqlerrm);
end; $$;

create or replace function public.switch_organization(p_organization_id uuid)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_membership public.organization_users;
begin
  v_org_id := public._mta_require_organization(p_organization_id);
  v_membership := public._mta_membership_active(v_org_id);
  perform public._mta_create_audit_log(v_org_id, 'organization_switched', 'organization', v_org_id);
  return jsonb_build_object(
    'status', 'ok',
    'organization_id', v_org_id,
    'role', v_membership.role
  );
end; $$;

create or replace function public.toggle_organization_module(p_module_key text, p_enabled boolean default true)
returns jsonb language plpgsql security definer set search_path = public as $$
declare v_org_id uuid;
begin
  perform public._mta_require_role('module_management');
  v_org_id := public._mta_require_organization();
  update public.organization_modules set enabled = p_enabled, updated_at = now()
  where organization_id = v_org_id and module_key = p_module_key;
  perform public._mta_create_audit_log(
    v_org_id,
    case when p_enabled then 'module_enabled' else 'module_disabled' end,
    'module', null, false, true, 'approved',
    jsonb_build_object('module_key', p_module_key)
  );
  return jsonb_build_object('status', 'ok', 'module_key', p_module_key, 'enabled', p_enabled);
end; $$;

create or replace function public.get_multi_tenant_architecture_dashboard()
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_org_id uuid;
  v_membership public.organization_users;
  v_org public.organizations;
  v_modules_enabled int;
  v_pending_tasks int;
  v_active_alerts int;
begin
  v_org_id := public._mta_require_organization();
  select * into v_org from public.organizations where id = v_org_id;
  v_membership := public._mta_membership_active(v_org_id);

  select count(*) into v_modules_enabled
  from public.organization_modules where organization_id = v_org_id and enabled = true;

  select coalesce((w.count_value)::int, 0) into v_pending_tasks
  from public.core_dashboard_widgets w
  where w.tenant_id = v_org_id and w.widget_key = 'pending_tasks' limit 1;

  select coalesce((w.count_value)::int, 0) into v_active_alerts
  from public.core_dashboard_widgets w
  where w.tenant_id = v_org_id and w.widget_key = 'active_alerts' limit 1;

  return jsonb_build_object(
    'has_organization', true,
    'philosophy', 'Aipify serves many organizations from one platform — each tenant''s data stays isolated and secure.',
    'safety_note', 'Never allow cross-tenant access. Medium and high-risk AI actions require human approval.',
    'organization', jsonb_build_object(
      'id', v_org.id, 'name', v_org.name, 'slug', v_org.slug,
      'status', v_org.status, 'subscription_plan', v_org.subscription_plan,
      'default_language', v_org.default_language, 'timezone', v_org.timezone,
      'is_unonight_pilot', v_org.slug = 'unonight',
      'is_internal', v_org.slug = 'aipify-group'
    ),
    'current_role', v_membership.role,
    'modules_enabled', v_modules_enabled,
    'pending_tasks', coalesce(v_pending_tasks, 0),
    'active_alerts', coalesce(v_active_alerts, 0),
    'available_organizations', public.get_user_organizations(),
    'enabled_modules', coalesce((
      select jsonb_agg(jsonb_build_object(
        'module_key', m.module_key, 'enabled', m.enabled, 'plan_required', m.plan_required
      ) order by m.module_key)
      from public.organization_modules m where m.organization_id = v_org_id
    ), '[]'::jsonb),
    'integrations', coalesce((
      select jsonb_agg(jsonb_build_object(
        'integration_type', i.integration_type, 'name', i.name,
        'status', i.status, 'last_sync_at', i.last_sync_at
      ) order by i.integration_type)
      from public.organization_integrations i where i.organization_id = v_org_id
    ), '[]'::jsonb),
    'knowledge_center', jsonb_build_object(
      'faq_count', (select count(*) from public.knowledge_faq_items k where k.organization_id = v_org_id and k.status = 'published'),
      'article_count', (select count(*) from public.aipify_knowledge_articles a where a.tenant_id = v_org_id and a.status = 'published'),
      'status', case when exists (
        select 1 from public.organization_modules m
        where m.organization_id = v_org_id and m.module_key = 'knowledge_center' and m.enabled
      ) then 'active' else 'inactive' end
    ),
    'recent_audit_events', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', l.id, 'action_type', l.action_type, 'entity_type', l.entity_type,
        'actor_role', l.actor_role, 'ai_involved', l.ai_involved,
        'approval_status', l.approval_status, 'created_at', l.created_at
      ) order by l.created_at desc)
      from public.organization_audit_logs l where l.organization_id = v_org_id limit 10
    ), '[]'::jsonb),
    'role_permissions', jsonb_build_object(
      'billing', public._mta_role_permission(v_membership.role, 'billing'),
      'user_management', public._mta_role_permission(v_membership.role, 'user_management'),
      'module_management', public._mta_role_permission(v_membership.role, 'module_management'),
      'integration_management', public._mta_role_permission(v_membership.role, 'integration_management'),
      'audit_log_access', public._mta_role_permission(v_membership.role, 'audit_log_access'),
      'approve_ai_actions', public._mta_role_permission(v_membership.role, 'approve_ai_actions')
    ),
    'isolation_checks', jsonb_build_array(
      'All tenant-owned tables scoped by organization_id',
      'RLS enabled — direct table access revoked',
      'RPCs validate membership on every request',
      'Session stores selected organization context'
    )
  );
end; $$;

create or replace function public.get_multi_tenant_architecture_card()
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare v_org_id uuid;
begin
  v_org_id := public._mta_require_organization();
  return jsonb_build_object(
    'has_organization', true,
    'organization_name', (select name from public.organizations where id = v_org_id),
    'modules_enabled', (select count(*) from public.organization_modules where organization_id = v_org_id and enabled),
    'philosophy', 'Multi-tenant SaaS — secure isolation for every customer organization.'
  );
exception when others then
  return jsonb_build_object('has_organization', false);
end; $$;

-- ---------------------------------------------------------------------------
-- 11. Knowledge Center category + FAQ seed
-- ---------------------------------------------------------------------------
insert into public.aipify_knowledge_categories (slug, name, description, visibility, sort_order)
select 'multi-tenant-architecture', 'Multi-Tenant Architecture', 'Organization isolation, tenant context, roles and module activation.', 'authenticated', 51
where not exists (select 1 from public.aipify_knowledge_categories where slug = 'multi-tenant-architecture' and tenant_id is null);

-- ---------------------------------------------------------------------------
-- 12. Grants
-- ---------------------------------------------------------------------------
grant execute on function public.get_user_organizations() to authenticated;
grant execute on function public.get_current_organization() to authenticated;
grant execute on function public.switch_organization(uuid) to authenticated;
grant execute on function public.toggle_organization_module(text, boolean) to authenticated;
grant execute on function public.get_multi_tenant_architecture_dashboard() to authenticated;
grant execute on function public.get_multi_tenant_architecture_card() to authenticated;
