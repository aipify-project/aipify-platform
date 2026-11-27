-- DO NOT APPLY without the exact owner YES for this file and its SHA256.
-- Staging project auedugihkduoaikfusqe only. No Production. No email.
-- Do not apply csp_personal_sales_page_interest_v1 again. That candidate is already
-- recorded on staging. This file only tightens the live register.
-- The public interest form stays off. This file grants the register function to nobody
-- except the database owner. It does not create a seller, a membership, or a lead.

do $precheck$
begin
  if not exists (
    select 1 from pg_roles where rolname = 'postgres' and rolbypassrls
  ) or not exists (
    select 1 from pg_roles where rolname = 'service_role' and rolbypassrls
  ) then
    raise exception 'lead register force would block the database owner or service role';
  end if;

  if exists (
    select 1
      from pg_proc p
      join pg_namespace n on n.oid = p.pronamespace
     where n.nspname = 'public'
       and p.prosrc ilike '%growth_partner_ops_leads%'
       and p.proname not in (
         'register_personal_sales_page_interest',
         'list_own_personal_sales_page_interests',
         'list_platform_personal_sales_page_interests'
       )
       and not (
         p.prosecdef
         and exists (
           select 1 from pg_roles r
            where r.rolname = pg_get_userbyid(p.proowner)
              and r.rolbypassrls
         )
       )
  ) then
    raise exception 'a non-bypass function reads the lead register';
  end if;
end;
$precheck$;

create temporary table _interest_reconcile_snapshot as
select
  (select count(*) from public.growth_partner_ops_leads) as leads,
  (select count(*) from public.growth_partner_app_profiles) as profiles,
  (select count(*) from public.growth_partner_tracking_links) as links,
  (select count(*) from public.organization_role_permissions where permission_key like 'growth_partner.%') as grant_count,
  (select md5(prosrc) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_gp456_access') as access_md5,
  (select md5(prosrc) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_gp455a_resolve_slug') as resolve_md5,
  (select md5(prosrc) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public' and p.proname = '_gp455_log') as log_md5;

alter table public.growth_partner_ops_leads
  add column if not exists contact_email text,
  add column if not exists product_key text,
  add column if not exists locale text,
  add column if not exists follow_up_acknowledged boolean not null default false,
  add column if not exists registered_at timestamptz,
  add column if not exists idempotency_key text;

alter table public.growth_partner_ops_leads enable row level security;
alter table public.growth_partner_ops_leads force row level security;
revoke all on table public.growth_partner_ops_leads from public, anon, authenticated;

create unique index if not exists growth_partner_ops_leads_psp_email
  on public.growth_partner_ops_leads (profile_id, product_key, lower(contact_email))
  where lead_source = 'personal_sales_page' and contact_email is not null;

create unique index if not exists growth_partner_ops_leads_psp_idem
  on public.growth_partner_ops_leads (profile_id, idempotency_key)
  where idempotency_key is not null;

create index if not exists growth_partner_ops_leads_psp_recent
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

do $verify$
begin
  if (select count(*) from public.growth_partner_ops_leads) <> (select leads from _interest_reconcile_snapshot)
     or (select count(*) from public.growth_partner_app_profiles) <> (select profiles from _interest_reconcile_snapshot)
     or (select count(*) from public.growth_partner_tracking_links) <> (select links from _interest_reconcile_snapshot)
     or (select count(*) from public.organization_role_permissions where permission_key like 'growth_partner.%')
        <> (select grant_count from _interest_reconcile_snapshot)
  then
    raise exception 'interest reconciliation changed leads, profiles, links, or grants';
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

  if (select md5(prosrc) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = '_gp456_access')
       is distinct from (select access_md5 from _interest_reconcile_snapshot)
     or (select md5(prosrc) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = '_gp455a_resolve_slug')
       is distinct from (select resolve_md5 from _interest_reconcile_snapshot)
     or (select md5(prosrc) from pg_proc p join pg_namespace n on n.oid = p.pronamespace
       where n.nspname = 'public' and p.proname = '_gp455_log')
       is distinct from (select log_md5 from _interest_reconcile_snapshot)
  then
    raise exception 'interest reconciliation changed an existing growth partner function';
  end if;

  if not exists (
    select 1 from pg_proc p
     join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'list_platform_personal_sales_page_interests'
      and p.prosrc ilike '%is_platform_admin%'
  ) then
    raise exception 'platform interest list lost its admin check';
  end if;
end;
$verify$;

drop table _interest_reconcile_snapshot;
