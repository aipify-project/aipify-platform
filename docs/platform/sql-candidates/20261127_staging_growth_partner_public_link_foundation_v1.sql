-- =============================================================================
-- PREPARED_ONLY — Growth Partner Staging public link foundation (MINIMAL)
-- Target intended: aipify-core-staging (auedugihkduoaikfusqe) only.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
-- Production qbcqoixhrvhnuwphefvw must not be targeted.
--
-- Creates empty Production link and attribution tables:
--   growth_partner_tracking_links
--   growth_partner_tracking_link_aliases
--   growth_partner_attribution_touches
--   growth_partner_attributed_customers
--   growth_partner_link_audit
-- Adds nullable organization attribution columns. It does not update organization rows.
--
-- _gp455a_resolve_slug, _gp455a_base_url, _gp455a_build_partner_url, and
-- _gp455a_log_link keep the live Production bodies.
-- resolve_growth_partner_public_link and capture_growth_partner_attribution keep
-- the Production result shape and add one gate: partner_status must be certified
-- and the link must be active. Unknown, disabled, inactive, suspended, and
-- certification_required slugs return found/ok false and write nothing.
-- apply_growth_partner_attribution_to_organization has the same gate and is not
-- granted to anon or authenticated.
--
-- Does not create sellers, links, template rows, or signup. Does not change
-- csp_sales_products, permission tables, commission rules, or payment rules.
-- Historical migration 20261845510000 is not applied.
--
-- Manual rollback, only while the five new tables are empty:
--   drop function if exists public.apply_growth_partner_attribution_to_organization(uuid, text, text, text);
--   drop function if exists public.capture_growth_partner_attribution(jsonb);
--   drop function if exists public.resolve_growth_partner_public_link(text);
--   drop function if exists public._gp455a_resolve_slug(text);
--   drop function if exists public._gp455a_log_link(uuid, text, text, jsonb);
--   drop function if exists public._gp455a_build_partner_url(text, text, text);
--   drop function if exists public._gp455a_base_url();
--   drop table if exists public.growth_partner_attributed_customers;
--   drop table if exists public.growth_partner_attribution_touches;
--   drop table if exists public.growth_partner_tracking_link_aliases;
--   drop table if exists public.growth_partner_link_audit;
--   drop table if exists public.growth_partner_tracking_links;
--   alter table public.organizations drop constraint if exists organizations_attributed_growth_partner_profile_id_fkey;
--   alter table public.organizations drop column if exists attributed_growth_partner_profile_id;
--   alter table public.organizations drop column if exists attributed_growth_partner_public_id;
-- =============================================================================

do $$
begin
  if to_regclass('public.growth_partner_app_profiles') is null
     or to_regclass('public.organizations') is null
     or to_regclass('public.csp_sales_products') is null
     or to_regclass('public.aipify_permissions') is null
     or to_regprocedure('auth.uid()') is null then
    raise exception 'prerequisite missing for public link foundation';
  end if;
  if not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'growth_partner_app_profiles'
      and column_name in ('partner_status', 'partner_public_id', 'primary_link_slug')
    having count(*) = 3
  ) or not exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'organizations'
      and column_name in ('name', 'updated_at')
    having count(*) = 2
  ) then
    raise exception 'prerequisite columns missing for public link foundation';
  end if;
  if (
    select count(*) from pg_roles
    where rolname in ('anon', 'authenticated', 'service_role')
  ) <> 3 then
    raise exception 'prerequisite missing: roles anon, authenticated, service_role';
  end if;
end
$$;

drop table if exists gp_link_foundation_guard;
create temporary table gp_link_foundation_guard (
  orgs bigint,
  profiles bigint,
  products bigint,
  perms bigint,
  role_perms bigint,
  user_perms bigint,
  modules bigint,
  attributed_orgs bigint
);
do $$
declare
  v_attributed bigint := 0;
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public'
      and table_name = 'organizations'
      and column_name = 'attributed_growth_partner_profile_id'
  ) then
    execute 'select count(*) from public.organizations where attributed_growth_partner_profile_id is not null'
      into v_attributed;
  end if;
  insert into gp_link_foundation_guard
  select
    (select count(*) from public.organizations),
    (select count(*) from public.growth_partner_app_profiles),
    (select count(*) from public.csp_sales_products),
    (select count(*) from public.aipify_permissions),
    (select count(*) from public.organization_role_permissions),
    (select count(*) from public.organization_user_permissions),
    (select count(*) from public.organization_modules),
    v_attributed;
end
$$;

create table if not exists public.growth_partner_tracking_links (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  partner_public_id text not null,
  slug text not null,
  link_status text not null default 'active' check (link_status in ('active', 'disabled')),
  is_primary boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (slug)
);

create index if not exists growth_partner_tracking_links_profile_idx
  on public.growth_partner_tracking_links (profile_id, is_primary desc);

create table if not exists public.growth_partner_tracking_link_aliases (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  alias_slug text not null unique,
  target_link_id uuid not null references public.growth_partner_tracking_links (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.growth_partner_attribution_touches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  partner_public_id text not null,
  partner_slug text not null,
  session_key text not null default '',
  campaign_id text not null default '',
  utm_source text not null default '',
  utm_medium text not null default '',
  utm_campaign text not null default '',
  landing_page text not null default '',
  referrer text not null default '',
  destination_key text not null default 'home',
  first_touch_at timestamptz not null default now(),
  last_touch_at timestamptz not null default now(),
  metadata jsonb not null default '{}'::jsonb
);

create index if not exists growth_partner_attribution_touches_profile_idx
  on public.growth_partner_attribution_touches (profile_id, last_touch_at desc);

create index if not exists growth_partner_attribution_touches_session_idx
  on public.growth_partner_attribution_touches (session_key, last_touch_at desc);

create table if not exists public.growth_partner_attributed_customers (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.growth_partner_app_profiles (id) on delete cascade,
  partner_public_id text not null,
  organization_id uuid references public.organizations (id) on delete set null,
  customer_name text not null default '',
  plan_label text not null default '',
  attribution_status text not null default 'lead_captured' check (
    attribution_status in (
      'lead_captured', 'demo_booked', 'customer_activated', 'subscription_active',
      'commission_pending', 'commission_approved', 'commission_paid', 'not_eligible'
    )
  ),
  status_key text not null default 'waiting',
  first_touch_at timestamptz,
  activated_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (profile_id, organization_id)
);

create index if not exists growth_partner_attributed_customers_profile_idx
  on public.growth_partner_attributed_customers (profile_id, attribution_status);

create table if not exists public.growth_partner_link_audit (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.growth_partner_app_profiles (id) on delete set null,
  event_type text not null,
  summary text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  actor_auth_user_id uuid,
  created_at timestamptz not null default now()
);

create index if not exists growth_partner_link_audit_profile_idx
  on public.growth_partner_link_audit (profile_id, created_at desc);

alter table public.organizations
  add column if not exists attributed_growth_partner_profile_id uuid,
  add column if not exists attributed_growth_partner_public_id text;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'organizations_attributed_growth_partner_profile_id_fkey'
      and conrelid = 'public.organizations'::regclass
  ) then
    alter table public.organizations
      add constraint organizations_attributed_growth_partner_profile_id_fkey
      foreign key (attributed_growth_partner_profile_id)
      references public.growth_partner_app_profiles (id) on delete set null;
  end if;
end
$$;

alter table public.growth_partner_tracking_links enable row level security;
alter table public.growth_partner_tracking_link_aliases enable row level security;
alter table public.growth_partner_attribution_touches enable row level security;
alter table public.growth_partner_attributed_customers enable row level security;
alter table public.growth_partner_link_audit enable row level security;

revoke all on table public.growth_partner_tracking_links from public, anon, authenticated;
revoke all on table public.growth_partner_tracking_link_aliases from public, anon, authenticated;
revoke all on table public.growth_partner_attribution_touches from public, anon, authenticated;
revoke all on table public.growth_partner_attributed_customers from public, anon, authenticated;
revoke all on table public.growth_partner_link_audit from public, anon, authenticated;
grant all on table public.growth_partner_tracking_links to service_role;
grant all on table public.growth_partner_tracking_link_aliases to service_role;
grant all on table public.growth_partner_attribution_touches to service_role;
grant all on table public.growth_partner_attributed_customers to service_role;
grant all on table public.growth_partner_link_audit to service_role;

create or replace function public._gp455a_base_url()
returns text language sql stable as $$
  select coalesce(nullif(current_setting('app.growth_partner_base_url', true), ''), 'https://aipify.ai');
$$;

create or replace function public._gp455a_build_partner_url(p_slug text, p_to text default null, p_pack text default null)
returns text language plpgsql immutable set search_path = public as $$
declare v_url text;
begin
  v_url := public._gp455a_base_url() || '/p/' || p_slug;
  if coalesce(p_to, '') <> '' then
    v_url := v_url || '?to=' || p_to;
    if coalesce(p_pack, '') <> '' then
      v_url := v_url || '&pack=' || p_pack;
    end if;
  elsif coalesce(p_pack, '') <> '' then
    v_url := v_url || '?pack=' || p_pack;
  end if;
  return v_url;
end; $$;

create or replace function public._gp455a_log_link(
  p_profile_id uuid, p_event_type text, p_summary text, p_metadata jsonb default '{}'::jsonb
) returns void language plpgsql security definer set search_path = public as $$
begin
  insert into public.growth_partner_link_audit (profile_id, event_type, summary, metadata, actor_auth_user_id)
  values (p_profile_id, p_event_type, left(p_summary, 500), coalesce(p_metadata, '{}'::jsonb), auth.uid());
end; $$;

create or replace function public._gp455a_resolve_slug(p_slug text)
returns table (
  profile_id uuid,
  partner_public_id text,
  slug text,
  link_id uuid,
  link_status text,
  full_name text,
  company_name text
) language plpgsql stable security definer set search_path = public as $$
declare
  v_slug text := lower(trim(coalesce(p_slug, '')));
  v_rec record;
begin
  if v_slug = '' then return; end if;

  select l.profile_id, l.partner_public_id, l.slug, l.id as link_id, l.link_status, p.full_name, p.company_name
  into v_rec
  from public.growth_partner_tracking_links l
  join public.growth_partner_app_profiles p on p.id = l.profile_id
  where l.slug = v_slug
  limit 1;

  if v_rec.profile_id is not null then
    return query select v_rec.profile_id, v_rec.partner_public_id, v_rec.slug, v_rec.link_id, v_rec.link_status, v_rec.full_name, v_rec.company_name;
    return;
  end if;

  return query
  select l.profile_id, l.partner_public_id, l.slug, l.id, l.link_status, p.full_name, p.company_name
  from public.growth_partner_tracking_link_aliases a
  join public.growth_partner_tracking_links l on l.id = a.target_link_id
  join public.growth_partner_app_profiles p on p.id = l.profile_id
  where a.alias_slug = v_slug
  limit 1;
end; $$;

create or replace function public.resolve_growth_partner_public_link(p_slug text)
returns jsonb language plpgsql stable security definer set search_path = public as $$
declare
  v_row record;
  v_partner_status text;
begin
  select * into v_row from public._gp455a_resolve_slug(p_slug) limit 1;
  if v_row.profile_id is null then
    return jsonb_build_object('found', false, 'error', 'Partner link not found');
  end if;
  select p.partner_status into v_partner_status
  from public.growth_partner_app_profiles p
  where p.id = v_row.profile_id;
  if v_partner_status is distinct from 'certified' then
    return jsonb_build_object('found', false, 'error', 'Partner link not found');
  end if;
  if v_row.link_status <> 'active' then
    return jsonb_build_object('found', false, 'error', 'Partner link disabled');
  end if;
  return jsonb_build_object(
    'found', true,
    'profile_id', v_row.profile_id,
    'partner_public_id', v_row.partner_public_id,
    'slug', v_row.slug,
    'partner_name', v_row.full_name,
    'partner_company', v_row.company_name,
    'partner_url', public._gp455a_build_partner_url(v_row.slug)
  );
end; $$;

create or replace function public.capture_growth_partner_attribution(p_payload jsonb)
returns jsonb language plpgsql security definer set search_path = public as $$
declare
  v_slug text := lower(trim(coalesce(p_payload->>'partner_slug', '')));
  v_row record;
  v_partner_status text;
  v_session text := coalesce(p_payload->>'session_key', gen_random_uuid()::text);
  v_touch_id uuid;
begin
  select * into v_row from public._gp455a_resolve_slug(v_slug) limit 1;
  if v_row.profile_id is null then
    return jsonb_build_object('ok', false, 'error', 'Invalid partner link');
  end if;
  select p.partner_status into v_partner_status
  from public.growth_partner_app_profiles p
  where p.id = v_row.profile_id;
  if v_partner_status is distinct from 'certified' then
    return jsonb_build_object('ok', false, 'error', 'Invalid partner link');
  end if;
  if v_row.link_status <> 'active' then
    return jsonb_build_object('ok', false, 'error', 'Partner link disabled');
  end if;

  insert into public.growth_partner_attribution_touches (
    profile_id, partner_public_id, partner_slug, session_key,
    campaign_id, utm_source, utm_medium, utm_campaign,
    landing_page, referrer, destination_key, metadata
  ) values (
    v_row.profile_id, v_row.partner_public_id, v_row.slug, v_session,
    coalesce(p_payload->>'campaign_id', ''),
    coalesce(p_payload->>'utm_source', ''), coalesce(p_payload->>'utm_medium', ''),
    coalesce(p_payload->>'utm_campaign', ''),
    coalesce(p_payload->>'landing_page', ''), coalesce(p_payload->>'referrer', ''),
    coalesce(p_payload->>'destination_key', 'home'),
    coalesce(p_payload->'metadata', '{}'::jsonb)
  ) returning id into v_touch_id;

  perform public._gp455a_log_link(
    v_row.profile_id, 'attribution_touch',
    'Visitor attribution captured.',
    jsonb_build_object('touch_id', v_touch_id, 'session_key', v_session, 'destination', p_payload->>'destination_key')
  );

  return jsonb_build_object(
    'ok', true,
    'touch_id', v_touch_id,
    'session_key', v_session,
    'partner_public_id', v_row.partner_public_id,
    'partner_slug', v_row.slug,
    'profile_id', v_row.profile_id
  );
end; $$;

create or replace function public.apply_growth_partner_attribution_to_organization(
  p_organization_id uuid,
  p_partner_public_id text,
  p_partner_slug text default null,
  p_session_key text default null
) returns jsonb language plpgsql security definer set search_path = public as $$
declare v_profile_id uuid;
begin
  if coalesce(p_partner_public_id, '') = '' then
    return jsonb_build_object('ok', false, 'error', 'No partner attribution');
  end if;

  select p.id into v_profile_id
  from public.growth_partner_app_profiles p
  join public.growth_partner_tracking_links l
    on l.profile_id = p.id
   and l.is_primary
   and l.link_status = 'active'
  where p.partner_public_id = p_partner_public_id
    and p.partner_status = 'certified'
  limit 1;

  if v_profile_id is null then
    return jsonb_build_object('ok', false, 'error', 'Partner link not found');
  end if;

  update public.organizations set
    attributed_growth_partner_profile_id = v_profile_id,
    attributed_growth_partner_public_id = p_partner_public_id,
    updated_at = now()
  where id = p_organization_id;

  insert into public.growth_partner_attributed_customers (
    profile_id, partner_public_id, organization_id, customer_name, attribution_status, status_key, first_touch_at
  )
  select v_profile_id, p_partner_public_id, p_organization_id, o.name, 'customer_activated', 'verified', now()
  from public.organizations o where o.id = p_organization_id
  on conflict (profile_id, organization_id) do update set
    attribution_status = excluded.attribution_status,
    status_key = excluded.status_key,
    updated_at = now();

  perform public._gp455a_log_link(
    v_profile_id, 'customer_attributed',
    'Customer organization attributed to Growth Partner.',
    jsonb_build_object('organization_id', p_organization_id, 'session_key', p_session_key, 'slug', p_partner_slug)
  );

  return jsonb_build_object('ok', true, 'profile_id', v_profile_id, 'organization_id', p_organization_id);
end; $$;

revoke all on function public._gp455a_base_url() from public, anon, authenticated;
revoke all on function public._gp455a_build_partner_url(text, text, text) from public, anon, authenticated;
revoke all on function public._gp455a_log_link(uuid, text, text, jsonb) from public, anon, authenticated;
revoke all on function public._gp455a_resolve_slug(text) from public, anon, authenticated;
revoke all on function public.resolve_growth_partner_public_link(text) from public;
revoke all on function public.capture_growth_partner_attribution(jsonb) from public;
revoke all on function public.apply_growth_partner_attribution_to_organization(uuid, text, text, text) from public, anon, authenticated;

grant execute on function public._gp455a_base_url() to service_role;
grant execute on function public._gp455a_build_partner_url(text, text, text) to service_role;
grant execute on function public._gp455a_log_link(uuid, text, text, jsonb) to service_role;
grant execute on function public._gp455a_resolve_slug(text) to service_role;
grant execute on function public.resolve_growth_partner_public_link(text) to anon, authenticated, service_role;
grant execute on function public.capture_growth_partner_attribution(jsonb) to anon, authenticated, service_role;
grant execute on function public.apply_growth_partner_attribution_to_organization(uuid, text, text, text) to service_role;

do $$
declare
  v_guard gp_link_foundation_guard%rowtype;
  v_base text;
  v_build text;
  v_log text;
  v_resolve text;
begin
  if (
    select count(*) from pg_attribute
    where attrelid = 'public.growth_partner_tracking_links'::regclass and attnum > 0 and not attisdropped
  ) <> 8
  or (
    select count(*) from pg_attribute
    where attrelid = 'public.growth_partner_tracking_link_aliases'::regclass and attnum > 0 and not attisdropped
  ) <> 5
  or (
    select count(*) from pg_attribute
    where attrelid = 'public.growth_partner_attribution_touches'::regclass and attnum > 0 and not attisdropped
  ) <> 15
  or (
    select count(*) from pg_attribute
    where attrelid = 'public.growth_partner_attributed_customers'::regclass and attnum > 0 and not attisdropped
  ) <> 13
  or (
    select count(*) from pg_attribute
    where attrelid = 'public.growth_partner_link_audit'::regclass and attnum > 0 and not attisdropped
  ) <> 7 then
    raise exception 'link table column counts do not match Production';
  end if;

  if not exists (
    select 1 from pg_constraint
    where conrelid = 'public.growth_partner_tracking_links'::regclass
      and pg_get_constraintdef(oid) = 'CHECK ((link_status = ANY (ARRAY[''active''::text, ''disabled''::text])))'
  ) or not exists (
    select 1 from pg_constraint
    where conrelid = 'public.growth_partner_attributed_customers'::regclass
      and pg_get_constraintdef(oid) = 'CHECK ((attribution_status = ANY (ARRAY[''lead_captured''::text, ''demo_booked''::text, ''customer_activated''::text, ''subscription_active''::text, ''commission_pending''::text, ''commission_approved''::text, ''commission_paid''::text, ''not_eligible''::text])))'
  ) or not exists (
    select 1 from pg_constraint
    where conname = 'organizations_attributed_growth_partner_profile_id_fkey'
      and pg_get_constraintdef(oid) = 'FOREIGN KEY (attributed_growth_partner_profile_id) REFERENCES growth_partner_app_profiles(id) ON DELETE SET NULL'
  ) then
    raise exception 'link constraints do not match Production';
  end if;

  if (
    select count(*)
    from pg_class c
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public'
      and c.relname in (
        'growth_partner_tracking_links',
        'growth_partner_tracking_link_aliases',
        'growth_partner_attribution_touches',
        'growth_partner_attributed_customers',
        'growth_partner_link_audit'
      )
      and c.relrowsecurity
      and not c.relforcerowsecurity
      and (select count(*) from pg_policy p where p.polrelid = c.oid) = 0
      and (select count(*) from pg_trigger t where t.tgrelid = c.oid and not t.tgisinternal) = 0
      and c.relacl::text not like '%anon=%'
      and c.relacl::text not like '%authenticated=%'
      and has_table_privilege('service_role', c.oid, 'select')
      and not has_table_privilege('anon', c.oid, 'select')
  ) <> 5 then
    raise exception 'link RLS or table privileges do not match the candidate';
  end if;

  select md5(p.prosrc) into v_base from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = '_gp455a_base_url';
  select md5(p.prosrc) into v_build from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = '_gp455a_build_partner_url';
  select md5(p.prosrc) into v_log from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = '_gp455a_log_link';
  select md5(p.prosrc) into v_resolve from pg_proc p join pg_namespace n on n.oid = p.pronamespace
  where n.nspname = 'public' and p.proname = '_gp455a_resolve_slug';
  if v_base is distinct from '85d1572bcbd495319047cdaabb10458a'
     or v_build is distinct from 'e713a92b29dfe495c23024fdf2d815d6'
     or v_log is distinct from '97f1bfc2badfeed173bba717ca9524fe'
     or v_resolve is distinct from 'dc9cb282213fe2adf25728cf5acab3a1' then
    raise exception 'link helper body does not match Production';
  end if;

  if has_function_privilege('anon', 'public._gp455a_resolve_slug(text)', 'execute')
     or has_function_privilege('authenticated', 'public._gp455a_resolve_slug(text)', 'execute')
     or has_function_privilege('anon', 'public.apply_growth_partner_attribution_to_organization(uuid,text,text,text)', 'execute')
     or has_function_privilege('authenticated', 'public.apply_growth_partner_attribution_to_organization(uuid,text,text,text)', 'execute')
     or not has_function_privilege('anon', 'public.resolve_growth_partner_public_link(text)', 'execute')
     or not has_function_privilege('authenticated', 'public.capture_growth_partner_attribution(jsonb)', 'execute')
     or not has_function_privilege('service_role', 'public._gp455a_resolve_slug(text)', 'execute') then
    raise exception 'function privileges do not match the candidate';
  end if;

  if to_regprocedure('public.complete_growth_partner_public_signup(jsonb)') is not null
     or to_regclass('public.growth_partner_marketing_template_defs') is not null
     or to_regprocedure('public.provision_growth_partner_tracking_link(uuid)') is not null then
    raise exception 'candidate created signup, templates, or link provisioning';
  end if;

  select * into v_guard from gp_link_foundation_guard;
  if v_guard.orgs is distinct from (select count(*) from public.organizations)
     or v_guard.profiles is distinct from (select count(*) from public.growth_partner_app_profiles)
     or v_guard.products is distinct from (select count(*) from public.csp_sales_products)
     or v_guard.perms is distinct from (select count(*) from public.aipify_permissions)
     or v_guard.role_perms is distinct from (select count(*) from public.organization_role_permissions)
     or v_guard.user_perms is distinct from (select count(*) from public.organization_user_permissions)
     or v_guard.modules is distinct from (select count(*) from public.organization_modules)
     or v_guard.attributed_orgs is distinct from (
       select count(*) from public.organizations where attributed_growth_partner_profile_id is not null
     )
     or (select count(*) from public.growth_partner_tracking_links) <> 0
     or (select count(*) from public.growth_partner_attribution_touches) <> 0
     or (select count(*) from public.growth_partner_attributed_customers) <> 0 then
    raise exception 'candidate changed organizations, products, permissions, or created link data';
  end if;
end
$$;

drop table if exists gp_link_foundation_guard;
