-- DO NOT APPLY.
-- Personal sales page interest, stored on the existing Growth Partner lead list.
-- Seller identity comes only from the approved public link code.
-- A lead is not a sale and does not write commission.
-- The application gate stays OFF until this file is applied and the write is verified.

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
as $$
declare
  v_row record;
  v_status text;
  v_org uuid;
  v_email text;
  v_name text;
  v_product text;
  v_id uuid;
begin
  if length(btrim(coalesce(p_company_website, ''))) > 0 then
    return jsonb_build_object('ok', false, 'stored', false, 'error', 'closed');
  end if;
  if p_follow_up_acknowledged is distinct from true then
    return jsonb_build_object('ok', false, 'stored', false, 'error', 'acknowledgement_required');
  end if;

  select * into v_row from public._gp455a_resolve_slug(p_code) limit 1;
  if v_row.profile_id is null or v_row.link_status is distinct from 'active' then
    return jsonb_build_object('ok', false, 'stored', false, 'error', 'closed');
  end if;

  select partner_status, organization_id into v_status, v_org
    from public.growth_partner_app_profiles
   where id = v_row.profile_id;
  if v_status is distinct from 'certified' then
    return jsonb_build_object('ok', false, 'stored', false, 'error', 'closed');
  end if;

  v_email := lower(btrim(coalesce(p_email, '')));
  v_name := left(regexp_replace(btrim(coalesce(p_display_name, '')), '[<>]', '', 'g'), 120);
  v_product := lower(btrim(coalesce(p_product_key, '')));
  if v_email !~ '^[^@\s]{1,64}@[^@\s]{1,255}\.[^@\s]{2,}$' or length(v_email) > 254 then
    return jsonb_build_object('ok', false, 'stored', false, 'error', 'invalid_email');
  end if;
  if length(v_name) < 1 then
    return jsonb_build_object('ok', false, 'stored', false, 'error', 'invalid_name');
  end if;
  if v_product !~ '^[a-z0-9_]{2,40}$' or p_locale !~ '^[a-z]{2}$' then
    return jsonb_build_object('ok', false, 'stored', false, 'error', 'invalid');
  end if;
  if length(btrim(coalesce(p_idempotency_key, ''))) < 8
     or length(btrim(p_idempotency_key)) > 80 then
    return jsonb_build_object('ok', false, 'stored', false, 'error', 'invalid');
  end if;
  if not exists (
    select 1 from public.csp_sales_products
     where product_key = v_product and published = true
  ) then
    return jsonb_build_object('ok', false, 'stored', false, 'error', 'invalid_product');
  end if;

  if (
    select count(*) from public.growth_partner_ops_leads
     where profile_id = v_row.profile_id
       and lead_source = 'personal_sales_page'
       and registered_at > now() - interval '1 hour'
  ) >= 8 then
    return jsonb_build_object('ok', false, 'stored', false, 'error', 'rate_limited');
  end if;
  if (
    select count(*) from public.growth_partner_ops_leads
     where profile_id = v_row.profile_id
       and lead_source = 'personal_sales_page'
       and lower(contact_email) = v_email
       and registered_at > now() - interval '1 day'
  ) >= 3 then
    return jsonb_build_object('ok', false, 'stored', false, 'error', 'rate_limited');
  end if;

  insert into public.growth_partner_ops_leads (
    profile_id, lead_key, company_name, contact_name, contact_email, product_key, locale,
    lead_status, lead_source, follow_up_acknowledged, registered_at, idempotency_key, status_key
  ) values (
    v_row.profile_id,
    'psp:' || v_product || ':' || md5(v_email),
    v_name,
    v_name,
    v_email,
    v_product,
    p_locale,
    'new',
    'personal_sales_page',
    true,
    now(),
    btrim(p_idempotency_key),
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

  return jsonb_build_object('ok', true, 'stored', v_id is not null, 'duplicate', v_id is null);
end;
$$;

revoke all on function public.register_personal_sales_page_interest(text, text, text, text, text, text, boolean, text)
  from public, anon, authenticated;

create or replace function public.list_own_personal_sales_page_interests()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_ctx jsonb;
  v_profile_id uuid;
  v_rows jsonb;
begin
  v_ctx := public._gp456_access();
  if coalesce(v_ctx->>'found', 'false') <> 'true' then
    return jsonb_build_object('ok', false, 'error', 'forbidden');
  end if;
  v_profile_id := (v_ctx->>'profile_id')::uuid;
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', l.id,
    'contact_name', l.contact_name,
    'contact_email', l.contact_email,
    'product_key', l.product_key,
    'registered_at', l.registered_at,
    'lead_source', l.lead_source,
    'lead_status', l.lead_status
  ) order by l.registered_at desc), '[]'::jsonb)
    into v_rows
    from public.growth_partner_ops_leads l
   where l.profile_id = v_profile_id
     and l.lead_source = 'personal_sales_page';
  return jsonb_build_object('ok', true, 'interests', v_rows);
end;
$$;

revoke all on function public.list_own_personal_sales_page_interests() from public, anon;
grant execute on function public.list_own_personal_sales_page_interests() to authenticated;

create or replace function public.list_platform_personal_sales_page_interests()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
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
$$;

revoke all on function public.list_platform_personal_sales_page_interests() from public, anon;
grant execute on function public.list_platform_personal_sales_page_interests() to authenticated;

-- No grant of the register function to anonymous or signed-in clients.
-- Do not insert into csp_qualified_sales, commission ledger, or settlement tables.
