-- =============================================================================
-- PREPARED_ONLY — Production first-time Interest Core for personal sales pages
-- Target intended: Aipify Core Production (qbcqoixhrvhnuwphefvw) only.
-- DO NOT APPLY without a separate named owner APPLY YES citing this path + SHA-256.
-- Staging auedugihkduoaikfusqe already has interest Core + reconciliation.
-- Do not apply this file on Staging. Do not re-apply csp_personal_sales_page_interest_v1
-- or staging_growth_partner_personal_page_interest_reconcile_v1.
--
-- Installs the six contact fields, the owner-only register, the certified seller
-- list, and the platform-admin list. Includes the #479 safety deltas:
-- advisory lock before rate limits, forced RLS, locale allow-list, certified
-- gate on the own list, and no execute grant to anon, authenticated, or
-- service_role for the register.
-- Does not create sellers, memberships, grants, leads, commissions, or email.
-- The public form stays closed until a separate application change.
-- =============================================================================

do $precheck$
begin
  if to_regclass('public.growth_partner_ops_leads') is null
     or to_regclass('public.growth_partner_app_profiles') is null
     or to_regclass('public.growth_partner_tracking_links') is null
     or to_regclass('public.csp_sales_products') is null
     or to_regprocedure('public._gp455a_resolve_slug(text)') is null
     or to_regprocedure('public._gp455_log(uuid,uuid,text,text,jsonb)') is null
     or to_regprocedure('public._gp456_access()') is null
     or to_regprocedure('public.is_platform_admin()') is null then
    raise exception 'Interest Core prerequisites are missing';
  end if;

  if to_regprocedure('public.register_personal_sales_page_interest(text,text,text,text,text,text,boolean,text)') is not null
     or to_regprocedure('public.list_own_personal_sales_page_interests()') is not null
     or to_regprocedure('public.list_platform_personal_sales_page_interests()') is not null then
    raise exception 'Interest Core functions already exist; use a separate reconcile candidate';
  end if;

  if (
    select count(*) from information_schema.columns
    where table_schema = 'public' and table_name = 'growth_partner_ops_leads'
      and column_name in ('contact_email','product_key','locale','follow_up_acknowledged','registered_at','idempotency_key')
  ) <> 0 then
    raise exception 'Interest contact fields already exist; refusing a mixed first-time install';
  end if;

  if not exists (select 1 from pg_roles where rolname = 'postgres' and rolbypassrls)
     or not exists (select 1 from pg_roles where rolname = 'service_role' and rolbypassrls) then
    raise exception 'forced RLS would block the database owner or service role';
  end if;
end;
$precheck$;

alter table public.growth_partner_ops_leads
  add column contact_email text,
  add column product_key text,
  add column locale text,
  add column follow_up_acknowledged boolean not null default false,
  add column registered_at timestamptz,
  add column idempotency_key text;

alter table public.growth_partner_ops_leads enable row level security;
alter table public.growth_partner_ops_leads force row level security;
revoke all on table public.growth_partner_ops_leads from public, anon, authenticated;

create unique index growth_partner_ops_leads_psp_email
  on public.growth_partner_ops_leads (profile_id, product_key, lower(contact_email))
  where lead_source = 'personal_sales_page' and contact_email is not null;

create unique index growth_partner_ops_leads_psp_idem
  on public.growth_partner_ops_leads (profile_id, idempotency_key)
  where idempotency_key is not null;

create index growth_partner_ops_leads_psp_recent
  on public.growth_partner_ops_leads (profile_id, registered_at desc)
  where lead_source = 'personal_sales_page';

create or replace function public.register_personal_sales_page_interest(
  p_code text,
  p_email text,
  p_display_name text,
  p_product_key text,
  p_locale text,
  p_idempotency_key text,
  p_follow_up_acknowledged boolean,
  p_company_website text
) returns jsonb
language plpgsql
security definer
set search_path = public
as $fn$
declare
  v_row record;
  v_status text;
  v_org uuid;
  v_email text;
  v_name text;
  v_product text;
  v_locale text;
  v_key text;
  v_id uuid;
begin
  if length(btrim(coalesce(p_company_website, ''))) > 0 then
    return jsonb_build_object('ok', false, 'stored', false, 'duplicate', false, 'error', 'closed');
  end if;
  if p_follow_up_acknowledged is distinct from true then
    return jsonb_build_object('ok', false, 'stored', false, 'duplicate', false, 'error', 'acknowledgement_required');
  end if;

  select * into v_row from public._gp455a_resolve_slug(p_code) limit 1;
  if v_row.profile_id is null or v_row.link_status is distinct from 'active' then
    return jsonb_build_object('ok', false, 'stored', false, 'duplicate', false, 'error', 'closed');
  end if;

  select partner_status, organization_id into v_status, v_org
    from public.growth_partner_app_profiles
   where id = v_row.profile_id;
  if v_status is distinct from 'certified' then
    return jsonb_build_object('ok', false, 'stored', false, 'duplicate', false, 'error', 'closed');
  end if;

  v_email := lower(btrim(coalesce(p_email, '')));
  v_name := btrim(coalesce(p_display_name, ''));
  v_product := lower(btrim(coalesce(p_product_key, '')));
  v_locale := lower(btrim(coalesce(p_locale, '')));
  v_key := btrim(coalesce(p_idempotency_key, ''));

  if v_email !~ '^[^@\s]{1,64}@[^@\s]{1,255}\.[^@\s]{2,}$' or length(v_email) > 254 then
    return jsonb_build_object('ok', false, 'stored', false, 'duplicate', false, 'error', 'invalid_email');
  end if;
  if v_name !~ '^[^<>[:cntrl:]]{1,120}$' then
    return jsonb_build_object('ok', false, 'stored', false, 'duplicate', false, 'error', 'invalid_name');
  end if;
  if v_product !~ '^[a-z0-9_]{2,40}$' then
    return jsonb_build_object('ok', false, 'stored', false, 'duplicate', false, 'error', 'invalid');
  end if;
  if v_locale not in ('en', 'no', 'sv', 'da', 'pl', 'uk', 'es') then
    return jsonb_build_object('ok', false, 'stored', false, 'duplicate', false, 'error', 'invalid');
  end if;
  if v_key !~ '^[A-Za-z0-9_-]{8,80}$' then
    return jsonb_build_object('ok', false, 'stored', false, 'duplicate', false, 'error', 'invalid');
  end if;
  if not exists (
    select 1 from public.csp_sales_products
     where product_key = v_product and published = true
  ) then
    return jsonb_build_object('ok', false, 'stored', false, 'duplicate', false, 'error', 'invalid_product');
  end if;

  perform pg_advisory_xact_lock(
    hashtext('growth-partner-personal-page-interest'),
    hashtext(v_row.profile_id::text)
  );

  if (
    select count(*) from public.growth_partner_ops_leads
     where profile_id = v_row.profile_id
       and lead_source = 'personal_sales_page'
       and registered_at > now() - interval '1 hour'
  ) >= 8 then
    return jsonb_build_object('ok', false, 'stored', false, 'duplicate', false, 'error', 'rate_limited');
  end if;
  if (
    select count(*) from public.growth_partner_ops_leads
     where profile_id = v_row.profile_id
       and lead_source = 'personal_sales_page'
       and lower(contact_email) = v_email
       and registered_at > now() - interval '1 day'
  ) >= 3 then
    return jsonb_build_object('ok', false, 'stored', false, 'duplicate', false, 'error', 'rate_limited');
  end if;

  insert into public.growth_partner_ops_leads (
    profile_id, lead_key, company_name, contact_name, contact_email, product_key, locale,
    lead_status, lead_source, follow_up_acknowledged, registered_at, idempotency_key, status_key
  ) values (
    v_row.profile_id,
    'psp:' || v_product || ':' || md5(v_email),
    '',
    v_name,
    v_email,
    v_product,
    v_locale,
    'new',
    'personal_sales_page',
    true,
    now(),
    v_key,
    'information'
  )
  on conflict do nothing
  returning id into v_id;

  perform public._gp455_log(
    v_row.profile_id,
    v_org,
    'personal_sales_page_interest',
    'Personal page interest',
    jsonb_build_object('stored', v_id is not null, 'source', 'personal_sales_page')
  );

  return jsonb_build_object(
    'ok', true,
    'stored', v_id is not null,
    'duplicate', v_id is null
  );
end;
$fn$;

revoke all on function public.register_personal_sales_page_interest(text, text, text, text, text, text, boolean, text)
  from public, anon, authenticated, service_role;

create or replace function public.list_own_personal_sales_page_interests()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $fn$
declare
  v_ctx jsonb;
  v_profile_id uuid;
  v_rows jsonb;
begin
  v_ctx := public._gp456_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true'
     or v_ctx->>'partner_status' is distinct from 'certified' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  v_profile_id := (v_ctx->>'profile_id')::uuid;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'contact_name', l.contact_name,
    'contact_email', l.contact_email,
    'product_key', l.product_key,
    'registered_at', l.registered_at,
    'lead_status', l.lead_status
  ) order by l.registered_at desc), '[]'::jsonb)
    into v_rows
    from public.growth_partner_ops_leads l
   where l.profile_id = v_profile_id
     and l.lead_source = 'personal_sales_page';
  return jsonb_build_object('ok', true, 'interests', v_rows);
end;
$fn$;

revoke all on function public.list_own_personal_sales_page_interests() from public, anon;
grant execute on function public.list_own_personal_sales_page_interests() to authenticated;

create or replace function public.list_platform_personal_sales_page_interests()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $fn$
declare
  v_rows jsonb;
begin
  if not public.is_platform_admin() then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'contact_name', l.contact_name,
    'contact_email', l.contact_email,
    'product_key', l.product_key,
    'registered_at', l.registered_at,
    'lead_source', l.lead_source,
    'lead_status', l.lead_status,
    'partner_name', p.full_name
  ) order by l.registered_at desc), '[]'::jsonb)
    into v_rows
    from public.growth_partner_ops_leads l
    join public.growth_partner_app_profiles p on p.id = l.profile_id
   where l.lead_source = 'personal_sales_page';
  return jsonb_build_object('ok', true, 'interests', v_rows);
end;
$fn$;

revoke all on function public.list_platform_personal_sales_page_interests() from public, anon;
grant execute on function public.list_platform_personal_sales_page_interests() to authenticated;

do $verify$
begin
  if (
    select count(*) from information_schema.columns
    where table_schema = 'public' and table_name = 'growth_partner_ops_leads'
      and column_name in ('contact_email','product_key','locale','follow_up_acknowledged','registered_at','idempotency_key')
  ) <> 6 then
    raise exception 'Interest contact fields were not installed';
  end if;

  if not exists (
    select 1 from pg_class c
    where c.oid = 'public.growth_partner_ops_leads'::regclass
      and c.relrowsecurity
      and c.relforcerowsecurity
      and c.relacl::text = '{postgres=arwdDxtm/postgres,service_role=arwdDxtm/postgres}'
  ) then
    raise exception 'lead register grants or row security drifted';
  end if;

  if exists (
    select 1
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.proname = 'register_personal_sales_page_interest'
       and (
         p.proacl::text ilike '%anon=%'
         or p.proacl::text ilike '%authenticated=%'
         or p.proacl::text ilike '%service_role=%'
       )
  ) then
    raise exception 'interest register is executable by a client role';
  end if;

  if position('pg_advisory_xact_lock' in (
       select prosrc from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = 'register_personal_sales_page_interest'
     )) = 0 then
    raise exception 'interest register is missing the advisory lock';
  end if;

  if position('partner_status'' is distinct from ''certified''' in (
       select prosrc from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = 'list_own_personal_sales_page_interests'
     )) = 0 then
    raise exception 'own interest list is missing the certified gate';
  end if;

  if position('is_platform_admin' in (
       select prosrc from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = 'list_platform_personal_sales_page_interests'
     )) = 0 then
    raise exception 'platform interest list lost its admin check';
  end if;

  if (select count(*) from public.growth_partner_ops_leads) <> 0 then
    raise exception 'Interest Core install must not create leads';
  end if;
end;
$verify$;
